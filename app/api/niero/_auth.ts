import { env } from "cloudflare:workers";

export const AUTHORIZED_NIERO_EMAIL = "srtaniero@gmail.com";
export const SESSION_COOKIE = "apollun_niero_session";

export type NieroUser = { id: string; email: string };

export function getNieroDatabase(): D1Database {
  const db = (env as { DB?: D1Database }).DB;
  if (!db) throw new Error("D1 binding DB is unavailable");
  return db;
}

export function readNieroSessionCookie(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const part = cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${SESSION_COOKIE}=`));
  if (!part) return null;
  try {
    return decodeURIComponent(part.slice(SESSION_COOKIE.length + 1));
  } catch {
    return null;
  }
}

export function toHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function sha256(value: string) {
  return toHex(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
  );
}

export async function getNieroUser(
  request: Request,
): Promise<NieroUser | null> {
  const token = readNieroSessionCookie(request);
  if (!token) return null;
  return getNieroDatabase()
    .prepare(
      `SELECT u.id, u.email FROM niero_sessions s JOIN niero_users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > CURRENT_TIMESTAMP LIMIT 1`,
    )
    .bind(await sha256(token))
    .first<NieroUser>();
}

export function validNieroMutationOrigin(request: Request) {
  const origin = request.headers.get("origin");
  try {
    return !!origin && new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
