// FIYATLAR BÖLÜMÜ - Paket fiyatlandırması
import React from "react";
import MotionReveal from "./MotionReveal";
import { RevealHeading } from "./TextReveal";

// WHATSAPP NUMARANI BURAYA YAZ
// ÖRNEK FORMAT: 905555555555 (başında + işareti yok)
const WHATSAPP_NUMBER = "905334409803";

const ortakOzellikler = [
  "Kişiye özel vücut analizi",
  "Hedef belirleme ve planlama",
  "Beslenme ve Antrenman takibi",
];

const paketler = [
  {
    title: "Uzaktan Eğitim",
    tagline: "Spora yeni başlayanlara uygun çözüm.",
    ozel: [
      "Özel antrenman ve beslenme programı",
      "Haftalık online değerlendirme ve takip",
    ],
    fiyat: "3000",
    etiket: "YENİ BAŞLAYANLARA",
    renk: "hover:border-blue-500/60 hover:ring-blue-500/30",
    etiketRenk: "bg-blue-600",
    // Hover'da mavi tema
    buttonHover: "hover:bg-blue-600 hover:text-white hover:border-blue-500",
  },
  {
    title: "Online Koçluk",
    tagline: "Canlı birebir seans ve geri bildirim.",
    ozel: [
      "Online birebir antrenman seansları",
      "Seans sonrası değerlendirme ve düzenleme",
    ],
    fiyat: "5000",
    etiket: "EN ÇOK TERCİH EDİLEN",
    renk: "hover:border-purple-500/60 hover:ring-purple-500/30",
    etiketRenk: "bg-purple-600",
    // Hover'da mor tema
    buttonHover: "hover:bg-purple-600 hover:text-white hover:border-purple-500",
  },
  {
    title: "Birebir Koçluk",
    tagline: "Balıkesir’de anlaşmalı salonlarda birebir çalışma",
    ozel: [
      "Balıkesir’de salonda birebir antrenman",
      "Anlık takip, analiz ve düzenli ölçüm",
    ],
    fiyat: "7000",
    etiket: "EN İYİ SONUÇ",
    renk: "hover:border-amber-500/60 hover:ring-amber-500/30",
    etiketRenk: "bg-amber-600",
    // Hover'da amber tema
    buttonHover:
      "hover:bg-amber-500 hover:text-neutral-950 hover:border-amber-400",
  },
];

// 0'dan hedef fiyata doğru sayım (requestAnimationFrame + ease-out)
function useCountUp(target, duration = 900) {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const finalValue = Number(target) || 0;
    let frameId;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(finalValue * eased);

      setValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [target, duration]);

  return value;
}

function AnimatedPrice({ amount }) {
  const value = useCountUp(amount, 900);

  return (
    <span className="text-[34px] sm:text-[34px] font-semibold tracking-tight text-white tabular-nums">
      ₺{value.toLocaleString("tr-TR")}
    </span>
  );
}

function handleWhatsappClick(title) {
  const message = `Sitenizden "${title}" paketiniz için iletişime geçiyorum. Bilgi alabilir miyim lütfen?`;
  const encoded = encodeURIComponent(message.trim());
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function Fiyatlar() {
  return (
    <section
      id="fiyatlar"
      className="relative z-10 bg-neutral-950 pt-20  px-4 sm:px-8 lg:px-20"
    >
      <MotionReveal>
        <div className="max-w-6xl mx-auto text-center mb-14">
          <RevealHeading
            as="h2"
            mode="word"
            className="text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-[-0.02em]"
          >
            Fiyatlandırma ve Paketler
          </RevealHeading>
          <p className="mt-4 text-base md:text-lg font-medium text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Hedefine ve zamanına en uygun paketi seç; hemen
            başlayalım.
          </p>
        </div>
      </MotionReveal>

      {/* Paket kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto items-stretch auto-rows-[1fr]">
        {paketler.map((paket, index, arr) => {
          const isTabletSingleInRow =
            arr.length % 2 !== 0 && index === arr.length - 1;

          return (
            <MotionReveal key={paket.title} delay={index * 80}>
              <div
                className={`relative bg-neutral-900/95 border border-neutral-800 ring-1 ring-transparent rounded-sm p-6 shadow-lg transition-all duration-300 ease-out hover:-translate-y-[3px] hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)] flex flex-col h-full ${paket.renk}`}
                style={{
                  marginLeft: isTabletSingleInRow ? "auto" : undefined,
                  marginRight: isTabletSingleInRow ? "auto" : undefined,
                }}
              >
                {/* Üst sağ küçük etiket */}
                {paket.etiket && (
                  <div
                    className={`${paket.etiketRenk} absolute -top-3 right-3 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow-md tracking-[0.12em] uppercase`}
                  >
                    {paket.etiket}
                  </div>
                )}

                {/* Üst blok: başlık badge + fiyat + tagline */}
                <div>
                  <div className="inline-flex items-center rounded-full border border-neutral-700/80 bg-neutral-900/90 px-3 py-1 text-[13px] sm:text-xs font-medium uppercase tracking-[0.16em] text-neutral-100">
                    {paket.title}
                  </div>

                  <div className="mt-4 flex items-baseline gap-2">
                    <AnimatedPrice amount={paket.fiyat} />
                    <span className="text-xs sm:text-md text-neutral-400 font-medium tracking-wide">
                      / Aylık
                    </span>
                  </div>

                  {paket.tagline && (
                    <p className="mt-3 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      {paket.tagline}
                    </p>
                  )}

                  <div className="mt-4 h-px bg-neutral-800" />
                </div>

                {/* Özellik listesi (pakete özel + ortak) */}
                <ul className="mt-5 space-y-2.5 text-sm text-neutral-300/90 leading-relaxed">
                  {paket.ozel.map((satir, idx) => (
                    <li
                      key={`ozel-${idx}`}
                      className="flex items-start gap-2 text-left"
                    >
                      <span className="mt-[3px] inline-flex h-4 w-4 items-center justify-center rounded-full border border-neutral-600">
                        <span className="h-2 w-2 rounded-full bg-neutral-400" />
                      </span>
                      <span>{satir}</span>
                    </li>
                  ))}
                  {ortakOzellikler.map((ozellik, idx) => (
                    <li
                      key={`ortak-${idx}`}
                      className="flex items-start gap-2 text-left"
                    >
                      <span className="mt-[3px] inline-flex h-4 w-4 items-center justify-center rounded-full border border-neutral-700">
                        <span className="h-2 w-2 rounded-full bg-neutral-500" />
                      </span>
                      <span>{ozellik}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA – tam genişlik, nötr base, hover'da kart rengine göre accent */}
                <button
                  type="button"
                  onClick={() => handleWhatsappClick(paket.title)}
                  className={`mt-6 w-full py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold tracking-tight border border-neutral-700 bg-neutral-900/90 text-neutral-200 transition-colors duration-200 ${paket.buttonHover}`}
                >
                  Paketi Seç
                </button>
              </div>
            </MotionReveal>
          );
        })}
      </div>
    </section>
  );
}
