export async function onRequest({ env, request }) {
  if (request.method !== "POST") return res({ ok: true });
  if (!env.INANC_KV) return res({ ok: true });

  const totalRaw = await env.INANC_KV.get("stats_total");
  const total = totalRaw ? parseInt(totalRaw) + 1 : 1;
  await env.INANC_KV.put("stats_total", total.toString());

  const today = new Date().toISOString().slice(0, 10);
  const dayRaw = await env.INANC_KV.get(`stats_day_${today}`);
  const day = dayRaw ? parseInt(dayRaw) + 1 : 1;
  await env.INANC_KV.put(`stats_day_${today}`, day.toString(), { expirationTtl: 172800 });

  return res({ ok: true });
}

function res(data) {
  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
}
