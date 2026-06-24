export async function onRequest({ env }) {
  try {
    const raw = env.INANC_KV ? await env.INANC_KV.get("schedule") : null;
    const data = raw ? JSON.parse(raw) : { slots: {} };
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch {
    return new Response(JSON.stringify({ slots: {} }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
