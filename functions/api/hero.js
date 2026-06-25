const DEFAULT = {
  baslik: "Kendİne yaptığın en İyİ yatırım, bedenİnle başlar.",
  alt: "Yarın değil,",
  cta: "BUGÜN BAŞLA!",
};

export async function onRequest({ env }) {
  try {
    const raw = env.INANC_KV ? await env.INANC_KV.get("hero") : null;
    return new Response(JSON.stringify(raw ? JSON.parse(raw) : DEFAULT), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" },
    });
  } catch {
    return new Response(JSON.stringify(DEFAULT), { headers: { "Content-Type": "application/json" } });
  }
}
