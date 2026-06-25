import { useEffect, useState } from "react";

export default function WhatsAppModal() {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const handler = (e) => setUrl(e.detail.url);
    window.addEventListener("wa-confirm", handler);
    return () => window.removeEventListener("wa-confirm", handler);
  }, []);

  if (!url) return null;

  const confirm = () => {
    window.open(url, "_blank", "noopener,noreferrer");
    setUrl(null);
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={() => setUrl(null)}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-xs w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#25D366]/15 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]">
              <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.43 0 .06 5.37.06 11.99c0 2.11.55 4.16 1.6 5.97L0 24l6.2-1.63a12.02 12.02 0 0 0 5.86 1.49h.01c6.62 0 12-5.37 12-11.99 0-3.2-1.25-6.2-3.55-8.39z"/>
            </svg>
          </div>
          <p className="text-white font-semibold text-base">WhatsApp'a Geç</p>
        </div>
        <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
          WhatsApp uygulamasına yönlendirileceksiniz. Devam etmek istiyor musunuz?
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setUrl(null)}
            className="flex-1 py-2.5 rounded-xl border border-neutral-700 text-neutral-400 text-sm font-semibold hover:border-neutral-600 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={confirm}
            className="flex-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold transition-colors"
          >
            WhatsApp'a Git
          </button>
        </div>
      </div>
    </div>
  );
}
