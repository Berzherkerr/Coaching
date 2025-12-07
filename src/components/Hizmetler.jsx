// src/components/Hizmetler.jsx
import React from "react";
import MotionReveal from "./MotionReveal";
import { RevealHeading } from "./TextReveal";

const hizmetler = [
  {
    icon: "🏋️‍♂️",
    title: "Birebir Koçluk",
    description:
      "Balıkesir'de salonda bire bir çalışarak, sana özel programla formunu ve gücünü adım adım birlikte geliştiriyoruz.",
  },
  {
    icon: "💻",
    title: "Online Koçluk",
    description:
      "Nerede olursan ol; online program, video analiz ve düzenli takip ile seni hedeflerine güvenle ilerletiyorum.",
  },
  {
    icon: "🥗",
    title: "Beslenme Danışmanlığı",
    description:
      "Günlük hayatına uyan, yasaklara değil dengeye dayalı bir beslenme planı ile sürecini destekliyorum.",
  },
  {
    icon: "⚖️",
    title: "Kilo Yönetimi",
    description:
      "Kilo verme ya da alma hedefini; tartı stresini büyütmeden, kontrollü ve sürdürülebilir şekilde yönetiyoruz.",
  },
  {
    icon: "🏠",
    title: "Ev Antrenmanı",
    description:
      "Salona gelemiyorsan, evde basit ekipmanlarla uygulayabileceğin net ve takip edilebilir bir plan kuruyoruz.",
  },
  {
    icon: "🧍‍♂️",
    title: "Form & Postür",
    description:
      "Duruşunu ve hareket kaliteni analiz ederek daha dik, dengeli ve ağrısız bir vücut mekaniği hedefliyoruz.",
  },
  {
    icon: "🤸‍♂️",
    title: "Mobilite & Esneklik",
    description:
      "Uzun süre oturmaya bağlı duruş bozuklukları ve hareket kısıtlılıkları için, özel programlar hazırlıyorum.",
  },
  {
    icon: "💪",
    title: "Kas Gelişimi",
    description:
      "Bilinçli yüklenme prensipleriyle kas kütleni artıran, güç odaklı ve ölçülebilir programlar tasarlıyorum.",
  },
  {
    icon: "📈",
    title: "Boy Gelişimi",
    description:
      "Büyüme döneminde omurga sağlığını koruyan, güvenli ve destekleyici egzersizlerle potansiyelini destekliyorum.",
  },
];

export default function Hizmetler() {
  return (
    <section
      id="hizmetler"
      className="relative z-10 bg-neutral-950 pt-20 pb-15 px-4 sm:px-8 lg:px-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-14">
          <RevealHeading
            as="h2"
            mode="word"
            className="text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-[-0.02em]"
          >
            Hizmetler
          </RevealHeading>
          <p className="mt-4 text-base md:text-lg font-medium text-neutral-300 max-w-4xl mx-auto leading-relaxed">
            Sürdürülebilir bir sistem ile hem Balıkesir’de hem de online olarak
            seninle birlikte gelişiyoruz.
          </p>
        </div>

        {/* Mobil görünüm */}
        <div className="sm:hidden">
          <ul className="space-y-3">
            {hizmetler.map((item, index) => (
              <li key={index}>
                <MotionReveal>
                  <div
                    className="group rounded-sm bg-neutral-900/90 border border-neutral-800 p-3 shadow-lg ring-1 ring-transparent hover:-translate-y-[3px] hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out"
                    style={{ transformOrigin: "center" }}
                  >
                    <div className="grid grid-cols-[50px_1fr] gap-3 items-center">
                      <div className="col-start-1 row-span-2 flex items-center justify-center">
                        <div className="text-3xl leading-none group-hover-emoji-pulse-soft">
                          {item.icon}
                        </div>
                      </div>

                      <h3 className="col-start-2 text-md font-semibold text-white leading-snug">
                        {item.title}
                      </h3>

                      <p className="col-start-2 text-sm leading-relaxed text-neutral-300/90 font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </MotionReveal>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop / Tablet görünüm – 3x3 grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[1fr] items-stretch">
          {hizmetler.map((item, index) => (
            <MotionReveal key={index} delay={index * 60}>
              <div
                className="group bg-neutral-900/90 p-4 pt-6 pb-5 rounded-sm border border-neutral-800 shadow-lg ring-1 ring-transparent hover:-translate-y-[4px] hover:shadow-[0_22px_55px_rgba(0,0,0,0.50)] hover:border-neutral-700 transition-all duration-300 ease-out h-full flex flex-col items-center text-center gap-3"
                style={{ transformOrigin: "center" }}
              >
                <div className="text-4xl mb-1 group-hover-emoji-pulse-soft">
                  {item.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-neutral-300/90 text-sm leading-relaxed font-normal max-w-[280px]">
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
