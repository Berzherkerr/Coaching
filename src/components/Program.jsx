import { useEffect, useState } from "react";
import MotionReveal from "./MotionReveal";
import { RevealHeading } from "./TextReveal";

const GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const GUN_KISA = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const SAATLER = [
  "07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30",
  "19:00","19:30","20:00","20:30","21:00",
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

  useEffect(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((d) => { setSlots(d.slots || {}); setUpdatedAt(d.updatedAt || null); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const getSlot = (gun, saat) => slots[gun]?.[saat] || "kapali";

  const hicSlotVar = loaded && GUNLER.some((g) => SAATLER.some((s) => getSlot(g, s) !== "kapali"));
  if (!loaded || !hicSlotVar) return null;

  const handleBook = (gun, saat) => {
    const msg = `Merhaba, ${gun} günü saat ${saat} için randevu almak istiyorum.`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  // Sadece en az bir aktif slot olan satırları göster
  const aktifSaatler = SAATLER.filter((saat) =>
    GUNLER.some((g) => getSlot(g, saat) !== "kapali")
  );

  return (
    <section id="program" className="relative z-10 bg-neutral-950 pt-20 pb-16 px-4 sm:px-8 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <MotionReveal>
          <div className="text-center mb-12">
            <RevealHeading
              as="h2"
              mode="word"
              className="text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-[-0.02em]"
            >
              Haftalık Program
            </RevealHeading>
            <p className="mt-4 text-base md:text-lg font-medium text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              Müsait saatlerden birini seçerek WhatsApp üzerinden hemen randevu alabilirsin.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal delay={80}>
          <div className="hidden md:block overflow-x-auto rounded-sm border border-neutral-800">
            <table className="w-full border-collapse text-sm table-fixed">
              <thead>
                <tr>
                  <th className="bg-neutral-900 text-neutral-500 font-medium px-3 py-3 text-left border-b border-r border-neutral-800 w-16">
                    Saat
                  </th>
                  {GUNLER.map((gun, i) => (
                    <th key={gun} className="bg-neutral-900 text-neutral-300 font-semibold py-3 border-b border-r border-neutral-800 last:border-r-0 text-center">
                      <span className="hidden lg:block">{gun}</span>
                      <span className="lg:hidden">{GUN_KISA[i]}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {aktifSaatler.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-neutral-600 py-10 text-sm">
                      Program henüz ayarlanmadı.
                    </td>
                  </tr>
                ) : (
                  aktifSaatler.map((saat) => (
                    <tr key={saat} className="border-b border-neutral-800 last:border-b-0">
                      <td className="bg-neutral-900/40 text-neutral-500 font-mono px-3 py-2 border-r border-neutral-800 whitespace-nowrap text-xs">
                        {saat}
                      </td>
                      {GUNLER.map((gun) => {
                        const durum = getSlot(gun, saat);
                        return (
                          <td key={gun} className="border-r border-neutral-800 last:border-r-0 p-1.5">
                            {durum === "bos" ? (
                              <button
                                onClick={() => handleBook(gun, saat)}
                                className="w-full py-1.5 rounded-sm bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all"
                              >
                                Müsait
                              </button>
                            ) : durum === "dolu" ? (
                              <span className="flex w-full py-1.5 justify-center rounded-sm bg-red-500/10 border border-red-500/20 text-red-500/60 text-xs">
                                Dolu
                              </span>
                            ) : (
                              <span className="flex w-full py-1.5 justify-center text-neutral-800 text-xs">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobil: günlere göre kart listesi */}
          <div className="md:hidden space-y-3">
            {GUNLER.map((gun) => {
              const boslar = SAATLER.filter((s) => getSlot(gun, s) === "bos");
              const dolular = SAATLER.filter((s) => getSlot(gun, s) === "dolu");
              if (boslar.length === 0 && dolular.length === 0) return null;
              return (
                <div key={gun} className="bg-neutral-900 border border-neutral-800 rounded-sm p-4">
                  <p className="text-white font-semibold mb-3 text-sm">{gun}</p>
                  {boslar.length > 0 && (
                    <div className="mb-2">
                      <p className="text-neutral-500 text-xs mb-1.5">Müsait</p>
                      <div className="flex flex-wrap gap-2">
                        {boslar.map((s) => (
                          <button key={s} onClick={() => handleBook(gun, s)}
                            className="py-1 px-3 rounded-sm bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {dolular.length > 0 && (
                    <div>
                      <p className="text-neutral-500 text-xs mb-1.5">Dolu</p>
                      <div className="flex flex-wrap gap-2">
                        {dolular.map((s) => (
                          <span key={s} className="py-1 px-3 rounded-sm bg-red-500/10 border border-red-500/20 text-red-500/60 text-xs">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {GUNLER.every((g) => SAATLER.every((s) => getSlot(g, s) === "kapali")) && (
              <p className="text-neutral-600 text-center py-8 text-sm">Program henüz ayarlanmadı.</p>
            )}
          </div>
          {updatedAt && (
            <p className="mt-4 text-neutral-600 text-xs">
              Son güncelleme: {formatUpdatedAt(updatedAt)}
            </p>
          )}
        </MotionReveal>
      </div>
    </section>
  );
}
