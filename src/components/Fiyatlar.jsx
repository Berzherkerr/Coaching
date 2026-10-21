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
            className="text-[2.15rem] sm:text-[2.875rem] font-bold text-white leading-[1.1] tracking-[-0.02em]">
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
          const fiyatStr = String(paket.fiyat ?? "").replace(/[\s.,]/g, "").replace(/^0+$/, "");
          const fiyatGoster = fiyatStr.length > 0;

          return (
            <MotionReveal key={paket.id} delay={index * 80}>
              <div className={`relative bg-neutral-900/95 border border-neutral-800 rounded-sm shadow-lg transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)] ${tema.kart}`}>

                {paket.etiket && (
                  <div className={`${tema.etiket} absolute -top-3 left-4 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-md tracking-[0.12em] uppercase`}>
                    {paket.etiket}
                  </div>
                )}

                {/* Desktop */}
                <div className="hidden md:grid md:grid-cols-[35%_40%_25%] md:min-h-[110px]">
                  {/* Başlık */}
                  <div className="flex flex-col justify-center px-7 py-6 gap-2">
                    <h3 className="text-[17px] lg:text-[18px] font-semibold uppercase tracking-[0.1em] text-neutral-100 leading-snug">
                      {baslik}
                    </h3>
                    {paket.tagline && (
                      <p className="text-[13px] text-neutral-500 leading-relaxed">{paket.tagline}</p>
                    )}
                  </div>

                  {/* Özellikler */}
                  <div className="flex flex-col justify-center px-6 py-6">
                    {ozellikler.length > 0 && (
                      <ul className="flex flex-col gap-y-2">
                        {ozellikler.map((satir, idx) => (
                          <li key={idx} className="text-[13px] text-neutral-300 leading-snug">
                            {satir}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Fiyat + Buton */}
                  <div className="flex flex-col items-center justify-center px-5 py-6 gap-3">
                    {fiyatGoster && (
                      <div className="text-center">
                        <div className="text-2xl lg:text-3xl font-black text-white tracking-tight">₺{paket.fiyat}</div>
                        {paket.sure && <div className="text-[11px] text-neutral-600 mt-0.5">/ {paket.sure} · KDV dahil</div>}
                      </div>
                    )}
                    <button type="button" onClick={() => handleWhatsappClick(baslik)}
                      className={`w-full py-2.5 rounded-sm text-xs font-semibold tracking-tight border border-neutral-700 bg-neutral-900 text-neutral-200 transition-colors duration-200 ${tema.btn}`}>
                      Paketi Seç
                    </button>
                  </div>
                </div>

                {/* Mobil */}
                <div className="md:hidden p-5 flex flex-col gap-3">
                  <h3 className="text-base font-semibold uppercase tracking-[0.1em] text-neutral-100 pt-1">{baslik}</h3>
                  {paket.tagline && <p className="text-[13px] text-neutral-500 leading-relaxed">{paket.tagline}</p>}
                  {ozellikler.length > 0 && (
                    <ul className="flex flex-col gap-y-1.5 pt-1">
                      {ozellikler.map((satir, idx) => (
                        <li key={idx} className="text-[13px] text-neutral-300 leading-snug">{satir}</li>
                      ))}
                    </ul>
                  )}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    {fiyatGoster ? (
                      <div>
                        <div className="text-2xl font-black text-white tracking-tight">₺{paket.fiyat}</div>
                        {paket.sure && <div className="text-[11px] text-neutral-600">/ {paket.sure} · KDV dahil</div>}
                      </div>
                    ) : <div />}
                    <button type="button" onClick={() => handleWhatsappClick(baslik)}
                      className={`flex-shrink-0 px-5 py-2.5 rounded-sm text-xs font-semibold tracking-tight border border-neutral-700 bg-neutral-900 text-neutral-200 transition-colors duration-200 ${tema.btn}`}>
                      Paketi Seç
                    </button>
                  </div>
                </div>

              </div>
            </MotionReveal>
          );
        })}
      </div>
    </section>
  );
}
