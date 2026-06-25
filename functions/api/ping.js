export async function onRequest({ env, request }) {
  if (request.method !== "POST") return res({ ok: true });
  if (!env.INANC_KV) return res({ ok: true });

  const body = await request.json().catch(() => ({}));
  const sid = String(body.sid || "").slice(0, 64);
  if (!sid) return res({ ok: true });

  const now = Date.now();
  const TTL = 5 * 60 * 1000;
  const raw = await env.INANC_KV.get("active_sessions");
  const sessions = raw ? JSON.parse(raw) : {};

  const updated = Object.fromEntries(
    Object.entries(sessions).filter(([, ts]) => now - ts < TTL)
  );
  updated[sid] = now;

  await env.INANC_KV.put("active_sessions", JSON.stringify(updated));
  return res({ ok: true });
}

function res(data) {
  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
}
