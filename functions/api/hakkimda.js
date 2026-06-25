const DEFAULT = {
  intro: "Merhaba, ben Arda İnanç Kurt. Balıkesir Merkez'de kişiye özel programlarla öğrencilerimin hayatlarına dokunduğum bir yaşantı sürmekteyim.",
  paragraflar: [
    "Yaklaşık 10 senedir birebir ve online koçluk ile antrenmanla birlikte beslenme planlaması oluşturarak danışanlarımın yağ kaybı, kas gelişimi ve postür - duruş iyileştirmesi gibi hedeflerine ulaşmalarına yardımcı oluyorum.",
    "Her danışan için, onların günlük hayat temposuna uyumlu ve sürdürülebilir bir sistem kurmaya odaklanıyorum. Dersler benim müsait olduğum zamanlara değil öğrencinin müsait olduğu zamanlara planlanmakta.",
    "Benim için antrenörlük; sadece antrenman yazmak değil, öğrencime disiplin, kararlılık ve özgüven kazandırma süreci. Hedefinize, yaşantınıza ve fiziksel seviyenize göre, net bir plan ve ölçülebilir adımlarla ilerliyoruz.",
  ],
};

export async function onRequest({ env }) {
  try {
    const raw = env.INANC_KV ? await env.INANC_KV.get("hakkimda") : null;
    return new Response(JSON.stringify(raw ? JSON.parse(raw) : DEFAULT), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" },
    });
  } catch {
    return new Response(JSON.stringify(DEFAULT), { headers: { "Content-Type": "application/json" } });
  }
}
