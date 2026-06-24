import { useState, useEffect } from "react";

const GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const SAATLER = [
  "07:00","08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00",
];
const PAKET_LABELS = { uzaktan: "Uzaktan Eğitim", online: "Online Koçluk", birebir: "Birebir Koçluk" };
const SURE_SEC = [{ value: "ay", label: "/ ay" }, { value: "seans", label: "/ seans" }, { value: "program", label: "/ program" }];

// kapali → bos → dolu → kapali
const CYCLE = { kapali: "bos", bos: "dolu", dolu: "kapali" };
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
          <p className="text-white font-medium text-sm">Yorum akışını göster</p>
          <p className="text-neutral-500 text-xs mt-1">Kapatırsan sitede yorum bölümü gözükmez.</p>
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

  const PAGE_LABELS = { dashboard: "Panel", prices: "Fiyatlar", schedule: "Haftalık Program", reviews: "Yorum Akışı", blog: "Blog" };

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

        {page === "dashboard" && <Dashboard onNavigate={setPage} />}
        {page === "prices"    && <PricesEditor token={token} />}
        {page === "schedule"  && <ScheduleEditor token={token} />}
        {page === "reviews"   && <ReviewsSettings token={token} />}
        {page === "blog"      && <BlogEditor token={token} />}
      </div>
    </div>
  );
}
