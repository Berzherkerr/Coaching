import React from "react";

export default function Hero() {
  const handleCta = (e) => {
    e.preventDefault();
    const el = document.querySelector("#fiyatlar");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen flex items-end justify-center overflow-hidden bg-[rgb(10,10,10)]"
    >
      {/* Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/herovido.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Genel koyulaştırma overlay (biraz düşürdüm) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* ALT FADE – daha uzun, daha küçük adımlı, daha yumuşak */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 sm:h-1000"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(10,10,10,0.00) 0%,
              rgba(10,10,10,0.06) 25%,
              rgba(10,10,10,0.16) 45%,
              rgba(10,10,10,0.32) 65%,
              rgba(10,10,10,0.55) 82%,
              rgba(10,10,10,0.70) 92%,
              rgba(10,10,10,0.90) 98%,
              rgb(10,10,10) 100%
            )
          `,
        }}
      />

      {/* içerik */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pb-16 mb-90 md:pb-24 text-center text-white">
        <h1 className="font-extrabold uppercase tracking-tight leading-[0.95] text-2xl sm:text-4xl md:text-6xl lg:text-5xl drop-shadow-lg font-[var(--hero-condensed,theme(fontFamily.sans))]">
          Kendİne yaptığın en İyİ yatırım, bedenİnle başlar.
        </h1>
        <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-2xl font-medium drop-shadow-md max-w-2xl mx-auto">
          Yarın değil,&nbsp;
          <a
            href="#fiyatlar"
            onClick={handleCta}
            className="align-baseline text-orange-500 hover:underline focus:underline outline-none"
          >
            BUGÜN BAŞLA!
          </a>
        </p>
      </div>
    </section>
  );
}
