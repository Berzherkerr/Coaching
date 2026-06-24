import { verifyJWT } from "../../_jwt.js";

const DEFAULT_PRICES = [
  { id: "uzaktan", fiyat: "3.000",  sure: "ay" },
  { id: "online",  fiyat: "7.000",  sure: "ay" },
  { id: "birebir", fiyat: "10.000", sure: "ay" },
];

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
    const raw = env.INANC_KV ? await env.INANC_KV.get("prices") : null;
    const data = raw ? JSON.parse(raw) : { paketler: DEFAULT_PRICES };
    return json(data);
  }

  if (request.method === "PUT") {
    const body = await request.json();
    if (!Array.isArray(body.paketler)) return json({ error: "Geçersiz veri" }, 400);

    if (env.INANC_KV) {
      await env.INANC_KV.put("prices", JSON.stringify({ paketler: body.paketler }));
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
