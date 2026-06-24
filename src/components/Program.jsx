import { useEffect, useState } from "react";
import MotionReveal from "./MotionReveal";
import { RevealHeading } from "./TextReveal";

const GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const SAATLER = [
  "07:00","08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00",
];

const WHATSAPP = "905334409803";

export default function Program() {
  const [slots, setSlots] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((d) => { setSlots(d.slots || {}); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const getSlot = (gun, saat) => slots[gun]?.[saat] || "kapali";

  // Sadece en az bir aktif slot olan günleri göster
  const aktifGunler = GUNLER.filter((gun) =>
    SAATLER.some((s) => getSlot(gun, s) !== "kapali")
  );

  const handleBook = (gun, saat) => {
    const msg = `Merhaba, ${gun} günü saat ${saat} için randevu almak istiyorum.`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  if (!loaded) return null;
  if (aktifGunler.length === 0) return null;

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
          {/* Masaüstü: tablo */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="bg-neutral-900 text-neutral-500 font-medium px-4 py-3 text-left w-20 border-b border-r border-neutral-800">
                    Saat
                  </th>
                  {aktifGunler.map((gun) => (
                    <th key={gun} className="bg-neutral-900 text-neutral-300 font-semibold px-4 py-3 border-b border-r border-neutral-800 last:border-r-0 text-center">
                      {gun}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SAATLER.map((saat) => {
                  const herhangi = aktifGunler.some((g) => getSlot(g, saat) !== "kapali");
                  if (!herhangi) return null;
                  return (
                    <tr key={saat} className="border-b border-neutral-800 last:border-b-0">
                      <td className="bg-neutral-900/40 text-neutral-500 font-mono px-4 py-2.5 border-r border-neutral-800 whitespace-nowrap">
                        {saat}
                      </td>
                      {aktifGunler.map((gun) => {
                        const durum = getSlot(gun, saat);
                        if (durum === "kapali") {
                          return <td key={gun} className="border-r border-neutral-800 last:border-r-0 p-2" />;
                        }
                        return (
                          <td key={gun} className="border-r border-neutral-800 last:border-r-0 p-2 text-center">
                            {durum === "bos" ? (
                              <button
                                onClick={() => handleBook(gun, saat)}
                                className="w-full py-1.5 px-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all hover:scale-105"
                              >
                                Müsait
                              </button>
                            ) : (
                              <span className="inline-block w-full py-1.5 px-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500/60 text-xs">
                                Dolu
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobil: günlere göre kart listesi */}
          <div className="md:hidden space-y-4">
            {aktifGunler.map((gun) => {
              const boslar = SAATLER.filter((s) => getSlot(gun, s) === "bos");
              const dolular = SAATLER.filter((s) => getSlot(gun, s) === "dolu");
              return (
                <div key={gun} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                  <p className="text-white font-semibold mb-3">{gun}</p>
                  {boslar.length > 0 && (
                    <div className="mb-2">
                      <p className="text-neutral-500 text-xs mb-1.5">Müsait</p>
                      <div className="flex flex-wrap gap-2">
                        {boslar.map((s) => (
                          <button key={s} onClick={() => handleBook(gun, s)}
                            className="py-1 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all">
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
                          <span key={s} className="py-1 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500/60 text-xs">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
