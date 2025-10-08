// Hizmetler.jsx — Mobil: küçük aralıklı kartlar (accordion yok) • Desktop: grid
import React from "react";
import MotionReveal from "./MotionReveal";

const hizmetler = [
  { icon: "💪", title: "Birebir Fitness Koçluğu", description: "Hedefine uygun, tamamen sana özel antrenmanlarla gelişimini adım adım takip ediyoruz." },
  { icon: "💻", title: "Canlı Online Antrenman Seansları", description: "İnternetin olduğu her yerde, canlı bağlantıyla birlikte çalışıp motivasyonunu yüksek tutuyoruz." },
  { icon: "🗂️", title: "Uzaktan Hazırlanan Kişiye Özel Programlar", description: "Zamanına ve imkanlarına göre hazırlanmış planla, nereye gidersen git düzenini koruyabilirsin." },
  { icon: "🥗", title: "Kişiselleştirilmiş Beslenme Danışmanlığı", description: "Yaşam tarzına uygun, sürdürülebilir beslenme planı ile daha sağlıklı sonuçlar elde edebilirsin." },
  { icon: "⚖️", title: "Kilo Kontrolü Uzmanlığı", description: "Kilo verme ya da alma hedefinde, seni doğru adımlarla ilerleten bir yol haritası oluşturuyoruz." },
  { icon: "🚫", title: "Gıda Hassasiyetleri ve Alerjiye Uygun Planlama", description: "İhtiyaçlarına ve hassasiyetlerine göre güvenli bir beslenme planıyla yoluna devam edebilirsin." },
  { icon: "📊", title: "Antrenman Planlamasında Uzmanlık", description: "Performansına uygun, düzenli ve verimli antrenman planıyla gereksiz yorulmadan ilerleyebilirsin." },
  { icon: "🏠", title: "Ekipmansız Ev Egzersizi Rehberliği", description: "Sadece kendi beden ağırlığınla evinde bile etkili sonuçlar alabileceğin programlar sunuyorum." },
];

export default function Hizmetler() {
  return (
    <section id="hizmetler" className="bg-neutral-950 pt-10 pb-20 px-4 sm:px-8 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Başlık */}
        <header className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Hizmetler</h2>
          <p className="mt-4 text-lg text-neutral-300 max-w-2xl mx-auto">
            Hedefe giden yolda ihtiyacın olan tüm destek burada.
          </p>
        </header>

        {/* Mobil: Kartlar — küçük, aralıklı, açılır değil */}
        <div className="sm:hidden">
          <ul className="space-y-3">
            {hizmetler.map((item, i) => (
              <li key={i}>
                <MotionReveal delay={i * 80}>
                  <div
                    className="rounded-lg bg-neutral-900 border border-neutral-800 p-4
                               shadow-md ring-1 ring-transparent
                               hover:border-orange-600/40 hover:ring-orange-600/20 transition"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl leading-none mt-0.5" aria-hidden>
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-3x1 font-semibold text-neutral-100">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-[12px] leading-relaxed text-neutral-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </MotionReveal>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-8">
          {hizmetler.map((item, i) => (
            <MotionReveal key={i} delay={i * 80}>
              <div
                className="bg-neutral-900 p-6 pt-10 pb-8
                           rounded-xl border border-neutral-800
                           shadow-lg ring-1 ring-transparent
                           hover:border-orange-600/60 hover:ring-orange-600/30
                           transition-all duration-300
                           flex flex-col items-center justify-between h-full"
              >
                <div className="text-4xl mb-6" aria-hidden>{item.icon}</div>
                <h3 className="text-lg font-semibold text-neutral-100 text-center mb-3">
                  {item.title}
                </h3>
                <p className="text-neutral-300 text-sm text-center mt-1">
                  {item.description}
                </p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
