import { useState, useEffect } from "react";

// ─── Sabitler ────────────────────────────────────────────────────────────────
const GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const SAATLER = [
  "07:00","08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00",
];
const PAKET_LABELS = { uzaktan: "Uzaktan Eğitim", online: "Online Koçluk", birebir: "Birebir Koçluk" };
const SURE_SEC = [{ value: "ay", label: "/ ay" }, { value: "seans", label: "/ seans" }, { value: "program", label: "/ program" }];

// Slot döngüsü: kapali → bos → dolu → kapali
const CYCLE = { kapali: "bos", bos: "dolu", dolu: "kapali" };
const SLOT_STYLE = {
  bos:    { bg: "bg-emerald-500/20 hover:bg-emerald-500/40 border-emerald-500/40 text-emerald-400", label: "Müsait" },
  dolu:   { bg: "bg-red-500/20 hover:bg-red-500/40 border-red-500/40 text-red-400",               label: "Dolu"   },
  kapali: { bg: "bg-neutral-800/60 hover:bg-neutral-700/60 border-neutral-700/40 text-neutral-600", label: ""     },
};

// ─── API yardımcıları ─────────────────────────────────────────────────────────
async function apiFetch(path, token, opts = {}) {
  return fetch(path, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
  });
}

// ─── Login ────────────────────────────────────────────────────────────────────
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

// ─── Dashboard menü ───────────────────────────────────────────────────────────
const MENU_ITEMS = [
  { key: "prices",   icon: "💰", label: "Fiyatlar",      desc: "Paket fiyatlarını düzenle"          },
  { key: "schedule", icon: "📅", label: "Haftalık Program", desc: "Müsait / dolu saatleri ayarla"   },
  { key: "reviews",  icon: "⭐", label: "Yorum Akışı",   desc: "Google yorumlarını aç / kapat", soon: true },
  { key: "blog",     icon: "✍️", label: "Blog",          desc: "Yazı yaz ve yayınla",          soon: true },
];

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
            <span className="text-2xl mb-3 block">{item.icon}</span>
            <p className="text-white font-semibold text-sm mb-1">{item.label}</p>
            <p className="text-neutral-500 text-xs">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Fiyat editörü ────────────────────────────────────────────────────────────
