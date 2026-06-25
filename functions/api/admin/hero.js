import { verifyJWT } from "../../_jwt.js";

const DEFAULT = {
  baslik: "Kendİne yaptığın en İyİ yatırım, bedenİnle başlar.",
  alt: "Yarın değil,",
  cta: "BUGÜN BAŞLA!",
};

async function authenticate({ env, request }) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.replace("Bearer ", "").trim();
  if (!token) return null;
  return verifyJWT(token, env.JWT_SECRET || "change-this-secret");
}

export async function onRequest({ env, request }) {
  const payload = await authenticate({ env, request });
  if (!payload) return json({ error: "Yetkisiz erişim" }, 401);

  if (request.method === "GET") {
    const raw = env.INANC_KV ? await env.INANC_KV.get("hero") : null;
    return json(raw ? JSON.parse(raw) : DEFAULT);
  }

  if (request.method === "PUT") {
    const body = await request.json();
    if (typeof body.baslik !== "string") return json({ error: "Geçersiz veri" }, 400);
    if (env.INANC_KV) await env.INANC_KV.put("hero", JSON.stringify(body));
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
