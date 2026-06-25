import { verifyJWT } from "../../_jwt.js";

async function authenticate({ env, request }) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.replace("Bearer ", "").trim();
  if (!token) return null;
  return verifyJWT(token, env.JWT_SECRET || "change-this-secret");
}

export async function onRequest({ env, request }) {
  const payload = await authenticate({ env, request });
  if (!payload) return json({ error: "Yetkisiz erişim" }, 401);

  if (!env.INANC_KV) return json({ total: 0, active: 0, today: 0 });

  const today = new Date().toISOString().slice(0, 10);
  const [totalRaw, sessionsRaw, dayRaw] = await Promise.all([
    env.INANC_KV.get("stats_total"),
    env.INANC_KV.get("active_sessions"),
    env.INANC_KV.get(`stats_day_${today}`),
  ]);

  const total = totalRaw ? parseInt(totalRaw) : 0;
  const todayCount = dayRaw ? parseInt(dayRaw) : 0;

  const sessions = sessionsRaw ? JSON.parse(sessionsRaw) : {};
  const now = Date.now();
  const active = Object.values(sessions).filter((ts) => now - ts < 5 * 60 * 1000).length;

  return json({ total, active, today: todayCount });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
