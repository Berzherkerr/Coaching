import { useEffect, useState } from "react";
import MotionReveal from "./MotionReveal";
import { RevealHeading } from "./TextReveal";
import { openWhatsApp } from "../utils/whatsapp";

const GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const GUN_KISA = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pa"];
const AYLAR = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const SAATLER = [
  "07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30",
  "19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30",
  "23:00","23:30","24:00","24:30",
];
const WHATSAPP = "905334409803";

const jsTR = (d) => (d + 6) % 7;
const dateToGun = (date) => GUNLER[jsTR(date.getDay())];
const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const fmtKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

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
  const [viewDate, setViewDate]   = useState(() => { const t = new Date(); t.setDate(1); return t; });
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((d) => { setSlots(d.slots || {}); setUpdatedAt(d.updatedAt || null); })
      .catch(() => {});
  }, []);

  const getSlot = (date, saat) => slots[fmtKey(date)]?.[saat] || "kapali";

  const dateDurumu = (date) => {
    const aktif = SAATLER.filter((s) => getSlot(date, s) !== "kapali");
    if (!aktif.length) return "yok";
    return aktif.some((s) => getSlot(date, s) === "bos") ? "bos" : "dolu";
  };

  const today = new Date();
  const days = calendarDays(viewDate.getFullYear(), viewDate.getMonth());

  const prevMonth = () => setViewDate((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1));
  const nextMonth = () => setViewDate((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1));

  const handleBook = (saat) => {
    const tarih = selectedDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
    const gun = dateToGun(selectedDate);
    const msg = `Merhaba, ${tarih} ${gun} günü saat ${saat} için randevu almak istiyorum.`;
    openWhatsApp(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`);
  };

  return (
    <section id="program" className="relative z-10 bg-neutral-950 pt-[5.78rem] pb-[4.62rem] px-4 sm:px-8 lg:px-20">
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
          <div className="flex flex-col md:flex-row gap-5 items-stretch">

            {/* Takvim */}
            <div className="w-full md:w-[38%] bg-neutral-900 border border-neutral-800 rounded-xl p-4 select-none flex flex-col">
              <div className="flex items-center justify-center gap-2 mb-4">
                <select
                  value={viewDate.getMonth()}
                  onChange={(e) => setViewDate(new Date(viewDate.getFullYear(), +e.target.value, 1))}
                  className="w-[48%] bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:border-orange-500 cursor-pointer">
                  {AYLAR.map((a, i) => <option key={i} value={i}>{a}</option>)}
                </select>
                <select
                  value={viewDate.getFullYear()}
                  onChange={(e) => setViewDate(new Date(+e.target.value, viewDate.getMonth(), 1))}
                  className="w-[48%] bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:border-orange-500 cursor-pointer">
                  {[2025,2026,2027,2028].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-7 mb-1">
                {GUN_KISA.map((g) => (
                  <div key={g} className="text-center text-[10px] font-semibold text-neutral-600 py-1">{g}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-1">
                {days.map(({ date, cur }, idx) => {
                  const durum = dateDurumu(date);
                  const isToday    = sameDay(date, today);
                  const isSelected = sameDay(date, selectedDate);
                  const isPast     = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                  return (
                    <button key={idx}
                      onClick={() => { if (!cur) return; setSelectedDate(date); setViewDate(new Date(date.getFullYear(), date.getMonth(), 1)); }}
                      className={[
                        "relative flex flex-col items-center justify-center h-9 w-full rounded-sm transition-all duration-100",
                        !cur ? "opacity-20 cursor-default pointer-events-none" : "",
                        isSelected && cur
                          ? "bg-orange-500 text-black font-bold shadow-[0_0_12px_rgba(249,115,22,0.4)]"
                          : isToday && cur
                            ? "ring-1 ring-orange-500/50 text-white hover:bg-neutral-800 cursor-pointer"
                            : cur ? "hover:bg-neutral-800 text-neutral-200 cursor-pointer" : "text-neutral-500",
                      ].filter(Boolean).join(" ")}
                    >
                      <span className="text-[13px] leading-none">{date.getDate()}</span>
                      {cur && !isPast && durum !== "yok" && (
                        <span className={["mt-[2px] w-[5px] h-[5px] rounded-full",
                          isSelected ? "bg-black/30" : durum === "bos" ? "bg-emerald-400" : "bg-red-500",
                        ].join(" ")} />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center gap-5 text-[10px] text-neutral-600">
                <span className="flex items-center gap-1.5"><span className="w-[5px] h-[5px] rounded-full bg-emerald-400" /> Müsait</span>
                <span className="flex items-center gap-1.5"><span className="w-[5px] h-[5px] rounded-full bg-red-500" /> Dolu</span>
              </div>
            </div>

            {/* Saatler */}
            <div className="w-full md:w-[62%] bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col">
              <p className="text-base font-semibold mb-4 flex-shrink-0">
                <span className="text-white">{selectedDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span className="text-neutral-500 ml-2">{dateToGun(selectedDate)}</span>
              </p>

              <div className="flex-1 min-h-[300px] md:min-h-0 grid grid-cols-6 gap-1.5" style={{ gridAutoRows: "1fr" }}>
                {SAATLER.map((saat) => {
                  const durum = getSlot(selectedDate, saat);
                  const isPastDate = selectedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                  if (isPastDate) return (
                    <span key={saat}
                      className="w-full h-full rounded-sm border border-neutral-800/40 text-neutral-800 text-[11px] flex items-center justify-center">
                      {saat}
                    </span>
                  );
                  return (
                    <button key={saat} onClick={() => handleBook(saat)}
                      className={[
                        "w-full h-full rounded-sm border text-[11px] font-semibold transition-all flex items-center justify-center",
                        durum === "bos"
                          ? "bg-emerald-500/10 hover:bg-emerald-500/25 border-emerald-500/30 text-emerald-400"
                          : durum === "dolu"
                            ? "border-red-500/20 text-red-500/50 line-through hover:bg-red-500/5"
                            : "border-neutral-700/70 text-neutral-500 hover:bg-neutral-800/60 hover:text-neutral-300",
                      ].join(" ")}
                    >
                      {saat}
                    </button>
                  );
                })}
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
