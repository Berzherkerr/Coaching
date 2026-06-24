import { verifyJWT } from "../../_jwt.js";

async function authenticate({ env, request }) {
  const token = (request.headers.get("Authorization") || "").replace("Bearer ", "").trim();
  return verifyJWT(token, env.JWT_SECRET || "change-this-secret");
}

export async function onRequest({ env, request }) {
  if (!await authenticate({ env, request })) return json({ error: "Yetkisiz" }, 401);

  if (request.method === "GET") {
    const raw = env.INANC_KV ? await env.INANC_KV.get("settings") : null;
    return json(raw ? JSON.parse(raw) : { reviewsVisible: true });
  }

  if (request.method === "PUT") {
    const body = await request.json();
    const current = env.INANC_KV ? await env.INANC_KV.get("settings") : null;
    const merged = { ...(current ? JSON.parse(current) : {}), ...body };
    if (env.INANC_KV) await env.INANC_KV.put("settings", JSON.stringify(merged));
    return json({ ok: true });
  }

  return json({ error: "Desteklenmeyen metod" }, 405);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}
