import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.64-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.08-8.64A2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.81.31 1.6.57 2.35a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 7 7l.73-.73a2 2 0 0 1 2.11-.45c.75.26 1.54.45 2.35.57A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

const MENU_ITEMS = [
  { label: "Hakkımda",  href: "#hakkimda",  isPage: false },
  { label: "Hizmetler", href: "#hizmetler", isPage: false },
  { label: "Paketler",  href: "/fiyatlar",  isPage: true  },
];

function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [phone, setPhone] = useState("905334409803");
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    fetch("/api/iletisim")
      .then((r) => r.json())
      .then((d) => { if (d.telefon) setPhone(d.telefon); })
      .catch(() => {});
  }, []);

  const lastYRef = useRef(0);
  const rafRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const HIDE_DELAY_MS = 7000;

  const handleAnchor = (anchor) => (e) => {
    e.preventDefault();
    if (isHome) {
      const el = document.querySelector(anchor);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/" + anchor);
    }
  };

  const handleLogo = (e) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const clearHide = () => {
      if (hideTimeoutRef.current) { clearTimeout(hideTimeoutRef.current); hideTimeoutRef.current = null; }
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastYRef.current;

        if (y <= 12) {
          clearHide();
          if (!isVisible) setIsVisible(true);
        } else {
          if (dy < -6) { clearHide(); if (!isVisible) setIsVisible(true); }
          if (dy > 6 && !hideTimeoutRef.current) {
            hideTimeoutRef.current = setTimeout(() => {
              if (window.scrollY > 12) setIsVisible(false);
              hideTimeoutRef.current = null;
            }, HIDE_DELAY_MS);
          }
        }

        lastYRef.current = y;
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isVisible]);

  const renderItem = (item, idx, extraClass = "") => {
    const active = item.isPage && location.pathname === item.href;
    const cls = `transition ${active ? "text-orange-400" : "text-neutral-200 hover:text-orange-400"} ${extraClass}`;
    if (item.isPage) {
      return <Link key={idx} to={item.href} className={cls}>{item.label}</Link>;
    }
    return (
      <a key={idx} href={item.href} onClick={handleAnchor(item.href)} className={cls}>
        {item.label}
      </a>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50
        transition-all duration-400 ease-[cubic-bezier(.22,1,.36,1)]
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none"}
        bg-neutral-950/70 backdrop-blur-sm
      `}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
        {/* Masaüstü */}
        <div className="hidden md:flex items-center py-[0.64rem] relative">
          <Link to="/" onClick={handleLogo} className="flex items-center pt-5 pl-4 z-10" aria-label="Ana sayfa">
            <img src="/ardalogo.svg" alt="İnanç Hoca Logo" className="h-12 -ml-8 w-auto scale-[6] origin-left filter invert brightness-0" />
          </Link>

          <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8 whitespace-nowrap text-sm font-medium">
            {MENU_ITEMS.map((item, idx) => renderItem(item, idx))}
          </nav>

          <a href={`tel:+${phone}`} className="ml-auto flex items-center gap-2 text-orange-500 hover:text-orange-400 transition text-sm font-semibold">
            <PhoneIcon className="h-4 w-4" />
            <span>Bana Ulaşın</span>
          </a>
        </div>

        {/* Mobil */}
        <div className="md:hidden flex flex-col">
          <div className="relative flex items-center h-14">
            <Link to="/" onClick={handleLogo} className="flex items-center min-w-0 z-10" aria-label="Ana sayfa">
              <img src="/ardalogo.svg" alt="İnanç Hoca Logo" className="h-15 -mb-2.5 -ml-1 w-auto filter invert brightness-0" />
            </Link>

            <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-5 text-[13px] font-bold whitespace-nowrap">
              {MENU_ITEMS.map((item, idx) => renderItem(item, idx))}
            </nav>

            <a href={`tel:+${phone}`} className="ml-auto flex items-center text-orange-500 hover:text-orange-400 transition" aria-label="Ara">
              <PhoneIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
