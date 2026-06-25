import { verifyJWT } from "../../_jwt.js";

const DEFAULT = {
  hizmetler: [
    { icon: "🏋️‍♂️", title: "Birebir Koçluk", description: "Balıkesir'de spor salonunda birebir çalışarak, sana özel programla formunu ve gücünü adım adım birlikte geliştiriyoruz." },
    { icon: "💻", title: "Online Koçluk", description: "Nerede olursan ol; online program, video analiz ve düzenli takip ile seni hedeflerine güvenle ilerletiyorum." },
    { icon: "🥗", title: "Beslenme Danışmanlığı", description: "Günlük hayatına uyan, yasaklara değil dengeye dayalı bir beslenme planı ile sürecini destekliyorum." },
    { icon: "⚖️", title: "Kilo Yönetimi", description: "Kilo verme ya da alma hedefini; tartı stresini büyütmeden, kontrollü ve sürdürülebilir şekilde yönetiyoruz." },
    { icon: "🏠", title: "Ev Antrenmanı", description: "Salona gelemiyorsan, evde basit ekipmanlarla uygulayabileceğin net ve takip edilebilir bir plan kuruyoruz." },
    { icon: "🧍‍♂️", title: "Form & Postür", description: "Duruşunu ve hareket kaliteni analiz ederek daha dik, dengeli ve ağrısız bir vücut mekaniği hedefliyoruz." },
    { icon: "🤸‍♂️", title: "Mobilite & Esneklik", description: "Uzun süre oturmaya bağlı duruş bozuklukları ve hareket kısıtlılıkları için, özel programlar hazırlıyorum." },
    { icon: "💪", title: "Kas Gelişimi", description: "Bilinçli yüklenme prensipleriyle kas kütleni artıran, güç odaklı ve ölçülebilir programlar tasarlıyorum." },
    { icon: "📈", title: "Boy Gelişimi", description: "Büyüme döneminde omurga sağlığını koruyan, güvenli ve destekleyici egzersizlerle potansiyelini destekliyorum." },
    { icon: "🏃‍♂️", title: "Kondisyon & Dayanıklılık", description: "Nefes yönetimi, kalp atış hızı kontrolü ve kademeli yüklenme prensipleriyle genel kondisyon seviyeni yukarı taşıyoruz." },
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
    const raw = env.INANC_KV ? await env.INANC_KV.get("hizmetler") : null;
    return json(raw ? JSON.parse(raw) : DEFAULT);
  }

  if (request.method === "PUT") {
    const body = await request.json();
    if (!Array.isArray(body.hizmetler)) return json({ error: "Geçersiz veri" }, 400);
    if (env.INANC_KV) await env.INANC_KV.put("hizmetler", JSON.stringify(body));
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
