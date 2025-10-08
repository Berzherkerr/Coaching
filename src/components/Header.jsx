// src/components/Header.jsx
import { useEffect, useRef, useState } from "react";

function PhoneIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M2.5 5.5c0-1.1.9-2 2-2h2.1c.9 0 1.7.6 1.9 1.5l.6 2.4c.2.8-.1 1.6-.7 2.2l-1 1c1.6 3.1 4.1 5.6 7.2 7.2l1-1c.6-.6 1.4-.8 2.2-.7l2.4.6c.9.2 1.5 1 1.5 1.9V19.5c0 1.1-.9 2-2 2h-1C9.6 21.5 2.5 14.4 2.5 5.5v0z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Header() {
  const [isVisible, setIsVisible] = useState(true);

  const lastYRef = useRef(0);
  const rafRef = useRef(null);

  const SHOW_UP_THRESHOLD = 6;
  const HIDE_DOWN_THRESHOLD = 6;

  // SADECE BURAYI değiştiriyorum: label + href
  const menuItems = [
    { label: "Hakkımda", href: "#hakkimda" },
    { label: "Hizmetler", href: "#hizmetler" },
    { label: "İletişim",  href: "#contact" },
  ];

  // Yumuşak kaydırma — yapıyı bozmaz
  const handleNav = (href) => (e) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Logo tıklandığında en üste kaydır
  const handleLogoClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastYRef.current;

        if (y <= 12) {
          setIsVisible(true);
        } else {
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
        pt-[env(safe-area-inset-top)]  /* iOS notch alanını da aynı saydamlıkla doldur */
      `}
      style={{
        // Eski Safari için fallback
        paddingTop:
          "env(safe-area-inset-top, 0px)",
      }}
    >
      {/* Safe-area üst doldurma (eski cihazlar için ekstra garanti) */}
      <span
        aria-hidden
        className="pointer-events-none block md:hidden absolute inset-x-0 top-0"
        style={{
          height: "env(safe-area-inset-top, 0px)",
          background: "rgba(10,10,10,10)", // bg-neutral-950/70 eşdeğeri (tasarımı değiştirmeden üst boşluğu doldurur)
          WebkitBackdropFilter: "blur(4px)",
          backdropFilter: "blur(4px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
        {/* Masaüstü */}
        <div className="hidden md:flex items-center py-[0.64rem] relative">
          {/* Logo (sol) */}
          <a
            href="#top"
            onClick={handleLogoClick}
            className="flex items-center pt-5 pl-4"
            aria-label="Sayfanın en üstüne dön"
            title="En üste dön"
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

        {/* Mobil: logo - menü (ortada) - telefon aynı satırda (ORİJİNAL) */}
        <div className="md:hidden relative flex items-center h-14">
          {/* Logo (sol) */}
          <a
            href="#top"
            onClick={handleLogoClick}
            className="flex items-center min-w-0"
            aria-label="Sayfanın en üstüne dön"
            title="En üste dön"
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
            href="tel:+90XXXXXXXXXX"
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
