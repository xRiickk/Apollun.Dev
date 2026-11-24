import {
  getNieroDatabase,
  getNieroUser,
  validNieroMutationOrigin,
} from "../_auth";

const noStore = { "Cache-Control": "no-store" };
const allowedKinds = new Set(["meeting", "task", "deadline"]);

export async function GET(request: Request) {
  try {
    const user = await getNieroUser(request);
    if (!user)
      return Response.json(
        { error: "Não autenticado." },
        { status: 401, headers: noStore },
      );
    const rows = await getNieroDatabase()
      .prepare(
        "SELECT id, title, kind, description, starts_at AS startsAt, ends_at AS endsAt, status, created_at AS createdAt FROM niero_work_items WHERE user_id = ? AND status != 'cancelled' ORDER BY CASE WHEN starts_at IS NULL THEN 1 ELSE 0 END, starts_at ASC, created_at DESC LIMIT 300",
      )
      .bind(user.id)
      .all();
    return Response.json({ items: rows.results }, { headers: noStore });
  } catch {
    return Response.json(
      { error: "Não foi possível carregar a agenda." },
      { status: 503, headers: noStore },
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!validNieroMutationOrigin(request))
      return Response.json({ error: "Origem não permitida." }, { status: 403 });
    const user = await getNieroUser(request);
    if (!user)
      return Response.json(
        { error: "Não autenticado." },
        { status: 401, headers: noStore },
      );
    const payload = (await request.json()) as {
      title?: string;
      kind?: string;
      description?: string;
      startsAt?: string | null;
      endsAt?: string | null;
    };
    const title = payload.title?.trim() ?? "";
    const kind = payload.kind ?? "task";
    const description = payload.description?.trim() ?? "";
    if (
      !title ||
      title.length > 120 ||
      !allowedKinds.has(kind) ||
      description.length > 2000
    )
      return Response.json(
        {
          error:
            "Confira o título, tipo e detalhes (limite de 120 e 2.000 caracteres).",
        },
        { status: 400 },
      );
    const startsAt = payload.startsAt ?? null;
    const endsAt = payload.endsAt ?? null;
    if (
      (startsAt && !Number.isFinite(Date.parse(startsAt))) ||
      (endsAt && !Number.isFinite(Date.parse(endsAt))) ||
      (startsAt && endsAt && Date.parse(endsAt) <= Date.parse(startsAt))
    )
      return Response.json(
        { error: "Confira as datas e horários." },
        { status: 400 },
      );
    const id = crypto.randomUUID();
    await getNieroDatabase()
      .prepare(
        "INSERT INTO niero_work_items (id, user_id, title, kind, description, starts_at, ends_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(id, user.id, title, kind, description, startsAt, endsAt)
      .run();
    return Response.json(
      {
        item: {
          id,
          title,
          kind,
          description,
          startsAt,
          endsAt,
          status: "open",
        },
      },
      { status: 201, headers: noStore },
    );
  } catch {
    return Response.json(
      { error: "Não foi possível salvar o item." },
      { status: 503, headers: noStore },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    if (!validNieroMutationOrigin(request))
      return Response.json({ error: "Origem não permitida." }, { status: 403 });
    const user = await getNieroUser(request);
    if (!user)
      return Response.json(
        { error: "Não autenticado." },
        { status: 401, headers: noStore },
      );
    const payload = (await request.json()) as { id?: string; status?: string };
    if (
      !payload.id ||
      !["open", "done", "cancelled"].includes(payload.status ?? "")
    )
      return Response.json({ error: "Atualização inválida." }, { status: 400 });
    const result = await getNieroDatabase()
      .prepare(
        "UPDATE niero_work_items SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?",
      )
      .bind(payload.status, payload.id, user.id)
      .run();
    if (!result.meta.changes)
      return Response.json({ error: "Item não encontrado." }, { status: 404 });
    return Response.json({ ok: true }, { headers: noStore });
  } catch {
    return Response.json(
      { error: "Não foi possível atualizar o item." },
      { status: 503, headers: noStore },
    );
  }
}
