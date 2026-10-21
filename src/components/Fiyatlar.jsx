import { useEffect, useState } from "react";
import MotionReveal from "./MotionReveal";
import { RevealHeading } from "./TextReveal";
import { openWhatsApp } from "../utils/whatsapp";

const WHATSAPP_NUMBER = "905334409803";

const RENK_MAP = {
  blue:    { aksan: "border-t-blue-500",   bg: "from-blue-500/5",    etiket: "text-blue-300 border-blue-500/40 bg-blue-500/8",   icon: "text-blue-400",   btn: "bg-blue-600 hover:bg-blue-500",   hover: "hover:border-blue-500/50 hover:shadow-[0_24px_60px_rgba(59,130,246,0.12)]" },
  purple:  { aksan: "border-t-purple-500", bg: "from-purple-500/5",  etiket: "text-purple-300 border-purple-500/40 bg-purple-500/8", icon: "text-purple-400", btn: "bg-purple-600 hover:bg-purple-500", hover: "hover:border-purple-500/50 hover:shadow-[0_24px_60px_rgba(168,85,247,0.12)]" },
  amber:   { aksan: "border-t-amber-500",  bg: "from-amber-500/5",   etiket: "text-amber-300 border-amber-500/40 bg-amber-500/8",  icon: "text-amber-400",  btn: "bg-amber-500 hover:bg-amber-400 text-neutral-950",  hover: "hover:border-amber-500/50 hover:shadow-[0_24px_60px_rgba(245,158,11,0.12)]" },
  emerald: { aksan: "border-t-emerald-500",bg: "from-emerald-500/5", etiket: "text-emerald-300 border-emerald-500/40 bg-emerald-500/8", icon: "text-emerald-400", btn: "bg-emerald-600 hover:bg-emerald-500", hover: "hover:border-emerald-500/50 hover:shadow-[0_24px_60px_rgba(16,185,129,0.12)]" },
  rose:    { aksan: "border-t-rose-500",   bg: "from-rose-500/5",    etiket: "text-rose-300 border-rose-500/40 bg-rose-500/8",   icon: "text-rose-400",   btn: "bg-rose-600 hover:bg-rose-500",   hover: "hover:border-rose-500/50 hover:shadow-[0_24px_60px_rgba(244,63,94,0.12)]" },
  cyan:    { aksan: "border-t-cyan-500",   bg: "from-cyan-500/5",    etiket: "text-cyan-300 border-cyan-500/40 bg-cyan-500/8",   icon: "text-cyan-400",   btn: "bg-cyan-600 hover:bg-cyan-500",   hover: "hover:border-cyan-500/50 hover:shadow-[0_24px_60px_rgba(6,182,212,0.12)]" },
  orange:  { aksan: "border-t-orange-500", bg: "from-orange-500/5",  etiket: "text-orange-300 border-orange-500/40 bg-orange-500/8", icon: "text-orange-400", btn: "bg-orange-500 hover:bg-orange-400", hover: "hover:border-orange-500/50 hover:shadow-[0_24px_60px_rgba(249,115,22,0.12)]" },
};

function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.4" />
      <path d="M5 8.25l2 2L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const VARSAYILAN = [
  {
    id: "uzaktan", title: "Uzaktan Eğitim", tagline: "Spora yeni başlayanlara uygun çözüm",
    fiyat: "3.000", sure: "ay", etiket: "YENİ BAŞLAYANLARA", renk: "blue",
    ozellikler: ["Özel antrenman ve beslenme programı","Haftalık online değerlendirme ve takip","Kişiye özel vücut analizi","Hedef belirleme ve planlama","Beslenme ve Antrenman takibi"],
  },
  {
    id: "online", title: "Online Koçluk", tagline: "Canlı birebir seans ve geri bildirim",
    fiyat: "7.000", sure: "ay", etiket: "EN ÇOK TERCİH EDİLEN", renk: "purple",
    ozellikler: ["Online birebir antrenman seansları","Seans sonrası değerlendirme ve düzenleme","Kişiye özel vücut analizi","Hedef belirleme ve planlama","Beslenme ve Antrenman takibi"],
  },
  {
    id: "birebir", title: "Birebir Koçluk", tagline: "Balıkesir'de anlaşmalı salonlarda birebir çalışma",
    fiyat: "10.000", sure: "ay", etiket: "EN İYİ SONUÇ", renk: "amber",
    ozellikler: ["Balıkesir'de salonda birebir antrenman","Anlık takip, analiz ve düzenli ölçüm","Kişiye özel vücut analizi","Hedef belirleme ve planlama","Beslenme ve Antrenman takibi"],
  },
];

