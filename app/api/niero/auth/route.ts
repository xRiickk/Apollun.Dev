import {
  AUTHORIZED_NIERO_EMAIL as ALLOWED_EMAIL,
  SESSION_COOKIE,
  getNieroDatabase as database,
  getNieroUser as getUser,
  readNieroSessionCookie as readCookie,
  sha256,
  toHex,
  validNieroMutationOrigin as verifyOrigin,
} from "../_auth";
const SESSION_SECONDS = 60 * 60 * 24 * 14;
const encoder = new TextEncoder();

type UserRow = { id: string; email: string; password_hash?: string };

function json(data: unknown, status = 200, headers?: HeadersInit) {
  return Response.json(data, { status, headers });
}

async function hashPassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: encoder.encode(salt),
      iterations: 310_000,
    },
    key,
    256,
  );
  return toHex(bits);
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1)
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
}

function sessionCookie(token: string, maxAge: number) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export async function GET(request: Request) {
  try {
    const user = await getUser(request);
    if (!user) return json({ user: null }, 401);
    return json({ user: { email: user.email } }, 200, {
      "Cache-Control": "no-store",
    });
  } catch {
    return json({ error: "Não foi possível validar sua sessão." }, 503);
  }
}

export async function POST(request: Request) {
  try {
    if (!verifyOrigin(request))
      return json({ error: "Origem não permitida." }, 403);
    const payload = (await request.json()) as {
      action?: string;
      email?: string;
      password?: string;
      invitation?: string;
    };
    const db = database();

    if (payload.action === "setup") {
      const email = payload.email?.trim().toLowerCase();
      const password = payload.password ?? "";
      const invitation = payload.invitation ?? "";
      if (
        email !== ALLOWED_EMAIL ||
        password.length < 12 ||
        password.length > 128 ||
        invitation.length < 32
      ) {
        return json(
          {
            error:
              "Confira o convite, o e-mail autorizado e use uma senha com pelo menos 12 caracteres.",
          },
          400,
        );
      }
      const invite = await db
        .prepare(
          `SELECT token_hash FROM niero_invites WHERE token_hash = ? AND email = ? AND expires_at > CURRENT_TIMESTAMP AND consumed_at IS NULL LIMIT 1`,
        )
        .bind(await sha256(invitation), email)
        .first<{ token_hash: string }>();
      if (!invite)
        return json(
          { error: "Convite inválido, expirado ou já utilizado." },
          400,
        );
      const existing = await db
        .prepare("SELECT id FROM niero_users WHERE email = ? LIMIT 1")
        .bind(email)
        .first<{ id: string }>();
      if (existing) return json({ error: "A conta já foi ativada." }, 409);

      const id = crypto.randomUUID();
      const salt = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
      const passwordHash = `pbkdf2-sha256$310000$${salt}$${await hashPassword(password, salt)}`;
      const token = toHex(crypto.getRandomValues(new Uint8Array(32)).buffer);
      const now = new Date();
      const expires = new Date(
        now.getTime() + SESSION_SECONDS * 1000,
      ).toISOString();
      await db.batch([
        db
          .prepare(
            "INSERT INTO niero_users (id, email, password_hash) VALUES (?, ?, ?)",
          )
          .bind(id, email, passwordHash),
        db
          .prepare(
            "UPDATE niero_invites SET consumed_at = CURRENT_TIMESTAMP WHERE token_hash = ? AND consumed_at IS NULL",
          )
          .bind(invite.token_hash),
        db
          .prepare(
            "INSERT INTO niero_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
          )
          .bind(await sha256(token), id, expires),
      ]);
      return json({ user: { email } }, 201, {
        "Set-Cookie": sessionCookie(token, SESSION_SECONDS),
        "Cache-Control": "no-store",
      });
    }

    if (payload.action === "login") {
      const email = payload.email?.trim().toLowerCase() ?? "";
      const password = payload.password ?? "";
      if (email !== ALLOWED_EMAIL || password.length > 128)
        return json({ error: "E-mail ou senha incorretos." }, 401);
      const user = await db
        .prepare(
          "SELECT id, email, password_hash FROM niero_users WHERE email = ? LIMIT 1",
        )
        .bind(email)
        .first<UserRow>();
      const [algorithm, iterations, salt, expectedHash] =
        user?.password_hash?.split("$") ?? [];
      const actualHash =
        user && algorithm === "pbkdf2-sha256" && iterations === "310000"
          ? await hashPassword(password, salt)
          : await hashPassword(
              password || "invalid",
              "apollun-fixed-dummy-salt",
            );
      if (
        !user ||
        algorithm !== "pbkdf2-sha256" ||
        iterations !== "310000" ||
        !safeEqual(actualHash, expectedHash ?? "")
      )
        return json({ error: "E-mail ou senha incorretos." }, 401);

      const token = toHex(crypto.getRandomValues(new Uint8Array(32)).buffer);
      const expires = new Date(
        Date.now() + SESSION_SECONDS * 1000,
      ).toISOString();
      await db
        .prepare(
          "INSERT INTO niero_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
        )
        .bind(await sha256(token), user.id, expires)
        .run();
      return json({ user: { email: user.email } }, 200, {
        "Set-Cookie": sessionCookie(token, SESSION_SECONDS),
        "Cache-Control": "no-store",
      });
    }

    if (payload.action === "logout") {
      const token = readCookie(request);
      if (token)
        await db
          .prepare("DELETE FROM niero_sessions WHERE token_hash = ?")
          .bind(await sha256(token))
          .run();
      return json({ ok: true }, 200, {
        "Set-Cookie": sessionCookie("", 0),
        "Cache-Control": "no-store",
      });
    }

    return json({ error: "Ação inválida." }, 400);
  } catch {
    return json({ error: "Não foi possível concluir o acesso agora." }, 503);
  }
}
