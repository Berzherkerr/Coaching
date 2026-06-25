import { useEffect, useState } from "react";
import MotionReveal from "./MotionReveal";
import { RevealHeading } from "./TextReveal";

const GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const GUN_KISA = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const SAATLER = [
  "07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30",
  "19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30",
  "23:00","23:30","24:00",
];

const WHATSAPP = "905334409803";

function formatUpdatedAt(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function Program() {
  const [slots, setSlots] = useState({});
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedGun, setSelectedGun] = useState(null);

  useEffect(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((d) => {
        setSlots(d.slots || {});
        setUpdatedAt(d.updatedAt || null);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const getSlot = (gun, saat) => slots[gun]?.[saat] || "kapali";

  const gunDurumu = (gun) => {
    const aktif = SAATLER.filter((s) => getSlot(gun, s) !== "kapali");
    if (!aktif.length) return "yok";
    const bosSayisi = aktif.filter((s) => getSlot(gun, s) === "bos").length;
    if (bosSayisi > 0) return "bos";
    return "dolu";
  };

  const hicSlotVar = loaded && GUNLER.some((g) => SAATLER.some((s) => getSlot(g, s) !== "kapali"));
  if (!loaded || !hicSlotVar) return null;

  // İlk yüklemede varsayılan gün: ilk aktif gün
  const aktifGun = selectedGun || GUNLER.find((g) => gunDurumu(g) !== "yok") || GUNLER[0];

  const aktifSaatler = SAATLER.filter((s) => getSlot(aktifGun, s) !== "kapali");

  const handleBook = (gun, saat) => {
    const msg = `Merhaba, ${gun} günü saat ${saat} için randevu almak istiyorum.`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="program" className="relative z-10 bg-neutral-950 pt-[5.25rem] pb-[4.2rem] px-4 sm:px-8 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <MotionReveal>
          <div className="text-center mb-12">
            <RevealHeading as="h2" mode="word"
              className="text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-[-0.02em]">
              Haftalık Program
            </RevealHeading>
            <p className="mt-4 text-base md:text-lg font-medium text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              Gün seç, müsait saati bul, WhatsApp'tan randevu al.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal delay={80}>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">

            {/* Sol: gün seçici (1/3) */}
            <div className="md:w-1/3 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
              {GUNLER.map((gun, idx) => {
                const durum = gunDurumu(gun);
                const secili = gun === aktifGun;
                return (
                  <button
                    key={gun}
                    onClick={() => durum !== "yok" && setSelectedGun(gun)}
                    disabled={durum === "yok"}
                    className={`flex-shrink-0 md:flex-shrink w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-150 text-left
                      ${secili
                        ? "bg-orange-500/15 border-orange-500/60 text-white"
                        : durum === "yok"
                          ? "bg-neutral-900/30 border-neutral-800/50 text-neutral-700 cursor-not-allowed"
                          : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-semibold hidden md:block ${secili ? "text-white" : ""}`}>{gun}</span>
                      <span className={`text-sm font-semibold md:hidden ${secili ? "text-white" : ""}`}>{GUN_KISA[idx]}</span>
                    </div>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      durum === "bos" ? "bg-emerald-400" :
                      durum === "dolu" ? "bg-red-500" :
                      "bg-neutral-800"
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* Sağ: seçilen günün saatleri (2/3) */}
            <div className="md:w-2/3 bg-neutral-900 border border-neutral-800 rounded-xl p-5 min-h-[240px]">
              <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest mb-4">
                {aktifGun} — Saatler
              </p>

              {aktifSaatler.length === 0 ? (
                <p className="text-neutral-600 text-sm py-8 text-center">Bu gün için müsait saat yok.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {aktifSaatler.map((saat) => {
                    const durum = getSlot(aktifGun, saat);
                    if (durum === "bos") return (
                      <button key={saat} onClick={() => handleBook(aktifGun, saat)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all">
                        {saat}
                      </button>
                    );
                    if (durum === "dolu") return (
                      <span key={saat}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500/50 text-xs line-through">
                        {saat}
                      </span>
                    );
                    return null;
                  })}
                </div>
              )}

              <div className="mt-6 flex items-center gap-4 text-xs text-neutral-600">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Müsait</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Dolu</span>
              </div>
            </div>

          </div>

          {updatedAt && (
            <p className="mt-4 text-neutral-600 text-xs">Son güncelleme: {formatUpdatedAt(updatedAt)}</p>
          )}
        </MotionReveal>
      </div>
    </section>
  );
}
