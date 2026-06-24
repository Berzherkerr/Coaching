// GET /api/admin/schedule — mevcut programı döner (auth gerekli)
// PUT /api/admin/schedule — programı günceller (auth gerekli)
import { verifyJWT } from "../../_jwt.js";

async function authenticate({ env, request }) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.replace("Bearer ", "").trim();
  if (!token) return null;
  const secret = env.JWT_SECRET || "change-this-secret";
  return verifyJWT(token, secret);
}

export async function onRequest({ env, request }) {
  const payload = await authenticate({ env, request });
  if (!payload) return json({ error: "Yetkisiz erişim" }, 401);

  if (request.method === "GET") {
    const raw = env.INANC_KV ? await env.INANC_KV.get("schedule") : null;
    const data = raw ? JSON.parse(raw) : { slots: {} };
    return json(data);
  }

  if (request.method === "PUT") {
    const body = await request.json();
    if (!body.slots || typeof body.slots !== "object") {
      return json({ error: "Geçersiz veri" }, 400);
    }
    if (env.INANC_KV) {
      await env.INANC_KV.put("schedule", JSON.stringify({ slots: body.slots }));
    }
    return json({ ok: true });
  }

  return json({ error: "Desteklenmeyen metod" }, 405);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
