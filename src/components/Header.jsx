// src/components/Header.jsx
import { useEffect, useRef, useState } from "react";

/** Pixel-perfect telefon ikonu (24px grid, net stroke) */
function PhoneIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
      aria-hidden
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      shapeRendering="geometricPrecision"
      focusable="false"
    >
      {/* Kaynak: lucide phone çizgisel ikonun grid’e oturtulmuş versiyonu */}
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.64-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.08-8.64A2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.81.31 1.6.57 2.35a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 7 7l.73-.73a2 2 0 0 1 2.11-.45c.75.26 1.54.45 2.35.57A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function Header() {
  const [isVisible, setIsVisible] = useState(true);

  const lastYRef = useRef(0);
  const rafRef = useRef(null);

  const SHOW_UP_THRESHOLD = 6;
  const HIDE_DOWN_THRESHOLD = 6;

  // Menü
  const menuItems = [
    { label: "Hakkımda", href: "#hakkimda" },
    { label: "Hizmetler", href: "#hizmetler" },
    { label: "İletişim", href: "#contact" },
  ];

  // Menüdekiyle aynı davranış + fallback: hedef yoksa en üste kaydır
  const handleNav = (href) => (e) => {
    e.preventDefault();
    const el =
      document.querySelector(href) ||
      (href === "#hero" ? document.querySelector('[data-hero="true"]') : null);

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastYRef.current;

        if (y <= 12) setIsVisible(true);
        else {
          if (dy < -SHOW_UP_THRESHOLD) setIsVisible(true);
          if (dy > HIDE_DOWN_THRESHOLD) setIsVisible(false);
        }

        lastYRef.current = y;
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50
        transition-all duration-400 ease-[cubic-bezier(.22,1,.36,1)]
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-0 pointer-events-none"}
        bg-neutral-950/70 backdrop-blur-sm
        shadow-[0_8px_24px_rgba(0,0,0,0)]
      `}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
        {/* Masaüstü */}
        <div className="hidden md:flex items-center py-[0.64rem] relative">
          {/* Logo (sol) — MENÜYLE AYNI KAYDIRMA: #hero varsa ona, yoksa en üste */}
          <a
            href="#hero"
            onClick={handleNav("#hero")}
            className="flex items-center pt-5 pl-4 z-10"
            aria-label="Hero bölümüne dön"
            title="Hero"
          >
            <img
              src="/ardalogo.svg"
              alt="İnanç Hoca Logo"
              className="h-12 -ml-8 w-auto scale-[6] origin-left filter invert brightness-0"
            />
          </a>

          {/* Menü (ortada mutlak merkezli) */}
          <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 whitespace-nowrap">
            {menuItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={handleNav(item.href)}
                className="text-sm font-medium text-neutral-200 hover:text-orange-400 transition"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Sağda sadece yazı linki */}
          <a
            href="tel:+905334409803"
            className="ml-auto flex items-center gap-2 text-orange-500 hover:text-orange-400 transition text-sm font-semibold"
          >
            <PhoneIcon className="h-4 w-4" />
            <span>Bana Ulaşın</span>
          </a>
        </div>

        {/* Mobil: logo - menü (ortada) - telefon aynı satırda */}
        <div className="md:hidden relative flex items-center h-14">
          {/* Logo (sol) — MENÜYLE AYNI KAYDIRMA */}
          <a
            href="#hero"
            onClick={handleNav("#hero")}
            className="flex items-center min-w-0 z-10"
            aria-label="Hero bölümüne dön"
            title="Hero"
          >
            <img
              src="/ardalogo.svg"
              alt="İnanç Hoca Logo"
              className="h-15 -mb-2.5 -ml-1 w-auto filter invert brightness-0"
            />
          </a>

          {/* Menü merkezde */}
          <nav
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4
                       text-[13px] font-medium text-neutral-200 whitespace-nowrap"
          >
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                onClick={handleNav(item.href)}
                className="hover:text-orange-400 transition"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Telefon (sağ) — sadece ikon */}
          <a
            href="tel:+905334409803"
            className="ml-auto flex items-center text-orange-500 hover:text-orange-400 transition"
            aria-label="Ara"
            title="Ara"
          >
            <PhoneIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