function PricesEditor({ token }) {
  const [prices, setPrices] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    apiFetch("/api/admin/prices", token)
      .then((r) => r.json())
      .then((d) => { if (d.paketler) setPrices(d.paketler); })
      .catch(() => {});
  }, [token]);

  const update = (i, field, val) => {
    setPrices((p) => { const n = [...p]; n[i] = { ...n[i], [field]: val }; return n; });
    setStatus("idle");
  };

  const save = async (e) => {
    e.preventDefault();
    setStatus("saving");
    const r = await apiFetch("/api/admin/prices", token, { method: "PUT", body: JSON.stringify({ paketler: prices }) });
    setStatus(r.ok ? "saved" : "error");
    if (r.ok) setTimeout(() => setStatus("idle"), 2500);
  };

  return (
    <form onSubmit={save} className="space-y-4">
      {prices.map((p, i) => (
        <div key={p.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest mb-4">
            {PAKET_LABELS[p.id] || p.id}
          </p>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-neutral-500 text-xs mb-1.5 block">Fiyat (₺)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">₺</span>
                <input type="text" value={p.fiyat} onChange={(e) => update(i, "fiyat", e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl pl-8 pr-4 py-2.5 focus:outline-none focus:border-orange-500 transition-colors" />
              </div>
            </div>
            <div className="w-32">
              <label className="text-neutral-500 text-xs mb-1.5 block">Periyot</label>
              <select value={p.sure} onChange={(e) => update(i, "sure", e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-500 transition-colors">
                {SURE_SEC.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-800 flex items-baseline gap-1">
            <span className="text-neutral-500 text-xs">Önizleme:</span>
            <span className="text-white font-black text-lg ml-1">₺{p.fiyat}</span>
            <span className="text-neutral-400 text-xs">/ {p.sure}</span>
          </div>
        </div>
      ))}
      {prices.length === 0 && <p className="text-neutral-600 text-center py-8">Yükleniyor...</p>}
      <button type="submit" disabled={status === "saving" || prices.length === 0}
        className={`w-full font-bold py-3.5 rounded-xl transition-all ${
          status === "saved" ? "bg-green-600 text-white"
          : status === "error" ? "bg-red-600 text-white"
          : "bg-orange-500 hover:bg-orange-400 disabled:bg-neutral-700 disabled:text-neutral-500 text-black"
        }`}>
        {status === "saving" ? "Kaydediliyor..." : status === "saved" ? "✓ Kaydedildi" : status === "error" ? "Hata, tekrar dene" : "Fiyatları Kaydet"}
      </button>
    </form>
  );
}

// ─── Program editörü ──────────────────────────────────────────────────────────
function ScheduleEditor({ token }) {
  const [slots, setSlots] = useState({});
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    apiFetch("/api/admin/schedule", token)
      .then((r) => r.json())
      .then((d) => { if (d.slots) setSlots(d.slots); })
      .catch(() => {});
  }, [token]);

  const getSlot = (gun, saat) => slots[gun]?.[saat] || "kapali";

  const toggle = (gun, saat) => {
    setSlots((prev) => ({
      ...prev,
      [gun]: { ...(prev[gun] || {}), [saat]: CYCLE[getSlot(gun, saat)] },
    }));
    setStatus("idle");
  };

  const save = async () => {
    setStatus("saving");
    const r = await apiFetch("/api/admin/schedule", token, { method: "PUT", body: JSON.stringify({ slots }) });
    setStatus(r.ok ? "saved" : "error");
    if (r.ok) setTimeout(() => setStatus("idle"), 2500);
  };

  // Tüm günü veya saati toplu ayarla
  const fillGun = (gun, durum) => {
    setSlots((prev) => ({
      ...prev,
      [gun]: Object.fromEntries(SAATLER.map((s) => [s, durum])),
    }));
    setStatus("idle");
  };

  return (
    <div>
      {/* Açıklama */}
      <div className="flex flex-wrap gap-3 mb-5">
        {Object.entries(SLOT_STYLE).map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded border ${v.bg}`} />
            <span className="text-neutral-400 text-xs">{k === "kapali" ? "Kapalı" : v.label}</span>
          </div>
        ))}
        <span className="text-neutral-600 text-xs ml-2">· Hücreye tıkla → durum değişir</span>
      </div>

      {/* Grid — yatay kaydırmalı */}
      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="bg-neutral-900 text-neutral-500 font-medium px-3 py-2.5 text-left w-16 border-b border-r border-neutral-800">
                Saat
              </th>
              {GUNLER.map((gun) => (
                <th key={gun} className="bg-neutral-900 border-b border-r border-neutral-800 last:border-r-0 px-1 py-2">
                  <div className="text-neutral-300 font-semibold mb-1.5">{gun.slice(0, 3)}</div>
                  <div className="flex gap-1 justify-center">
                    <button onClick={() => fillGun(gun, "bos")} title="Tümü müsait"
                      className="w-5 h-5 rounded bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 text-[9px] transition-colors">✓</button>
                    <button onClick={() => fillGun(gun, "dolu")} title="Tümü dolu"
                      className="w-5 h-5 rounded bg-red-500/20 hover:bg-red-500/40 text-red-400 text-[9px] transition-colors">✗</button>
                    <button onClick={() => fillGun(gun, "kapali")} title="Tümü kapalı"
                      className="w-5 h-5 rounded bg-neutral-700/60 hover:bg-neutral-600/60 text-neutral-500 text-[9px] transition-colors">—</button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAATLER.map((saat) => (
              <tr key={saat} className="group">
                <td className="bg-neutral-900/50 text-neutral-500 font-mono px-3 py-1.5 border-b border-r border-neutral-800 whitespace-nowrap">
                  {saat}
                </td>
                {GUNLER.map((gun) => {
                  const durum = getSlot(gun, saat);
                  const s = SLOT_STYLE[durum];
                  return (
                    <td key={gun} className="border-b border-r border-neutral-800 last:border-r-0 p-1">
                      <button
                        onClick={() => toggle(gun, saat)}
                        title={`${gun} ${saat} — ${durum}`}
                        className={`w-full h-7 rounded border transition-all duration-150 text-[9px] font-medium ${s.bg}`}
                      >
                        {s.label}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kaydet */}
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

// ─── Ana admin paneli ─────────────────────────────────────────────────────────
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

  const PAGE_LABELS = { dashboard: "Panel", prices: "Fiyatlar", schedule: "Haftalık Program" };

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

        {/* İçerik */}
        {page === "dashboard" && <Dashboard onNavigate={setPage} />}
        {page === "prices"    && <PricesEditor token={token} />}
        {page === "schedule"  && <ScheduleEditor token={token} />}
      </div>
    </div>
  );
}
