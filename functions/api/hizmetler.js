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

export async function onRequest({ env }) {
  try {
    const raw = env.INANC_KV ? await env.INANC_KV.get("hizmetler") : null;
    return new Response(JSON.stringify(raw ? JSON.parse(raw) : DEFAULT), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" },
    });
  } catch {
    return new Response(JSON.stringify(DEFAULT), { headers: { "Content-Type": "application/json" } });
  }
}
