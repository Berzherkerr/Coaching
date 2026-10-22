import { useEffect, useState } from "react";
import MotionReveal from "./MotionReveal";
import { RevealHeading } from "./TextReveal";
import { openWhatsApp } from "../utils/whatsapp";

const WHATSAPP_NUMBER = "905334409803";

const RENK_MAP = {
  blue:    { kart: "hover:border-blue-500/60 hover:ring-blue-500/30",    etiket: "bg-blue-600",    btn: "hover:bg-blue-600 hover:text-white hover:border-blue-500" },
  purple:  { kart: "hover:border-purple-500/60 hover:ring-purple-500/30", etiket: "bg-purple-600",  btn: "hover:bg-purple-600 hover:text-white hover:border-purple-500" },
  amber:   { kart: "hover:border-amber-500/60 hover:ring-amber-500/30",   etiket: "bg-amber-600",   btn: "hover:bg-amber-500 hover:text-neutral-950 hover:border-amber-400" },
  emerald: { kart: "hover:border-emerald-500/60 hover:ring-emerald-500/30", etiket: "bg-emerald-600", btn: "hover:bg-emerald-600 hover:text-white hover:border-emerald-500" },
  rose:    { kart: "hover:border-rose-500/60 hover:ring-rose-500/30",    etiket: "bg-rose-600",    btn: "hover:bg-rose-600 hover:text-white hover:border-rose-500" },
  cyan:    { kart: "hover:border-cyan-500/60 hover:ring-cyan-500/30",    etiket: "bg-cyan-600",    btn: "hover:bg-cyan-600 hover:text-white hover:border-cyan-500" },
  orange:  { kart: "hover:border-orange-500/60 hover:ring-orange-500/30", etiket: "bg-orange-600",  btn: "hover:bg-orange-600 hover:text-white hover:border-orange-500" },
};

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
        <div className="max-w-6xl mx-auto text-center mb-14">
          <RevealHeading as="h2" mode="word"
            className="text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-[-0.02em]">
            Fiyatlandırma ve Paketler
          </RevealHeading>
          <p className="mt-4 text-base md:text-lg font-medium text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Hedefine ve zamanına en uygun paketi seç; hemen başlayalım.
          </p>
        </div>
      </MotionReveal>

      <div className="grid grid-cols-1 auto-rows-fr gap-6 lg:gap-7 max-w-6xl mx-auto">
        {paketler.map((paket, index) => {
          const tema = RENK_MAP[paket.renk] || RENK_MAP.blue;
          const ozellikler = (paket.ozellikler || []).filter((s) => s && String(s).trim());
          const baslik = (paket.title || "").trim() || "Paket";
          const fiyatGoster = paket.fiyat && String(paket.fiyat).replace(/\s/g, "") !== "0" && String(paket.fiyat).trim() !== "";

          return (
            <MotionReveal key={paket.id} delay={index * 80} className="h-full">
              <div
                className={`relative h-full bg-neutral-900/95 border border-neutral-800 ring-1 ring-transparent rounded-sm p-6 lg:p-7 shadow-lg transition-all duration-300 ease-out hover:-translate-y-[3px] hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)] flex flex-col md:flex-row md:items-stretch gap-5 md:gap-5 lg:gap-8 ${tema.kart}`}
              >
                {paket.etiket && (
                  <div className={`${tema.etiket} absolute -top-3 right-3 max-w-[calc(100%-1.5rem)] truncate text-white text-[10px] font-semibold px-2 py-1 rounded-full shadow-md tracking-[0.12em] uppercase`}>
                    {paket.etiket}
                  </div>
                )}

                {/* Sol: başlık + açıklama */}
                <div className="order-1 min-w-0 md:w-[11rem] lg:w-[14.5rem] md:flex-shrink-0">
                  <h3 className="text-[19.5px] lg:text-[21px] font-semibold uppercase tracking-[0.12em] text-neutral-100 break-words hyphens-auto">
                    {baslik}
                  </h3>
                  {paket.tagline && (
                    <p className="mt-3 text-sm text-neutral-400 leading-relaxed break-words">{paket.tagline}</p>
                  )}
                </div>

                {/* Ayırıcı: mobilde yatay, geniş ekranda dikey */}
                {ozellikler.length > 0 && (
                  <div className="order-3 md:order-2 h-px w-full bg-neutral-800 md:h-auto md:w-px md:self-stretch md:flex-shrink-0" />
                )}

                {/* Orta: özellikler — kısa maddeler tek satırda kalır, uzun olanlar taşmadan alta sarar */}
                {ozellikler.length > 0 && (
                  <ul className="order-4 md:order-3 min-w-0 flex-1 flex flex-col justify-center gap-y-2.5 text-sm text-neutral-300/90 leading-relaxed">
                    {ozellikler.map((satir, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-left">
                        <span className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-neutral-600">
                          <span className="h-2 w-2 rounded-full bg-neutral-400" />
                        </span>
                        <span className="min-w-0 break-words">{satir}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Sağ: fiyat + buton */}
                <div className="contents md:order-4 md:flex md:flex-col md:justify-center md:min-w-0 md:w-[9.5rem] lg:w-[12rem] md:flex-shrink-0 md:ml-auto">
                  {fiyatGoster && (
                    <div className="order-2 md:order-none min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-1.5 md:justify-center">
                        <span className="text-3xl font-black text-white tracking-tight break-all">₺{paket.fiyat}</span>
                        {paket.sure && <span className="text-neutral-500 text-base">/ {paket.sure}</span>}
                      </div>
                      <p className="text-neutral-600 text-[11px] mt-0.5 md:text-center">K.D.V. dahildir</p>
                    </div>
                  )}
                  <button type="button" onClick={() => handleWhatsappClick(baslik)}
                    className={`order-5 md:order-none mt-auto md:mt-4 w-full py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-tight border border-neutral-700 bg-neutral-900/90 text-neutral-200 transition-colors duration-200 ${tema.btn}`}>
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
