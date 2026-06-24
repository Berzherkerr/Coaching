// GET /api/blog — public, yayınlanmış yazıları döner
export async function onRequest({ env }) {
  try {
    const raw = env.INANC_KV ? await env.INANC_KV.get("blog_posts") : null;
    const all = raw ? JSON.parse(raw) : [];
    const published = all.filter((p) => !p.draft).sort((a, b) => b.publishedAt - a.publishedAt);
    return new Response(JSON.stringify({ posts: published }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" },
    });
  } catch {
    return new Response(JSON.stringify({ posts: [] }), { headers: { "Content-Type": "application/json" } });
  }
}
