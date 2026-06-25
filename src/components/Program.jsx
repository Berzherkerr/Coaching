import { useEffect, useState } from "react";
import MotionReveal from "./MotionReveal";
import { RevealHeading } from "./TextReveal";

const GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const GUN_KISA = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pa"];
const AYLAR = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const SAATLER = [
  "07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30",
  "19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30",
  "23:00","23:30","24:00",
];
const WHATSAPP = "905334409803";

// JS getDay(): 0=Pazar,1=Pzt...6=Cmt => TR sirasi Pzt=0..Paz=6
const jsTR = (d) => (d + 6) % 7;
const dateToGun = (date) => GUNLER[jsTR(date.getDay())];
const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

function calendarDays(year, month) {
  const first = new Date(year, month, 1);
  const last  = new Date(year, month + 1, 0);
  const offset = jsTR(first.getDay());
  const days = [];
  for (let i = offset - 1; i >= 0; i--)
    days.push({ date: new Date(year, month, -i), cur: false });
  for (let d = 1; d <= last.getDate(); d++)
    days.push({ date: new Date(year, month, d), cur: true });
  const fill = 42 - days.length;
  for (let d = 1; d <= fill; d++)
    days.push({ date: new Date(year, month + 1, d), cur: false });
  return days;
}

function formatUpdatedAt(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function Program() {
  const [slots, setSlots]         = useState({});
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loaded, setLoaded]       = useState(false);
  const [viewDate, setViewDate]   = useState(() => { const t = new Date(); t.setDate(1); return t; });
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((d) => { setSlots(d.slots || {}); setUpdatedAt(d.updatedAt || null); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const getSlot = (gun, saat) => slots[gun]?.[saat] || "kapali";

  const gunDurumu = (gun) => {
    const aktif = SAATLER.filter((s) => getSlot(gun, s) !== "kapali");
    if (!aktif.length) return "yok";
    return aktif.some((s) => getSlot(gun, s) === "bos") ? "bos" : "dolu";
  };

  const hicSlotVar = loaded && GUNLER.some((g) => SAATLER.some((s) => getSlot(g, s) !== "kapali"));
  if (!loaded || !hicSlotVar) return null;

  const today = new Date();
  const days = calendarDays(viewDate.getFullYear(), viewDate.getMonth());
  const aktifGun = dateToGun(selectedDate);
  const aktifSaatler = SAATLER.filter((s) => getSlot(aktifGun, s) !== "kapali");

  const prevMonth = () => setViewDate((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1));
  const nextMonth = () => setViewDate((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1));

  const handleBook = (saat) => {
    const tarih = selectedDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
    const msg = `Merhaba, ${tarih} ${aktifGun} günü saat ${saat} için randevu almak istiyorum.`;
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
              Gün seç, müsait saati bul, WhatsApp üzerinden randevu al.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal delay={80}>
          {/* Desktop: yan yana | Mobil: alt alta */}
          <div className="flex flex-col md:flex-row gap-5">

            {/* ── Takvim (sol 38%) ── */}
            <div className="w-full md:w-[38%] bg-neutral-900 border border-neutral-800 rounded-xl p-4 select-none">

              {/* Ay navigasyonu */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors text-lg">
                  ‹
                </button>
                <span className="text-white text-sm font-semibold tracking-wide">
                  {AYLAR[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <button onClick={nextMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors text-lg">
                  ›
                </button>
              </div>

              {/* Haftanın günleri */}
              <div className="grid grid-cols-7 mb-1">
                {GUN_KISA.map((g) => (
                  <div key={g} className="text-center text-[10px] font-semibold text-neutral-600 py-1">{g}</div>
                ))}
              </div>

              {/* Gün grid */}
              <div className="grid grid-cols-7 gap-y-1">
                {days.map(({ date, cur }, idx) => {
                  const gun = dateToGun(date);
                  const durum = gunDurumu(gun);
                  const isToday    = sameDay(date, today);
                  const isSelected = sameDay(date, selectedDate);
                  const isPast     = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                  const hasSlots   = cur && !isPast && durum !== "yok";

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!cur || durum === "yok") return;
                        setSelectedDate(date);
                        setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
                      }}
                      className={[
                        "relative flex flex-col items-center justify-center h-9 w-full rounded-lg transition-all duration-100",
                        !cur ? "opacity-20 cursor-default pointer-events-none" : "",
                        cur && durum === "yok" ? "cursor-default" : "",
                        isSelected && cur
                          ? "bg-orange-500 text-black font-bold shadow-[0_0_12px_rgba(249,115,22,0.4)]"
                          : isToday && cur
                            ? "ring-1 ring-orange-500/50 text-white"
                            : hasSlots
                              ? "hover:bg-neutral-800 text-neutral-200 cursor-pointer"
                              : cur
                                ? "text-neutral-600 cursor-default"
                                : "text-neutral-500",
                      ].filter(Boolean).join(" ")}
                    >
                      <span className="text-xs leading-none">{date.getDate()}</span>
                      {cur && !isPast && durum !== "yok" && (
                        <span className={[
                          "mt-[2px] w-[5px] h-[5px] rounded-full",
                          isSelected
                            ? "bg-black/30"
                            : durum === "bos"
                              ? "bg-emerald-400"
                              : "bg-red-500",
                        ].join(" ")} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Lejant */}
              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center gap-5 text-[10px] text-neutral-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-[5px] h-[5px] rounded-full bg-emerald-400" /> Müsait
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-[5px] h-[5px] rounded-full bg-red-500" /> Dolu
                </span>
              </div>
            </div>

            {/* ── Saatler (sağ 62%) ── */}
            <div className="w-full md:w-[62%] bg-neutral-900 border border-neutral-800 rounded-xl p-5 min-h-[280px]">
              <p className="text-neutral-500 text-xs mb-0.5">
                {selectedDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p className="text-white font-semibold text-base mb-6">{aktifGun}</p>

              {aktifSaatler.length === 0 ? (
                <p className="text-neutral-600 text-sm py-10 text-center">Bu gün için müsait saat yok.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {aktifSaatler.map((saat) => {
                    const durum = getSlot(aktifGun, saat);
                    if (durum === "bos") return (
                      <button key={saat} onClick={() => handleBook(saat)}
                        className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all">
                        {saat}
                      </button>
                    );
                    if (durum === "dolu") return (
                      <span key={saat}
                        className="px-4 py-2 rounded-xl bg-neutral-800/50 border border-neutral-700/40 text-neutral-600 text-xs line-through">
                        {saat}
                      </span>
                    );
                    return null;
                  })}
                </div>
              )}

              <div className="mt-8 flex items-center gap-5 text-[10px] text-neutral-600">
                <span className="flex items-center gap-1.5"><span className="w-[5px] h-[5px] rounded-full bg-emerald-400" /> Tıkla → WhatsApp randevu</span>
                <span className="flex items-center gap-1.5"><span className="w-[5px] h-[5px] rounded-full bg-red-500" /> Dolu</span>
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
