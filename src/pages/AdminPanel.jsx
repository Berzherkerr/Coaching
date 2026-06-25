import { useState, useEffect } from "react";

const GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const SAATLER = [
  "07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30",
  "19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30",
  "23:00","23:30","24:00",
];
const SURE_SEC = [{ value: "ay", label: "/ ay" }, { value: "seans", label: "/ seans" }, { value: "program", label: "/ program" }];

const RENK_SECENEKLER = [
  { key: "blue",    label: "Mavi",   dot: "bg-blue-500"    },
  { key: "purple",  label: "Mor",    dot: "bg-purple-500"  },
  { key: "amber",   label: "Amber",  dot: "bg-amber-500"   },
  { key: "emerald", label: "Yeşil",  dot: "bg-emerald-500" },
  { key: "rose",    label: "Kırmızı",dot: "bg-rose-500"    },
  { key: "cyan",    label: "Cyan",   dot: "bg-cyan-500"    },
  { key: "orange",  label: "Turuncu",dot: "bg-orange-500"  },
];

const VARSAYILAN_PAKETLER = [
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

// kapali → bos → dolu → kapali
const CYCLE = { kapali: "bos", bos: "dolu", dolu: "kapali" };

// Takvim yardımcıları
const AYLAR_ADM = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const GUN_KISA_ADM = ["Pt","Sa","Ça","Pe","Cu","Ct","Pa"];
const jsTR_ADM = (d) => (d + 6) % 7;
const dateToGun_ADM = (date) => GUNLER[jsTR_ADM(date.getDay())];
const sameDay_ADM = (a, b) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
function calendarDays_ADM(year, month) {
  const first = new Date(year, month, 1);
  const last  = new Date(year, month + 1, 0);
  const offset = jsTR_ADM(first.getDay());
  const days = [];
  for (let i = offset - 1; i >= 0; i--) days.push({ date: new Date(year, month, -i), cur: false });
  for (let d = 1; d <= last.getDate(); d++) days.push({ date: new Date(year, month, d), cur: true });
  const fill = 42 - days.length;
  for (let d = 1; d <= fill; d++) days.push({ date: new Date(year, month + 1, d), cur: false });
  return days;
}
const SLOT_STYLE = {
  bos:    { bg: "bg-emerald-500/20 hover:bg-emerald-500/40 border-emerald-500/40 text-emerald-400", label: "Müsait" },
  dolu:   { bg: "bg-red-500/20 hover:bg-red-500/40 border-red-500/40 text-red-400",               label: "Dolu"   },
  kapali: { bg: "bg-neutral-800/60 hover:bg-neutral-700/60 border-neutral-700/40 text-neutral-600", label: ""     },
};

async function apiFetch(path, token, opts = {}) {
  return fetch(path, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
  });
}

function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    const d = await r.json();
    if (d.token) onLogin(d.token);
    else setErr(d.error || "Giriş başarısız");
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <form onSubmit={submit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <p className="text-orange-500 text-xs font-black tracking-[0.25em] uppercase mb-1">İnanç Coaching</p>
        <h1 className="text-white font-bold text-2xl mb-6">Admin Girişi</h1>
        {err && <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{err}</p>}
        <label className="block text-neutral-400 text-xs mb-1.5">Şifre</label>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" required
          className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-3 mb-5 focus:outline-none focus:border-orange-500 transition-colors" />
        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 rounded-xl transition-colors">
          Giriş Yap
        </button>
      </form>
    </div>
  );
}


const MENU_ITEMS = [
  { key: "prices",   icon: "💰", label: "Fiyatlar",        desc: "Paket fiyatlarını düzenle"       },
  { key: "schedule", icon: "📅", label: "Haftalık Program", desc: "Müsait / dolu saatleri ayarla"  },
  { key: "reviews",  icon: "⭐", label: "Yorum Akışı",     desc: "Google yorumlarını aç / kapat"  },
  { key: "blog",     icon: "✍️", label: "Blog",            desc: "Yazı yaz ve yayınla"            },
  { key: "hakkimda",  icon: "👤", label: "Hakkımda",        desc: "Tanıtım metnini düzenle"              },
  { key: "iletisim",  icon: "📞", label: "İletişim",        desc: "Telefon, e-posta ve konum güncelle"   },
  { key: "hero",      icon: "🎬", label: "Hero Yazısı",     desc: "Ana sayfa başlık ve alt yazıyı düzenle" },
  { key: "hizmetler", icon: "🛠️", label: "Hizmetler",       desc: "Hizmet kutularını düzenle"            },
];

