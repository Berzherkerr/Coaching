import { useEffect, useRef, useState } from "react";
import MotionReveal from "./MotionReveal";

const images = ["/12345.jpeg", "/123456.jpeg", "/arda2.png"];

const DEFAULT_HAKKIMDA = {
  intro: "Merhaba, ben Arda İnanç Kurt. Balıkesir Merkez'de kişiye özel programlarla öğrencilerimin hayatlarına dokunduğum bir yaşantı sürmekteyim.",
  paragraflar: [
    "Yaklaşık 10 senedir birebir ve online koçluk ile antrenmanla birlikte beslenme planlaması oluşturarak danışanlarımın yağ kaybı, kas gelişimi ve postür - duruş iyileştirmesi gibi hedeflerine ulaşmalarına yardımcı oluyorum.",
    "Her danışan için, onların günlük hayat temposuna uyumlu ve sürdürülebilir bir sistem kurmaya odaklanıyorum. Dersler benim müsait olduğum zamanlara değil öğrencinin müsait olduğu zamanlara planlanmakta.",
    "Benim için antrenörlük; sadece antrenman yazmak değil, öğrencime disiplin, kararlılık ve özgüven kazandırma süreci. Hedefinize, yaşantınıza ve fiziksel seviyenize göre, net bir plan ve ölçülebilir adımlarla ilerliyoruz.",
  ],
};

export default function Hakkimda() {
  const [index, setIndex] = useState(0);
  const [content, setContent] = useState(DEFAULT_HAKKIMDA);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch("/api/hakkimda")
      .then((r) => r.json())
      .then((d) => { if (d.intro || d.paragraflar) setContent({ ...DEFAULT_HAKKIMDA, ...d }); })
      .catch(() => {});
  }, []);

  // Otomatik slayt
  useEffect(() => {
    startAuto();
    return stopAuto;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        dx > 0
          ? (i - 1 + images.length) % images.length
          : (i + 1) % images.length
      );
    }
    startAuto();
  };

  return (
    <section
      id="hakkimda"
      className="relative bg-neutral-950 py-[4.2rem] sm:py-[5.25rem] px-4 sm:px-8 lg:px-20"
    >
    

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 lg:gap-14 items-stretch">
          <MotionReveal className="h-full">
            <div
              className="relative w-full h-full min-h-[290px] sm:min-h-[340px] rounded-sm overflow-hidden
                         bg-neutral-900/90 border border-neutral-800 shadow-lg ring-1 ring-transparent
                         select-none"
              onMouseEnter={stopAuto}
              onMouseLeave={startAuto}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              aria-label="Balıkesir spor hocası görsel slaytı"
            >
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

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-neutral-950/30 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === i
                        ? "w-5 bg-white"
                        : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={80} className="h-full">
            <div className="relative text-center lg:text-center h-full flex flex-col justify-center">
              <p className="text-base sm:text-lg font-medium text-neutral-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {content.intro}
              </p>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {(content.paragraflar || []).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
