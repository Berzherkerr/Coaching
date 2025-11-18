import { useEffect, useRef, useState } from "react";

const images = ["/12345.jpeg", "/123456.jpeg", "/arda2.png"];

export default function Hakkimda() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  // Otomatik slayt
  useEffect(() => {
    startAuto();
    return stopAuto;
  }, []);

  const startAuto = () => {
    stopAuto();
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
  };

  const stopAuto = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const goTo = (i) => setIndex(i);

  // Mobil dokunma kaydırma desteği
  const touch = useRef({ x: 0 });
  const onTouchStart = (e) => {
    stopAuto();
    touch.current.x = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.current.x;
    if (Math.abs(dx) > 40) {
      setIndex((i) =>
        dx > 0 ? (i - 1 + images.length) % images.length : (i + 1) % images.length
      );
    }
    startAuto();
  };

  return (
    <section
      id="hakkimda" 
      className="relative bg-neutral-950 py-16 sm:py-20 px-4 sm:px-8 lg:px-20"
    >
      {/* HERO → HAKKIMDA GEÇİŞİ) */}
      <div className="pointer-events-none absolute inset-x-0 -top-16 h-16 bg-gradient-to-t from-neutral-950 to-transparent" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* SLAYT */}
        <div
          className="relative w-full h-[260px] sm:h-[340px] lg:h-[380px] rounded-2xl overflow-hidden shadow-xl
                     bg-neutral-900 border border-neutral-800 select-none"
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-label="Arda İnanç Kurt görsel slaytı"
        >
          {/* Resimler */}
          <div
            className="absolute inset-0 flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Arda İnanç Kurt ${i + 1}`}
                className="w-full h-full object-cover flex-shrink-0"
                draggable={false}
              />
            ))}
          </div>

          
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-neutral-950/20 via-transparent to-transparent" />

          {/* Noktalar */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition
                  ${index === i ? "bg-white" : "bg-white/40 hover:bg-white/70"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* METİN  */}
        <div className="relative text-center">
          {/* Vurgu satırı */}
          <p className="mt-3 text-base sm:text-lg text-neutral-300 leading-relaxed text-center">
            Merhaba, ben <strong className="text-neutral-100">Arda İnanç Kurt</strong>. Marmara Üniversitesi
            Antrenörlük Bölümü mezunuyum. Balıkesir'de Personal Trainer olarak hizmet veriyorum.
          </p>

          {/* Metin blokları */}
          <div className="mt-3 space-y-3 text-base sm:text-lg text-neutral-300 leading-relaxed text-center">
            <p>
              9 senedir kişisel antrenman ve beslenme planlarıyla insanlara hedeflerine
              ulaşmaları için rehberlik ediyorum. Yıllar içinde pek çok danışanım sağlıklı kilo verdi,
              kas kütlesini artırdı ve yaşam kalitesini yükseltti.
            </p>
            <p>
              Benim için antrenörlük yalnızca fiziksel değişim değil; disiplin, kararlılık ve
              özgüven kazandırma sürecidir.
            </p>
          </div>

         
        </div>
      </div>
    </section>
  );
}
