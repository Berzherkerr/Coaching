// src/components/Hizmetler.jsx
// Güncelleme (yalnızca istenenler):
// - MOBİL: İkon %10 KÜÇÜK (32px → ~29px) ve ikon sütunu dar (56px → 50px) → metin alanı genişledi.
// - MOBİL: Title boyutu %10 BÜYÜK (14px → ~15px), BOLD.
// - DESKTOP: Önceki hâliyle aynı (eşit yükseklik + %15 artırılmış dikey aralık).

import React from "react";
import MotionReveal from "./MotionReveal";

const hizmetler = [
  { icon: "💪", title: "Birebir Fitness Koçluğu", description: "Hedefine uygun, tamamen sana özel antrenmanlarla gelişimini adım adım takip ediyoruz." },
  { icon: "💻", title: "Canlı Online Antrenman Seansları", description: "İnternetin olduğu her yerde, canlı bağlantıyla birlikte çalışıp motivasyonunu yüksek tutuyoruz." },
  { icon: "🗂️", title: "Kişiye Özel Programlar", description: "Zamanına ve imkanlarına göre hazırlanmış planla, nereye gidersen git düzenini koruyabilirsin." },
  { icon: "🥗", title: "Kişiselleştirilmiş Beslenme Danışmanlığı", description: "Yaşam tarzına uygun, sürdürülebilir beslenme planı ile daha sağlıklı sonuçlar elde edebilirsin." },
  { icon: "⚖️", title: "Kilo Kontrolü Uzmanlığı", description: "Kilo verme ya da alma hedefinde, seni doğru adımlarla ilerleten bir yol haritası oluşturuyoruz." },
  { icon: "🚫", title: "Gıda Hassasiyetlerine Uygun Planlama", description: "İhtiyaçlarına ve hassasiyetlerine göre güvenli bir beslenme planıyla yoluna devam edebilirsin." },
  { icon: "📊", title: "Antrenman Planlamasında Uzmanlık", description: "Performansına uygun, düzenli ve verimli antrenman planıyla gereksiz yorulmadan ilerleyebilirsin." },
  { icon: "🏠", title: "Ekipmansız Ev Egzersizi Rehberliği", description: "Sadece kendi beden ağırlığınla evinde bile etkili sonuçlar alabileceğin programlar sunuyorum." },
];

export default function Hizmetler() {
  return (
    <section id="hizmetler" className="bg-neutral-950 pt-10 pb-35 px-4 sm:px-8 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Başlık */}
        <header className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Hizmetler</h2>
          <p className="mt-4 text-lg text-neutral-300 max-w-2xl mx-auto">
            Hedefine uygun çözümü seç ve hemen başlayalım.
          </p>
        </header>

        {/* MOBİL */}
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
                    {/* İkon sütunu  */}
                    <div className="grid grid-cols-[50px_1fr] gap-3 items-center">
                      <div className="col-start-1 row-span-2 flex items-center justify-center">
                        <span className="text-[29px] leading-none" aria-hidden>
                          {item.icon}
                        </span>
                      </div>

                      {/* Title  */}
                      <h3 className="col-start-2 text-[15px] font-bold text-neutral-100 leading-tight">
                        {item.title}
                      </h3>

                      {/* Açıklama */}
                      <p className="col-start-2 text-sm leading-snug text-neutral-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </MotionReveal>
              </li>
            ))}
          </ul>
        </div>

        {/* DESKTOP */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-8 auto-rows-[1fr] items-stretch">
          {hizmetler.map((item, i) => (
            <MotionReveal key={i} delay={i * 80}>
              <div
                className="bg-neutral-900 p-5 pt-8 pb-6
                           rounded-xl border border-neutral-800
                           shadow-lg ring-1 ring-transparent
                           hover:border-orange-600/60 hover:ring-orange-600/30
                           transition-all duration-300
                           h-full flex flex-col items-center text-center gap-3.5"
              >
                <div className="text-3xl" aria-hidden>{item.icon}</div>
                <h3 className="text-lg font-semibold text-neutral-100 leading-tight">
                  {item.title}
                </h3>
                <p className="text-neutral-300 text-sm leading-snug">
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
