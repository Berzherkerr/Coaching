import { useState, useEffect } from "react";

const PAKET_LABELS = {
  uzaktan: "Uzaktan Eğitim",
  online: "Online Koçluk",
  birebir: "Birebir Koçluk",
};

const SURE_SECENEKLERI = [
  { value: "ay", label: "/ ay" },
  { value: "seans", label: "/ seans" },
  { value: "program", label: "/ program" },
];

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [loginError, setLoginError] = useState("");
  const [prices, setPrices] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/prices", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) {
          logout();
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d?.paketler) setPrices(d.paketler);
      })
      .catch(() => {});
  }, [token]);

  const logout = () => {
    setToken("");
    localStorage.removeItem("admin_token");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const d = await r.json();
      if (d.token) {
        setToken(d.token);
        localStorage.setItem("admin_token", d.token);
        setPassword("");
      } else {
        setLoginError(d.error || "Giriş başarısız");
      }
    } catch {
      setLoginError("Sunucuya bağlanılamadı");
    }
  };

  const updatePrice = (i, field, value) => {
    setPrices((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
    setStatus("idle");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const r = await fetch("/api/admin/prices", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paketler: prices }),
      });
      if (r.ok) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2500);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 w-full max-w-sm shadow-2xl"
        >
          <div className="mb-6">
            <p className="text-orange-500 text-xs font-black tracking-[0.25em] uppercase mb-1">
              İnanç Coaching
            </p>
            <h1 className="text-white font-bold text-2xl">Admin Girişi</h1>
          </div>

          {loginError && (
            <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {loginError}
            </p>
          )}

          <label className="block text-neutral-400 text-xs mb-1.5">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-3 mb-5 focus:outline-none focus:border-orange-500 transition-colors"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 rounded-xl transition-colors"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-12">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-orange-500 text-xs font-black tracking-[0.25em] uppercase mb-0.5">
              İnanç Coaching
            </p>
            <h1 className="text-white font-bold text-2xl">Fiyat Yönetimi</h1>
          </div>
          <button
            onClick={logout}
            className="text-neutral-500 hover:text-white text-sm transition-colors px-3 py-1.5 border border-neutral-800 hover:border-neutral-600 rounded-lg"
          >
            Çıkış
          </button>
        </div>

        {/* Price cards */}
        <form onSubmit={handleSave} className="space-y-4">
          {prices.map((p, i) => (
            <div
              key={p.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5"
            >
              <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest mb-4">
                {PAKET_LABELS[p.id] || p.id}
              </p>

              <div className="flex gap-3">
                {/* Fiyat */}
                <div className="flex-1">
                  <label className="text-neutral-500 text-xs mb-1.5 block">
                    Fiyat (₺)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium">
                      ₺
                    </span>
                    <input
                      type="text"
                      value={p.fiyat}
                      onChange={(e) => updatePrice(i, "fiyat", e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl pl-8 pr-4 py-2.5 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Periyot */}
                <div className="w-32">
                  <label className="text-neutral-500 text-xs mb-1.5 block">
                    Periyot
                  </label>
                  <select
                    value={p.sure}
                    onChange={(e) => updatePrice(i, "sure", e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    {SURE_SECENEKLERI.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Önizleme */}
              <div className="mt-3 pt-3 border-t border-neutral-800 flex items-baseline gap-1">
                <span className="text-neutral-500 text-xs">Görünüm:</span>
                <span className="text-white font-black text-lg ml-1">
                  ₺{p.fiyat}
                </span>
                <span className="text-neutral-400 text-xs">/ {p.sure}</span>
              </div>
            </div>
          ))}

          {prices.length === 0 && (
            <p className="text-neutral-600 text-center py-8">Yükleniyor...</p>
          )}

          <button
            type="submit"
            disabled={status === "saving" || prices.length === 0}
            className={`w-full font-bold py-3.5 rounded-xl transition-all ${
              status === "saved"
                ? "bg-green-600 text-white"
                : status === "error"
                ? "bg-red-600 text-white"
                : "bg-orange-500 hover:bg-orange-400 disabled:bg-neutral-700 disabled:text-neutral-500 text-black"
            }`}
          >
            {status === "saving"
              ? "Kaydediliyor..."
              : status === "saved"
              ? "✓ Kaydedildi"
              : status === "error"
              ? "Hata oluştu, tekrar dene"
              : "Fiyatları Kaydet"}
          </button>

          <p className="text-neutral-600 text-xs text-center">
            Değişiklikler site ziyaretçilerine anında yansır.
          </p>
        </form>
      </div>
    </div>
  );
}
