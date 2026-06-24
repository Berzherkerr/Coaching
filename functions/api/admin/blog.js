// GET   /api/admin/blog          → tüm yazılar (taslaklar dahil)
// POST  /api/admin/blog          → yeni yazı
// PUT   /api/admin/blog?id=xxx   → yazıyı güncelle
// DELETE /api/admin/blog?id=xxx  → yazıyı sil
import { verifyJWT } from "../../_jwt.js";

async function authenticate({ env, request }) {
  const token = (request.headers.get("Authorization") || "").replace("Bearer ", "").trim();
  return verifyJWT(token, env.JWT_SECRET || "change-this-secret");
}

async function getPosts(env) {
  const raw = env.INANC_KV ? await env.INANC_KV.get("blog_posts") : null;
  return raw ? JSON.parse(raw) : [];
}

async function savePosts(env, posts) {
  if (env.INANC_KV) await env.INANC_KV.put("blog_posts", JSON.stringify(posts));
}

export async function onRequest({ env, request }) {
  if (!await authenticate({ env, request })) return json({ error: "Yetkisiz" }, 401);

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (request.method === "GET") {
    const posts = await getPosts(env);
    return json({ posts: posts.sort((a, b) => b.publishedAt - a.publishedAt) });
  }

  if (request.method === "POST") {
    const body = await request.json();
    const posts = await getPosts(env);
    const newPost = {
      id: Date.now().toString(),
      title: body.title || "Başlıksız",
      content: body.content || "",
      excerpt: (body.content || "").slice(0, 160).trim(),
      coverImage: body.coverImage || "",
      contentImages: Array.isArray(body.contentImages) ? body.contentImages : [],
      publishedAt: Date.now(),
      draft: body.draft ?? true,
    };
    posts.unshift(newPost);
    await savePosts(env, posts);
    return json({ ok: true, post: newPost });
  }

  if (request.method === "PUT" && id) {
    const body = await request.json();
    const posts = await getPosts(env);
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return json({ error: "Yazı bulunamadı" }, 404);
    posts[idx] = {
      ...posts[idx],
      title: body.title ?? posts[idx].title,
      content: body.content ?? posts[idx].content,
      excerpt: (body.content || posts[idx].content).slice(0, 160).trim(),
      coverImage: body.coverImage !== undefined ? body.coverImage : posts[idx].coverImage,
      contentImages: Array.isArray(body.contentImages) ? body.contentImages : posts[idx].contentImages,
      draft: body.draft ?? posts[idx].draft,
    };
    await savePosts(env, posts);
    return json({ ok: true });
  }

  if (request.method === "DELETE" && id) {
    const posts = await getPosts(env);
    await savePosts(env, posts.filter((p) => p.id !== id));
    return json({ ok: true });
  }

  return json({ error: "Desteklenmeyen metod" }, 405);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}