function AnalyticsBar({ token }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiFetch("/api/admin/analytics", token)
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
    const t = setInterval(() => {
      apiFetch("/api/admin/analytics", token).then((r) => r.json()).then(setStats).catch(() => {});
    }, 30000);
    return () => clearInterval(t);
  }, [token]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {[
        { label: "Toplam Ziyaret", value: stats.total?.toLocaleString("tr-TR") ?? "—" },
        { label: "Bugün",          value: stats.today?.toLocaleString("tr-TR") ?? "—" },
        { label: "Şu An Sitede",   value: stats.active ?? "—" },
      ].map((item) => (
        <div key={item.label} className="bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-4 text-center">
          <p className="text-white font-bold text-2xl">{item.value}</p>
          <p className="text-neutral-500 text-xs mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
}


function Dashboard({ onNavigate }) {
  return (
    <div>
      <p className="text-neutral-400 text-sm mb-6">Yönetmek istediğin bölümü seç.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => !item.soon && onNavigate(item.key)}
            className={`relative text-left p-5 rounded-2xl border transition-all ${
              item.soon
                ? "border-neutral-800 bg-neutral-900/40 cursor-not-allowed opacity-50"
                : "border-neutral-800 bg-neutral-900 hover:border-orange-500/50 hover:bg-neutral-800 cursor-pointer"
            }`}
          >
            {item.soon && (
              <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">
                Yakında
              </span>
            )}
            <div className="flex items-center gap-4">
              <span className="text-3xl flex-shrink-0 w-10 text-center">{item.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm mb-0.5">{item.label}</p>
                <p className="text-neutral-500 text-xs">{item.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}


function PricesEditor({ token }) {
  const [paketler, setPaketler] = useState([]);
  const [acik, setAcik] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    apiFetch("/api/admin/prices", token)
      .then((r) => r.json())
      .then((d) => {
        const raw = d.paketler || [];
        // Eski formattan (sadece fiyat/sure) yeni formata geç
        const merged = VARSAYILAN_PAKETLER.map((def) => {
          const kv = raw.find((x) => x.id === def.id);
          if (!kv) return def;
          return { ...def, ...kv, ozellikler: kv.ozellikler || def.ozellikler };
        });
        // KV'de varsayılanlarda olmayan ekstra paketler
        const ekstra = raw.filter((x) => !VARSAYILAN_PAKETLER.find((d) => d.id === x.id));
        setPaketler([...merged, ...ekstra]);
      })
      .catch(() => setPaketler(VARSAYILAN_PAKETLER));
  }, [token]);

  const set = (i, field, val) => {
    setPaketler((prev) => { const n = [...prev]; n[i] = { ...n[i], [field]: val }; return n; });
    setStatus("idle");
  };

  const setOzellik = (pi, oi, val) => {
    setPaketler((prev) => {
      const n = [...prev];
      const oz = [...(n[pi].ozellikler || [])];
      oz[oi] = val;
      n[pi] = { ...n[pi], ozellikler: oz };
      return n;
    });
    setStatus("idle");
  };

  const addOzellik = (pi) => {
    setPaketler((prev) => {
      const n = [...prev];
      n[pi] = { ...n[pi], ozellikler: [...(n[pi].ozellikler || []), ""] };
      return n;
    });
  };

  const removeOzellik = (pi, oi) => {
    setPaketler((prev) => {
      const n = [...prev];
      n[pi] = { ...n[pi], ozellikler: n[pi].ozellikler.filter((_, idx) => idx !== oi) };
      return n;
    });
    setStatus("idle");
  };

  const addPaket = () => {
    const yeni = {
      id: `paket_${Date.now()}`,
      title: "Yeni Paket",
      tagline: "",
      fiyat: "0",
      sure: "ay",
      etiket: "",
      renk: "cyan",
      ozellikler: ["", "", "", "", ""],
    };
    setPaketler((prev) => [...prev, yeni]);
    setAcik(paketler.length);
    setStatus("idle");
  };

  const deletePaket = (i) => {
    if (!confirm("Bu paketi silmek istiyor musun?")) return;
    setPaketler((prev) => prev.filter((_, idx) => idx !== i));
    setAcik(null);
    setStatus("idle");
  };

  const save = async () => {
    setStatus("saving");
    const r = await apiFetch("/api/admin/prices", token, { method: "PUT", body: JSON.stringify({ paketler }) });
    setStatus(r.ok ? "saved" : "error");
    if (r.ok) setTimeout(() => setStatus("idle"), 2500);
  };

  const inputCls = "w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 transition-colors text-sm";

  return (
    <div className="space-y-3">
      {paketler.map((p, i) => (
        <div key={p.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <button type="button" onClick={() => setAcik(acik === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full flex-shrink-0 ${RENK_SECENEKLER.find(r => r.key === p.renk)?.dot || "bg-neutral-500"}`} />
              <span className="text-white font-medium text-sm">{p.title}</span>
              <span className="text-neutral-500 text-xs">₺{p.fiyat} / {p.sure}</span>
            </div>
            <span className="text-neutral-500 text-xs">{acik === i ? "▲" : "▼"}</span>
          </button>

          {acik === i && (
            <div className="px-5 pb-5 space-y-4 border-t border-neutral-800 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-500 text-xs mb-1.5 block">Başlık</label>
                  <input value={p.title} onChange={(e) => set(i, "title", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-neutral-500 text-xs mb-1.5 block">Etiket (badge)</label>
                  <input value={p.etiket || ""} onChange={(e) => set(i, "etiket", e.target.value)} placeholder="EN ÇOK TERCİH EDİLEN" className={inputCls} />
                </div>
              </div>

              <div>
                <label className="text-neutral-500 text-xs mb-1.5 block">Alt açıklama</label>
                <input value={p.tagline || ""} onChange={(e) => set(i, "tagline", e.target.value)} className={inputCls} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-500 text-xs mb-1.5 block">Fiyat (₺)</label>
                  <input value={p.fiyat} onChange={(e) => set(i, "fiyat", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-neutral-500 text-xs mb-1.5 block">Periyot</label>
                  <select value={p.sure} onChange={(e) => set(i, "sure", e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-500 transition-colors text-sm">
                    {SURE_SEC.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-500 text-xs mb-2 block">Renk teması</label>
                <div className="flex gap-2 flex-wrap">
                  {RENK_SECENEKLER.map((r) => (
                    <button key={r.key} type="button" onClick={() => set(i, "renk", r.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${p.renk === r.key ? "bg-neutral-700 text-white border border-neutral-500" : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700"}`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${r.dot}`} />
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-neutral-500 text-xs mb-2 block">Özellikler</label>
                <div className="space-y-2">
                  {(p.ozellikler || []).map((oz, oi) => (
                    <div key={oi} className="flex gap-2 items-center">
                      <input value={oz} onChange={(e) => setOzellik(i, oi, e.target.value)}
                        className="flex-1 bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-orange-500 transition-colors text-sm" />
                      {(p.ozellikler || []).length > 1 && (
                        <button type="button" onClick={() => removeOzellik(i, oi)}
                          className="text-red-400 hover:text-red-300 px-2 text-lg leading-none">✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addOzellik(i)}
                    className="text-xs text-orange-500 hover:text-orange-400 transition-colors">+ Madde ekle</button>
                </div>
              </div>

              <button type="button" onClick={() => deletePaket(i)}
                className="text-xs text-red-500 hover:text-red-400 transition-colors pt-1">
                Bu paketi sil
              </button>
            </div>
          )}
        </div>
      ))}

      <button type="button" onClick={addPaket}
        className="w-full py-3 rounded-xl border border-dashed border-neutral-700 text-neutral-400 hover:border-orange-500 hover:text-orange-400 text-sm transition-colors">
        + Yeni Paket Ekle
      </button>

      <div className="flex gap-3">
        <button type="button" onClick={save} disabled={status === "saving"}
          className={`flex-1 font-bold py-3.5 rounded-xl transition-all ${
            status === "saved" ? "bg-green-600 text-white"
            : status === "error" ? "bg-red-600 text-white"
            : "bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black"
          }`}>
          {status === "saving" ? "Kaydediliyor..." : status === "saved" ? "✓ Kaydedildi" : status === "error" ? "Hata" : "Tüm Paketleri Kaydet"}
        </button>
        <button type="button"
          onClick={async () => {
            if (!confirm("Paketleri varsayılana sıfırlamak istediğine emin misin?")) return;
            setPaketler(VARSAYILAN_PAKETLER);
            setAcik(null);
            setStatus("saving");
            const r = await apiFetch("/api/admin/prices", token, { method: "PUT", body: JSON.stringify({ paketler: VARSAYILAN_PAKETLER }) });
            setStatus(r.ok ? "saved" : "error");
            if (r.ok) setTimeout(() => setStatus("idle"), 2500);
          }}
          className="px-4 py-3.5 rounded-xl border border-neutral-700 text-neutral-400 hover:border-red-500 hover:text-red-400 text-xs transition-all">
          Sıfırla
        </button>
      </div>
    </div>
  );
}


function ScheduleEditor({ token }) {
  const [slots, setSlots] = useState({});
  const [status, setStatus] = useState("idle");
  const [viewDate, setViewDate] = useState(() => { const t = new Date(); t.setDate(1); return t; });
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    apiFetch("/api/admin/schedule", token)
      .then((r) => r.json())
      .then((d) => { if (d.slots) setSlots(d.slots); })
      .catch(() => {});
  }, [token]);

  const aktifGun = dateToGun_ADM(selectedDate);
  const getSlot = (gun, saat) => slots[gun]?.[saat] || "kapali";

  const toggle = (saat) => {
    setSlots((prev) => ({
      ...prev,
      [aktifGun]: { ...(prev[aktifGun] || {}), [saat]: CYCLE[getSlot(aktifGun, saat)] },
    }));
    setStatus("idle");
  };

  const fillGun = (durum) => {
    setSlots((prev) => ({
      ...prev,
      [aktifGun]: Object.fromEntries(SAATLER.map((s) => [s, durum])),
    }));
    setStatus("idle");
  };

  const save = async () => {
    setStatus("saving");
    const r = await apiFetch("/api/admin/schedule", token, { method: "PUT", body: JSON.stringify({ slots }) });
    setStatus(r.ok ? "saved" : "error");
    if (r.ok) setTimeout(() => setStatus("idle"), 2500);
  };

  const today = new Date();
  const days = calendarDays_ADM(viewDate.getFullYear(), viewDate.getMonth());

  const gunDurumu = (gun) => {
    const aktif = SAATLER.filter((s) => getSlot(gun, s) !== "kapali");
    if (!aktif.length) return "yok";
    return aktif.some((s) => getSlot(gun, s) === "bos") ? "bos" : "dolu";
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-5">

        {/* ── Takvim ── */}
        <div className="w-full md:w-[38%] bg-neutral-900 border border-neutral-800 rounded-xl p-4 select-none">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setViewDate((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors text-lg">‹</button>
            <span className="text-white text-sm font-semibold">{AYLAR_ADM[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
            <button onClick={() => setViewDate((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors text-lg">›</button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {GUN_KISA_ADM.map((g) => (
              <div key={g} className="text-center text-[10px] font-semibold text-neutral-600 py-1">{g}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {days.map(({ date, cur }, idx) => {
              const gun = dateToGun_ADM(date);
              const durum = gunDurumu(gun);
              const isToday    = sameDay_ADM(date, today);
              const isSelected = sameDay_ADM(date, selectedDate);
              return (
                <button key={idx}
                  onClick={() => { if (!cur) return; setSelectedDate(date); setViewDate(new Date(date.getFullYear(), date.getMonth(), 1)); }}
                  className={[
                    "relative flex flex-col items-center justify-center h-9 w-full rounded-lg transition-all duration-100",
                    !cur ? "opacity-20 cursor-default pointer-events-none" : "",
                    isSelected && cur
                      ? "bg-orange-500 text-black font-bold shadow-[0_0_12px_rgba(249,115,22,0.4)]"
                      : isToday && cur
                        ? "ring-1 ring-orange-500/50 text-white hover:bg-neutral-800 cursor-pointer"
                        : cur
                          ? "hover:bg-neutral-800 text-neutral-200 cursor-pointer"
                          : "text-neutral-500",
                  ].filter(Boolean).join(" ")}
                >
                  <span className="text-xs leading-none">{date.getDate()}</span>
                  {cur && durum !== "yok" && (
                    <span className={["mt-[2px] w-[5px] h-[5px] rounded-full", isSelected ? "bg-black/30" : durum === "bos" ? "bg-emerald-400" : "bg-red-500"].join(" ")} />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center gap-5 text-[10px] text-neutral-600">
            <span className="flex items-center gap-1.5"><span className="w-[5px] h-[5px] rounded-full bg-emerald-400" /> Müsait saat var</span>
            <span className="flex items-center gap-1.5"><span className="w-[5px] h-[5px] rounded-full bg-red-500" /> Hepsi dolu</span>
          </div>
        </div>

        {/* ── Saat grid ── */}
        <div className="w-full md:w-[62%] bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-base font-semibold">
                <span className="text-white">{selectedDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span className="text-neutral-500 ml-2">{aktifGun}</span>
              </p>
              <p className="text-neutral-600 text-xs mt-0.5">Tıkla → Kapalı › Müsait › Dolu › Kapalı</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => fillGun("bos")} title="Tümü müsait"
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-semibold transition-colors">Tümü Müsait</button>
              <button onClick={() => fillGun("dolu")} title="Tümü dolu"
                className="px-2.5 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 text-[10px] font-semibold transition-colors">Tümü Dolu</button>
              <button onClick={() => fillGun("kapali")} title="Tümü kapat"
                className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-500 text-[10px] font-semibold transition-colors">Temizle</button>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-6 gap-1.5 mt-4" style={{ gridAutoRows: "1fr" }}>
            {SAATLER.map((saat) => {
              const durum = getSlot(aktifGun, saat);
              return (
                <button key={saat} onClick={() => toggle(saat)} title={`${saat} — ${durum}`}
                  className={[
                    "w-full h-full rounded-lg border text-[11px] font-semibold transition-all flex items-center justify-center",
                    durum === "bos"
                      ? "bg-emerald-500/15 hover:bg-emerald-500/30 border-emerald-500/40 text-emerald-400"
                      : durum === "dolu"
                        ? "bg-red-500/15 hover:bg-red-500/30 border-red-500/40 text-red-400 line-through"
                        : "bg-neutral-800/60 hover:bg-neutral-700/60 border-neutral-700/40 text-neutral-600",
                  ].join(" ")}
                >
                  {saat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button onClick={save} disabled={status === "saving"}
        className={`mt-5 w-full font-bold py-3.5 rounded-xl transition-all ${
          status === "saved" ? "bg-green-600 text-white"
          : status === "error" ? "bg-red-600 text-white"
          : "bg-orange-500 hover:bg-orange-400 disabled:bg-neutral-700 disabled:text-neutral-500 text-black"
        }`}>
        {status === "saving" ? "Kaydediliyor..." : status === "saved" ? "✓ Kaydedildi" : status === "error" ? "Hata, tekrar dene" : "Programı Kaydet"}
      </button>
      <p className="text-neutral-600 text-xs text-center mt-2">Değişiklikler sitede anında güncellenir.</p>
    </div>
  );
}

function ReviewsSettings({ token }) {
  const [visible, setVisible] = useState(true);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    apiFetch("/api/admin/settings", token)
      .then((r) => r.json())
      .then((d) => { if (typeof d.reviewsVisible === "boolean") setVisible(d.reviewsVisible); })
      .catch(() => {});
  }, [token]);

  const save = async (val) => {
    setVisible(val);
    setStatus("saving");
    const r = await apiFetch("/api/admin/settings", token, { method: "PUT", body: JSON.stringify({ reviewsVisible: val }) });
    setStatus(r.ok ? "saved" : "error");
    setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
      <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest mb-5">Google Yorumlar Bölümü</p>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-white font-medium text-sm">Yorum kartlarını göster</p>
          <p className="text-neutral-500 text-xs mt-1">Kapatırsan akan yorum kutuları gizlenir, başlık ve butonlar kalır.</p>
        </div>
        <button onClick={() => save(!visible)} aria-pressed={visible}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${visible ? "bg-orange-500" : "bg-neutral-700"}`}>
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${visible ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>
      {status === "saved"  && <p className="text-green-400 text-xs mt-3">✓ Kaydedildi</p>}
      {status === "error"  && <p className="text-red-400 text-xs mt-3">Hata oluştu</p>}
      {status === "saving" && <p className="text-neutral-500 text-xs mt-3">Kaydediliyor...</p>}
    </div>
  );
}

function BlogEditor({ token }) {
  const [posts, setPosts]         = useState([]);
  const [editing, setEditing]     = useState(null);
  const [title, setTitle]         = useState("");
  const [content, setContent]     = useState("");
  const [coverImage, setCoverImage]   = useState("");
  const [contentImages, setContentImages] = useState([""]);
  const [saving, setSaving]       = useState(false);

  const load = () =>
    apiFetch("/api/admin/blog", token).then((r) => r.json()).then((d) => setPosts(d.posts || [])).catch(() => {});

  useEffect(() => { load(); }, [token]);

  const startNew = () => { setEditing({}); setTitle(""); setContent(""); setCoverImage(""); setContentImages([""]); };
  const startEdit = (p) => {
    setEditing(p);
    setTitle(p.title);
    setContent(p.content);
    setCoverImage(p.coverImage || "");
    setContentImages(p.contentImages?.length ? p.contentImages : [""]);
  };
  const cancel = () => { setEditing(null); setTitle(""); setContent(""); setCoverImage(""); setContentImages([""]); };

  const addImageRow    = () => setContentImages((prev) => [...prev, ""]);
  const removeImageRow = (i) => setContentImages((prev) => prev.filter((_, idx) => idx !== i));
  const updateImage    = (i, val) => setContentImages((prev) => { const n = [...prev]; n[i] = val; return n; });

  const savePost = async (draft) => {
    setSaving(true);
    const isNew = !editing?.id;
    const images = contentImages.map((u) => u.trim()).filter(Boolean);
    const r = await apiFetch(
      isNew ? "/api/admin/blog" : `/api/admin/blog?id=${editing.id}`,
      token,
      { method: isNew ? "POST" : "PUT", body: JSON.stringify({ title, content, coverImage: coverImage.trim(), contentImages: images, draft }) }
    );
    setSaving(false);
    if (r.ok) { cancel(); load(); }
  };

  const deletePost = async (id) => {
    if (!confirm("Bu yazıyı silmek istiyor musun?")) return;
    await apiFetch(`/api/admin/blog?id=${id}`, token, { method: "DELETE" });
    load();
  };

  const toggleDraft = async (p) => {
    await apiFetch(`/api/admin/blog?id=${p.id}`, token, { method: "PUT", body: JSON.stringify({ draft: !p.draft }) });
    load();
  };

  if (editing !== null) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={cancel} className="text-neutral-500 hover:text-white text-sm px-2 py-1 border border-neutral-800 hover:border-neutral-600 rounded-lg transition-colors">← Geri</button>
          <h2 className="text-white font-semibold">{editing.id ? "Yazıyı Düzenle" : "Yeni Yazı"}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-neutral-500 text-xs mb-1.5 block">Başlık</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Yazı başlığı..."
              className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors" />
          </div>

          <div>
            <label className="text-neutral-500 text-xs mb-1.5 block">Kapak Resmi URL</label>
            <input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..."
              className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors text-sm" />
            {coverImage.trim() && (
              <img src={coverImage.trim()} alt="kapak önizleme" className="mt-2 w-full h-36 object-cover rounded-lg opacity-80" onError={(e) => e.target.style.display="none"} />
            )}
          </div>

          <div>
            <label className="text-neutral-500 text-xs mb-1.5 block">İçerik</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Yazı içeriği... (boş satır = yeni paragraf)"
              rows={10}
              className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors resize-y text-sm leading-relaxed" />
          </div>

          <div>
            <label className="text-neutral-500 text-xs mb-1.5 block">İçerik Resimleri (yazının altında görünür)</label>
            <div className="space-y-2">
              {contentImages.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input type="url" value={url} onChange={(e) => updateImage(i, e.target.value)} placeholder="https://..."
                    className="flex-1 bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 transition-colors text-sm" />
                  {contentImages.length > 1 && (
                    <button onClick={() => removeImageRow(i)} className="px-3 text-red-400 hover:text-red-300 text-lg leading-none">✕</button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addImageRow} className="mt-2 text-xs text-orange-500 hover:text-orange-400 transition-colors">+ Resim ekle</button>
          </div>

          <div className="flex gap-3">
            <button onClick={() => savePost(true)} disabled={saving || !title.trim()}
              className="flex-1 py-3 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 transition-colors font-medium text-sm">
              {saving ? "..." : "Taslak Kaydet"}
            </button>
            <button onClick={() => savePost(false)} disabled={saving || !title.trim()}
              className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-40 text-black font-bold transition-colors text-sm">
              {saving ? "..." : "Yayınla"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-neutral-400 text-sm">{posts.length} yazı</p>
        <button onClick={startNew}
          className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm px-4 py-2 rounded-xl transition-colors">
          + Yeni Yazı
        </button>
      </div>
      {posts.length === 0 && (
        <p className="text-neutral-600 text-center py-12">Henüz yazı yok.</p>
      )}
      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${p.draft ? "bg-neutral-700 text-neutral-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                  {p.draft ? "Taslak" : "Yayında"}
                </span>
                <span className="text-neutral-600 text-xs">{new Date(p.publishedAt).toLocaleDateString("tr-TR")}</span>
              </div>
              <p className="text-white font-medium text-sm truncate">{p.title}</p>
              <p className="text-neutral-500 text-xs mt-1 line-clamp-1">{p.excerpt}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => toggleDraft(p)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${p.draft ? "border-emerald-700 text-emerald-400 hover:bg-emerald-500/10" : "border-neutral-700 text-neutral-400 hover:bg-neutral-800"}`}>
                {p.draft ? "Yayınla" : "Taslağa al"}
              </button>
              <button onClick={() => startEdit(p)}
                className="text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:bg-neutral-800 transition-colors">
                Düzenle
              </button>
              <button onClick={() => deletePost(p.id)}
                className="text-xs px-3 py-1.5 rounded-lg border border-red-800/60 text-red-400 hover:bg-red-500/10 transition-colors">
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function HeroEditor({ token }) {
  const [form, setForm] = useState({ baslik: "", alt: "", cta: "" });
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    apiFetch("/api/admin/hero", token)
      .then((r) => r.json())
      .then((d) => { if (d.baslik) setForm({ baslik: "", alt: "", cta: "", ...d }); })
      .catch(() => {});
  }, [token]);

  const set = (field, val) => { setForm((f) => ({ ...f, [field]: val })); setStatus("idle"); };

  const save = async () => {
    setStatus("saving");
    const r = await apiFetch("/api/admin/hero", token, { method: "PUT", body: JSON.stringify(form) });
    setStatus(r.ok ? "saved" : "error");
    if (r.ok) setTimeout(() => setStatus("idle"), 2500);
  };

  const inputCls = "w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 transition-colors text-sm";

  return (
    <div className="space-y-4">
      <div>
        <label className="text-neutral-500 text-xs mb-1.5 block">Ana başlık</label>
        <textarea rows={3} value={form.baslik} onChange={(e) => set("baslik", e.target.value)}
          className={`${inputCls} resize-none leading-relaxed`} />
      </div>
      <div>
        <label className="text-neutral-500 text-xs mb-1.5 block">Alt yazı (solda kalan kısım)</label>
        <input value={form.alt} onChange={(e) => set("alt", e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className="text-neutral-500 text-xs mb-1.5 block">CTA metni (turuncu kısım)</label>
        <input value={form.cta} onChange={(e) => set("cta", e.target.value)} className={inputCls} />
      </div>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-xs text-neutral-500">
        Önizleme: <span className="text-neutral-300">{form.alt || "Yarın değil,"} </span>
        <span className="text-orange-500">{form.cta || "BUGÜN BAŞLA!"}</span>
      </div>
      <button type="button" onClick={save} disabled={status === "saving"}
        className={`w-full font-bold py-3.5 rounded-xl transition-all ${
          status === "saved" ? "bg-green-600 text-white"
          : status === "error" ? "bg-red-600 text-white"
          : "bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black"
        }`}>
        {status === "saving" ? "Kaydediliyor..." : status === "saved" ? "✓ Kaydedildi" : status === "error" ? "Hata, tekrar dene" : "Kaydet"}
      </button>
    </div>
  );
}


function HizmetlerEditor({ token }) {
  const [liste, setListe] = useState([]);
  const [acik, setAcik] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    apiFetch("/api/admin/hizmetler", token)
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.hizmetler)) setListe(d.hizmetler); })
      .catch(() => {});
  }, [token]);

  const set = (i, field, val) => {
    setListe((prev) => { const n = [...prev]; n[i] = { ...n[i], [field]: val }; return n; });
    setStatus("idle");
  };

  const add = () => {
    setListe((prev) => [...prev, { icon: "⭐", title: "Yeni Hizmet", description: "" }]);
    setAcik(liste.length);
    setStatus("idle");
  };

  const remove = (i) => {
    if (!confirm("Bu hizmeti silmek istiyor musun?")) return;
    setListe((prev) => prev.filter((_, idx) => idx !== i));
    setAcik(null);
    setStatus("idle");
  };

  const save = async () => {
    setStatus("saving");
    const r = await apiFetch("/api/admin/hizmetler", token, { method: "PUT", body: JSON.stringify({ hizmetler: liste }) });
    setStatus(r.ok ? "saved" : "error");
    if (r.ok) setTimeout(() => setStatus("idle"), 2500);
  };

  const inputCls = "w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 transition-colors text-sm";

  return (
    <div className="space-y-3">
      {liste.map((h, i) => (
        <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <button type="button" onClick={() => setAcik(acik === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-neutral-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center flex-shrink-0">{h.icon}</span>
              <span className="text-white text-sm font-medium">{h.title}</span>
            </div>
            <span className="text-neutral-500 text-xs">{acik === i ? "▲" : "▼"}</span>
          </button>

          {acik === i && (
            <div className="px-5 pb-5 space-y-3 border-t border-neutral-800 pt-4">
              <div className="flex gap-3">
                <div className="w-20">
                  <label className="text-neutral-500 text-xs mb-1.5 block">İkon</label>
                  <input value={h.icon} onChange={(e) => set(i, "icon", e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-3 py-2.5 text-center text-xl focus:outline-none focus:border-orange-500 transition-colors" />
                </div>
                <div className="flex-1">
                  <label className="text-neutral-500 text-xs mb-1.5 block">Başlık</label>
                  <input value={h.title} onChange={(e) => set(i, "title", e.target.value)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-neutral-500 text-xs mb-1.5 block">Açıklama</label>
                <textarea rows={3} value={h.description} onChange={(e) => set(i, "description", e.target.value)}
                  className={`${inputCls} resize-none leading-relaxed`} />
              </div>
              <button type="button" onClick={() => remove(i)}
                className="text-xs text-red-500 hover:text-red-400 transition-colors">Bu hizmeti sil</button>
            </div>
          )}
        </div>
      ))}

      <button type="button" onClick={add}
        className="w-full py-3 rounded-xl border border-dashed border-neutral-700 text-neutral-400 hover:border-orange-500 hover:text-orange-400 text-sm transition-colors">
        + Yeni Hizmet Ekle
      </button>

      <button type="button" onClick={save} disabled={status === "saving"}
        className={`w-full font-bold py-3.5 rounded-xl transition-all ${
          status === "saved" ? "bg-green-600 text-white"
          : status === "error" ? "bg-red-600 text-white"
          : "bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black"
        }`}>
        {status === "saving" ? "Kaydediliyor..." : status === "saved" ? "✓ Kaydedildi" : status === "error" ? "Hata, tekrar dene" : "Tüm Hizmetleri Kaydet"}
      </button>
    </div>
  );
}


function HakkimdaEditor({ token }) {
  const [intro, setIntro] = useState("");
  const [paragraflar, setParagraflar] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    apiFetch("/api/admin/hakkimda", token)
      .then((r) => r.json())
      .then((d) => {
        setIntro(d.intro || "");
        setParagraflar(d.paragraflar || []);
      })
      .catch(() => {});
  }, [token]);

  const setParagraf = (i, val) => {
    setParagraflar((prev) => { const n = [...prev]; n[i] = val; return n; });
    setStatus("idle");
  };

  const addParagraf = () => { setParagraflar((p) => [...p, ""]); };
  const removeParagraf = (i) => { setParagraflar((p) => p.filter((_, idx) => idx !== i)); setStatus("idle"); };

  const save = async () => {
    setStatus("saving");
    const r = await apiFetch("/api/admin/hakkimda", token, {
      method: "PUT",
      body: JSON.stringify({ intro, paragraflar }),
    });
    setStatus(r.ok ? "saved" : "error");
    if (r.ok) setTimeout(() => setStatus("idle"), 2500);
  };

  const areaCls = "w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors text-sm leading-relaxed resize-none";

  return (
    <div className="space-y-5">
      <div>
        <label className="text-neutral-500 text-xs mb-1.5 block">Giriş cümlesi</label>
        <textarea rows={3} value={intro} onChange={(e) => { setIntro(e.target.value); setStatus("idle"); }}
          className={areaCls} />
      </div>

      <div>
        <label className="text-neutral-500 text-xs mb-2 block">Paragraflar</label>
        <div className="space-y-3">
          {paragraflar.map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <textarea value={p} onChange={(e) => setParagraf(i, e.target.value)}
                className={`flex-1 ${areaCls}`}
                style={{ height: "96px", resize: "none", overflowY: "auto" }} />
              <button type="button" onClick={() => removeParagraf(i)}
                className="text-red-400 hover:text-red-300 text-lg leading-none mt-3 flex-shrink-0">✕</button>
            </div>
          ))}
        </div>
      </div>

      <button type="button" onClick={save} disabled={status === "saving"}
        className={`w-full font-bold py-3.5 rounded-xl transition-all ${
          status === "saved" ? "bg-green-600 text-white"
          : status === "error" ? "bg-red-600 text-white"
          : "bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black"
        }`}>
        {status === "saving" ? "Kaydediliyor..." : status === "saved" ? "✓ Kaydedildi" : status === "error" ? "Hata, tekrar dene" : "Kaydet"}
      </button>
    </div>
  );
}


const VERGI_URL = "/vergi-levhasi.png";

function IletisimEditor({ token }) {
  const [form, setForm] = useState({ telefon: "", email: "", konum: "", instagram: "", vergiLevhasi: VERGI_URL });
  const [status, setStatus] = useState("idle");
  const [vergiStatus, setVergiStatus] = useState("idle");

  useEffect(() => {
    apiFetch("/api/admin/iletisim", token)
      .then((r) => r.json())
      .then((d) => { if (d.telefon) setForm({ telefon: "", email: "", konum: "", instagram: "", vergiLevhasi: VERGI_URL, ...d }); })
      .catch(() => {});
  }, [token]);

  const set = (field, val) => { setForm((f) => ({ ...f, [field]: val })); setStatus("idle"); };

  const toggleVergi = async () => {
    const newVal = form.vergiLevhasi ? "" : VERGI_URL;
    const newForm = { ...form, vergiLevhasi: newVal };
    setForm(newForm);
    setVergiStatus("saving");
    const r = await apiFetch("/api/admin/iletisim", token, { method: "PUT", body: JSON.stringify(newForm) });
    setVergiStatus(r.ok ? "saved" : "error");
    setTimeout(() => setVergiStatus("idle"), 2000);
  };

  const save = async () => {
    setStatus("saving");
    const r = await apiFetch("/api/admin/iletisim", token, { method: "PUT", body: JSON.stringify(form) });
    setStatus(r.ok ? "saved" : "error");
    if (r.ok) setTimeout(() => setStatus("idle"), 2500);
  };

  const inputCls = "w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 transition-colors text-sm";
  const vergiAcik = !!form.vergiLevhasi;

  return (
    <div className="space-y-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest mb-5">Vergi Levhası</p>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-white font-medium text-sm">Footer'da göster</p>
            <p className="text-neutral-500 text-xs mt-1">Açınca © yılının yanında "Vergi Levhası" linki çıkar.</p>
          </div>
          <button onClick={toggleVergi} aria-pressed={vergiAcik}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${vergiAcik ? "bg-orange-500" : "bg-neutral-700"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${vergiAcik ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
        {vergiStatus === "saved"  && <p className="text-green-400 text-xs mt-3">✓ Kaydedildi</p>}
        {vergiStatus === "error"  && <p className="text-red-400 text-xs mt-3">Hata oluştu</p>}
        {vergiStatus === "saving" && <p className="text-neutral-500 text-xs mt-3">Kaydediliyor...</p>}
      </div>

      <div>
        <label className="text-neutral-500 text-xs mb-1.5 block">Telefon — header ve iletişim bölümünde kullanılır (başında + olmadan, örn: 905334409803)</label>
        <input value={form.telefon} onChange={(e) => set("telefon", e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className="text-neutral-500 text-xs mb-1.5 block">E-posta</label>
        <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className="text-neutral-500 text-xs mb-1.5 block">Konum metni</label>
        <input value={form.konum} onChange={(e) => set("konum", e.target.value)} placeholder="Altıeylül, BALIKESİR" className={inputCls} />
      </div>
      <div>
        <label className="text-neutral-500 text-xs mb-1.5 block">Instagram URL</label>
        <input type="url" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="https://www.instagram.com/..." className={inputCls} />
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-xs text-neutral-500">
        Harita embed kodu değiştirmek için kod tabanına ulaşın → <code className="text-neutral-400">Iletisim.jsx</code>
      </div>

      <button type="button" onClick={save} disabled={status === "saving"}
        className={`w-full font-bold py-3.5 rounded-xl transition-all ${
          status === "saved" ? "bg-green-600 text-white"
          : status === "error" ? "bg-red-600 text-white"
          : "bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black"
        }`}>
        {status === "saving" ? "Kaydediliyor..." : status === "saved" ? "✓ Kaydedildi" : status === "error" ? "Hata, tekrar dene" : "Kaydet"}
      </button>
    </div>
  );
}


export default function AdminPanel() {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [page, setPage] = useState("dashboard");

  const handleLogin = (t) => {
    setToken(t);
    localStorage.setItem("admin_token", t);
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("admin_token");
    setPage("dashboard");
  };

  if (!token) return <LoginScreen onLogin={handleLogin} />;

  const PAGE_LABELS = { dashboard: "Panel", prices: "Fiyatlar", schedule: "Haftalık Program", reviews: "Yorum Akışı", blog: "Blog", hakkimda: "Hakkımda", iletisim: "İletişim", hero: "Hero Yazısı", hizmetler: "Hizmetler" };

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {page !== "dashboard" && (
              <button onClick={() => setPage("dashboard")}
                className="text-neutral-500 hover:text-white transition-colors text-sm px-2 py-1 border border-neutral-800 hover:border-neutral-600 rounded-lg">
                ← Geri
              </button>
            )}
            <div>
              <p className="text-orange-500 text-xs font-black tracking-[0.25em] uppercase">İnanç Coaching</p>
              <h1 className="text-white font-bold text-xl">{PAGE_LABELS[page] || page}</h1>
            </div>
          </div>
          <button onClick={logout}
            className="text-neutral-500 hover:text-white text-sm transition-colors px-3 py-1.5 border border-neutral-800 hover:border-neutral-600 rounded-lg">
            Çıkış
          </button>
        </div>

        {page === "dashboard" && <><AnalyticsBar token={token} /><Dashboard onNavigate={setPage} /></>}
        {page === "prices"    && <PricesEditor token={token} />}
        {page === "schedule"  && <ScheduleEditor token={token} />}
        {page === "reviews"   && <ReviewsSettings token={token} />}
        {page === "blog"      && <BlogEditor token={token} />}
        {page === "hakkimda"  && <HakkimdaEditor token={token} />}
        {page === "iletisim"  && <IletisimEditor token={token} />}
        {page === "hero"      && <HeroEditor token={token} />}
        {page === "hizmetler" && <HizmetlerEditor token={token} />}
      </div>
    </div>
  );
}
