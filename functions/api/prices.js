// GET /api/prices — public, KV'den fiyatları döner

const DEFAULT_PRICES = [
  { id: "uzaktan", fiyat: "3.000",  sure: "ay" },
  { id: "online",  fiyat: "7.000",  sure: "ay" },
  { id: "birebir", fiyat: "10.000", sure: "ay" },
];

export async function onRequest({ env }) {
  try {
    const raw = env.INANC_KV ? await env.INANC_KV.get("prices") : null;
    const data = raw ? JSON.parse(raw) : { paketler: DEFAULT_PRICES };
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch {
    return new Response(JSON.stringify({ paketler: DEFAULT_PRICES }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
