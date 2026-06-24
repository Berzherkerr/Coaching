// POST /api/admin/login
import { createJWT } from "../../_jwt.js";

export async function onRequestPost({ env, request }) {
  try {
    const { password } = await request.json();

    const adminPassword = env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return json({ error: "ADMIN_PASSWORD ortam değişkeni tanımlanmamış" }, 500);
    }

    if (password !== adminPassword) {
      return json({ error: "Hatalı şifre" }, 401);
    }

    const secret = env.JWT_SECRET || "change-this-secret";
    const token = await createJWT(
      { role: "admin", exp: Math.floor(Date.now() / 1000) + 86400 * 7 },
      secret
    );

    return json({ token });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