function handleWhatsappClick(title) {
  const msg = `Sitenizden "${title}" paketiniz için iletişime geçiyorum. Bilgi alabilir miyim lütfen?`;
  openWhatsApp(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg.trim())}`);
}

export default function Fiyatlar() {
  const [paketler, setPaketler] = useState(VARSAYILAN);

  useEffect(() => {
    fetch("/api/prices")
      .then((r) => r.json())
      .then((d) => {
        const raw = (d.paketler || []).filter(Boolean);
        if (!raw.length) return;
        const merged = raw
          .map((kv) => {
            if (!kv || !kv.id) return null;
            const def = VARSAYILAN.find((x) => x.id === kv.id) || {};
            const ozellikler = Array.isArray(kv.ozellikler)
              ? kv.ozellikler.filter((s) => s && String(s).trim())
              : (def.ozellikler || []);
            return { ...def, ...kv, ozellikler };
          })
          .filter(Boolean);
        if (merged.length) setPaketler(merged);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="fiyatlar" className="relative z-10 bg-neutral-950 pt-[8.09rem] px-4 sm:px-6 lg:px-0">
      <MotionReveal>
        <div className="max-w-6xl mx-auto text-center mb-16">
          <RevealHeading as="h2" mode="word"
            className="text-3xl sm:text-4xl font-extrabold text-white leading-[1.05] tracking-[-0.03em]">
            Fiyatlandırma ve Paketler
          </RevealHeading>
          <p className="mt-4 text-base md:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Hedefine ve zamanına en uygun paketi seç; hemen başlayalım.
          </p>
        </div>
      </MotionReveal>

      <div className="grid grid-cols-1 gap-4 lg:gap-5 max-w-6xl mx-auto">
        {paketler.map((paket, index) => {
          const tema = RENK_MAP[paket.renk] || RENK_MAP.blue;
          const ozellikler = (paket.ozellikler || []).filter((s) => s && String(s).trim());
          const baslik = (paket.title || "").trim() || "Paket";
          const fiyatStr = String(paket.fiyat ?? "").replace(/[\s.,]/g, "").replace(/^0+$/, "");
          const fiyatGoster = fiyatStr.length > 0;

          return (
            <MotionReveal key={paket.id} delay={index * 80}>
              <div className={`relative overflow-hidden border-t-2 ${tema.aksan} border border-neutral-800/80 rounded-sm bg-gradient-to-b ${tema.bg} to-neutral-900/95 shadow-lg transition-all duration-300 ease-out hover:-translate-y-[2px] ${tema.hover} flex flex-col md:flex-row md:items-stretch`}>

                {/* Subtle inner glow top */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/5" />

                {paket.etiket && (
                  <span className={`absolute top-4 right-4 text-[10px] font-bold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full border ${tema.etiket}`}>
                    {paket.etiket}
                  </span>
                )}

                {/* Sol: başlık + açıklama */}
                <div className="p-6 lg:p-7 min-w-0 md:w-[13rem] lg:w-[15rem] md:flex-shrink-0 flex flex-col justify-center">
                  <h3 className="text-base lg:text-[17px] font-bold uppercase tracking-[0.1em] text-white leading-snug pr-24 md:pr-0">
                    {baslik}
                  </h3>
                  {paket.tagline && (
                    <p className="mt-2 text-[13px] text-neutral-500 leading-relaxed">{paket.tagline}</p>
                  )}
                </div>

                {/* Ayırıcı */}
                {ozellikler.length > 0 && (
                  <div className="mx-6 md:mx-0 h-px md:h-auto md:w-px bg-neutral-800/80 md:self-stretch md:flex-shrink-0" />
                )}

                {/* Orta: özellikler */}
                {ozellikler.length > 0 && (
                  <ul className="px-6 pb-6 pt-0 md:py-6 lg:px-8 min-w-0 flex-1 flex flex-col justify-center gap-y-2">
                    {ozellikler.map((satir, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-left">
                        <CheckIcon className={`h-4 w-4 flex-shrink-0 ${tema.icon}`} />
                        <span className="text-[13px] text-neutral-300 leading-snug">{satir}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Ayırıcı */}
                {fiyatGoster && (
                  <div className="mx-6 md:mx-0 h-px md:h-auto md:w-px bg-neutral-800/80 md:self-stretch md:flex-shrink-0" />
                )}

                {/* Sağ: fiyat + buton */}
                <div className="p-6 lg:p-7 md:w-[10rem] lg:w-[13rem] md:flex-shrink-0 flex flex-col justify-center items-start md:items-center gap-4">
                  {fiyatGoster && (
                    <div className="text-left md:text-center">
                      <div className="flex items-baseline gap-1 md:justify-center">
                        <span className="text-[13px] text-neutral-500 font-medium">₺</span>
                        <span className="text-3xl lg:text-4xl font-black text-white tracking-tight tabular-nums">{paket.fiyat}</span>
                      </div>
                      {paket.sure && <p className="text-[12px] text-neutral-600 mt-0.5">/ {paket.sure} · KDV dahil</p>}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleWhatsappClick(baslik)}
                    className={`w-full py-2.5 rounded-sm text-[13px] font-bold tracking-wide text-white transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] ${tema.btn}`}
                  >
                    Paketi Seç
                  </button>
                </div>
              </div>
            </MotionReveal>
          );
        })}
      </div>
    </section>
  );
}
