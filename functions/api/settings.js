// GET /api/settings — public
export async function onRequest({ env }) {
  try {
    const raw = env.INANC_KV ? await env.INANC_KV.get("settings") : null;
    const data = raw ? JSON.parse(raw) : { reviewsVisible: true };
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=30" },
    });
  } catch {
    return new Response(JSON.stringify({ reviewsVisible: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
