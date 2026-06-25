import { verifyJWT } from "../../_jwt.js";

const DEFAULT = {
  intro: "Merhaba, ben Arda İnanç Kurt. Balıkesir Merkez'de kişiye özel programlarla öğrencilerimin hayatlarına dokunduğum bir yaşantı sürmekteyim.",
  paragraflar: [
    "Yaklaşık 10 senedir birebir ve online koçluk ile antrenmanla birlikte beslenme planlaması oluşturarak danışanlarımın yağ kaybı, kas gelişimi ve postür - duruş iyileştirmesi gibi hedeflerine ulaşmalarına yardımcı oluyorum.",
    "Her danışan için, onların günlük hayat temposuna uyumlu ve sürdürülebilir bir sistem kurmaya odaklanıyorum. Dersler benim müsait olduğum zamanlara değil öğrencinin müsait olduğu zamanlara planlanmakta.",
    "Benim için antrenörlük; sadece antrenman yazmak değil, öğrencime disiplin, kararlılık ve özgüven kazandırma süreci. Hedefinize, yaşantınıza ve fiziksel seviyenize göre, net bir plan ve ölçülebilir adımlarla ilerliyoruz.",
  ],
};

async function authenticate({ env, request }) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.replace("Bearer ", "").trim();
  if (!token) return null;
  return verifyJWT(token, env.JWT_SECRET || "change-this-secret");
}

export async function onRequest({ env, request }) {
  const payload = await authenticate({ env, request });
  if (!payload) return json({ error: "Yetkisiz erişim" }, 401);

  if (request.method === "GET") {
    const raw = env.INANC_KV ? await env.INANC_KV.get("hakkimda") : null;
    return json(raw ? JSON.parse(raw) : DEFAULT);
  }

  if (request.method === "PUT") {
    const body = await request.json();
    if (typeof body.intro !== "string" || !Array.isArray(body.paragraflar))
      return json({ error: "Geçersiz veri" }, 400);
    if (env.INANC_KV) await env.INANC_KV.put("hakkimda", JSON.stringify(body));
    return json({ ok: true });
  }

  return json({ error: "Desteklenmeyen metod" }, 405);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
