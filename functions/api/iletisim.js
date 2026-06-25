const DEFAULT = {
  telefon: "905334409803",
  email: "inancoaching@gmail.com",
  konum: "Altıeylül, BALIKESİR",
  instagram: "https://www.instagram.com/inanccoaching/",
  vergiLevhasi: "/vergi-levhasi.png.png",
};

export async function onRequest({ env }) {
  try {
    const raw = env.INANC_KV ? await env.INANC_KV.get("iletisim") : null;
    return new Response(JSON.stringify(raw ? JSON.parse(raw) : DEFAULT), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" },
    });
  } catch {
    return new Response(JSON.stringify(DEFAULT), { headers: { "Content-Type": "application/json" } });
  }
}
