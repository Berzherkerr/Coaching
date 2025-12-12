// src/components/GoogleReviews.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import MotionReveal from "./MotionReveal";
import { RevealHeading } from "./TextReveal";

function GoogleG({ className = "h-6 w-6", ariaHidden = true }) {
  return (
    <img
      src="https://api.iconify.design/logos/google-icon.svg"
      alt="Google"
      aria-hidden={ariaHidden}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      style={{ imageRendering: "crisp-edges" }}
    />
  );
}

function Stars({ rating }) {
  const full = Math.round(rating ?? 0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-lg ${
            i < full ? "text-amber-400" : "text-neutral-600"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function InitialsAvatar({ name }) {
  const initials = (name || "?")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-semibold text-neutral-200">
      {initials}
    </div>
  );
}

const CARD_W = 300;
const CARD_H = 196;
const GAP = 16;

export default function GoogleReviews({ placeId, averageRating, totalReviews }) {
  const [reviews, setReviews] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [autoData, setAutoData] = useState(null);

  const shownRating =
    typeof averageRating === "number"
      ? averageRating
      : typeof autoData?.rating === "number"
      ? autoData.rating
      : null;

  const shownTotal =
    typeof totalReviews === "number"
      ? totalReviews
      : typeof autoData?.total === "number"
      ? autoData.total
      : null;

  const resolvedPlaceUrl = placeId
    ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
    : autoData?.url || undefined;

  const resolvedWriteUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : autoData?.cid
    ? `https://search.google.com/local/writereview?cid=${autoData.cid}`
    : undefined;

  // Mobil / desktop
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const h = () => setIsMobile(mq.matches);
    h();
    mq.addEventListener?.("change", h);
    return () => mq.removeEventListener?.("change", h);
  }, []);

  const autoSpeed = isMobile ? 10 : 40;
  const manualSpeed = isMobile ? 60 : 120;

  const offsetRef = useRef(0);
  const velRef = useRef(-autoSpeed);
  const reqRef = useRef(0);
  const containerRef = useRef(null);
  const lastTsRef = useRef(0);

  // Google Reviews fetch
  useEffect(() => {
    fetch("/api/places-reviews")
      .then((r) => r.json())
      .then((d) => {
        const normalized = (d?.reviews || []).map((x) => ({
          profile_photo_url: x.profilePhotoUrl ?? x.profile_photo_url ?? "",
          author_name: x.authorName ?? x.author_name ?? "Google kullanıcısı",
          relative_time_description:
            x.relativeTime ?? x.relative_time_description ?? "",
          rating: x.rating ?? 0,
          text: x.text ?? "",
        }));
        setReviews(normalized);

        let cid = null;
        try {
          cid = new URL(d?.url || "").searchParams.get("cid");
        } catch {}
        setAutoData({
          rating: d?.rating ?? null,
          total: d?.total ?? null,
          url: d?.url ?? null,
          cid,
        });
      })
      .catch(console.error);
  }, []);

  const setWidth = useMemo(
    () => (reviews.length || 1) * (CARD_W + GAP),
    [reviews.length]
  );

  // Sonsuz kayma animasyonu
  useEffect(() => {
    if (!reviews.length || !setWidth) return;

    const step = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      offsetRef.current += velRef.current * dt;

      if (offsetRef.current <= -setWidth) offsetRef.current += setWidth;
      else if (offsetRef.current >= 0) offsetRef.current -= setWidth;

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      }

      reqRef.current = requestAnimationFrame(step);
    };

    reqRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(reqRef.current);
  }, [reviews, setWidth, autoSpeed]);

  // Pointer kontrolü
  const onPointerDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const x = clientX - rect.left;

    if (x < rect.width / 3) velRef.current = -manualSpeed;
    else if (x > (rect.width / 3) * 2) velRef.current = manualSpeed;
    else velRef.current = 0;
  };

  const onPointerUp = () => {
    velRef.current = -autoSpeed;
  };

  const ctaStars = Math.round(Number(shownRating) || 0);

  return (
    <section className="w-full pt-5 pb-16 px-4 sm:px-8 lg:px-20 select-none bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        {/* Üst başlık + rating */}
        <MotionReveal>
          <header className="mb-8 text-center">
            <RevealHeading
              as="h2"
              mode="word"
              className="text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-[-0.02em]"
            >
              İnanç Coaching | Balıkesir
            </RevealHeading>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
              <Stars rating={ctaStars || 5} />
              <span className="text-sm sm:text-base text-neutral-300">
                {typeof shownRating === "number"
                  ? `${shownRating.toFixed(1)} `
                  : "Google üzerinden değerlendirmeler"}
                {typeof shownTotal === "number" ? ` • ${shownTotal} yorum` : ""}
              </span>
            </div>
          </header>
        </MotionReveal>

        {/* Kayan slider + CTA */}
        <MotionReveal delay={120}>
          <>
            <div
              className="relative overflow-hidden bg-transparent cursor-pointer"
              onMouseDown={onPointerDown}
              onMouseUp={onPointerUp}
              onMouseLeave={onPointerUp}
              onTouchStart={onPointerDown}
              onTouchEnd={onPointerUp}
              style={{ isolation: "isolate", touchAction: "pan-y" }}
            >
              <div className="overflow-hidden">
                <div
                  ref={containerRef}
                  className="flex"
                  style={{
                    gap: `${GAP}px`,
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {[...reviews, ...reviews].map((r, i) => {
                    const numeric = Math.round(Number(r.rating || 0));
                    const rawText = (r.text || "").trim();
                    const shortText =
                      rawText.length > 220
                        ? rawText.slice(0, 220).trimEnd() + "..."
                        : rawText;

                    return (
                      <article
                        key={`${r.author_name}-${i}`}
                        className="flex-shrink-0 rounded-sm shadow-lg p-4 flex flex-col bg-neutral-950 border border-neutral-800"
                        style={{ width: CARD_W, height: CARD_H }}
                      >
                        {/* Üst satır: avatar + isim + tarih + Google ikonu */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {r.profile_photo_url ? (
                              <img
                                src={r.profile_photo_url}
                                alt={r.author_name}
                                className="h-8 w-8 rounded-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <InitialsAvatar name={r.author_name} />
                            )}
                            <div className="leading-tight">
                              <div className="font-semibold text-neutral-100 text-sm sm:text-base">
                                {r.author_name}
                              </div>
                              <div className="text-xs text-neutral-400">
                                {r.relative_time_description}
                              </div>
                            </div>
                          </div>

                          <GoogleG className="h-5 w-5" ariaHidden={false} />
                        </div>

                        {/* Yıldızlar */}
                        <div className="mt-2">
                          <Stars rating={numeric} />
                        </div>

                        {/* Yorum metni  */}
                        <p
                          className="mt-3 text-xs sm:text-sm text-neutral-300 flex-1 overflow-hidden leading-snug"
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 4,
                          }}
                          title={rawText}
                        >
                          {shortText}
                        </p>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CTA butonları –  */}
            <div className="mt-12 flex flex-row gap-3 items-center justify-center">
              <a
                href={resolvedPlaceUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center justify-center h-11 px-4 sm:px-5 rounded-xl text-sm md:text-base font-semibold tracking-tight border transition-colors ${
                  resolvedPlaceUrl
                    ? "border-neutral-700 bg-neutral-900/80 text-neutral-100 hover:border-orange-500 hover:text-white-200"
                    : "border-neutral-800 bg-neutral-900/60 text-neutral-500 cursor-not-allowed"
                }`}
                aria-disabled={!resolvedPlaceUrl}
              >
                Google İşletme
              </a>
              <a
                href={resolvedWriteUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center justify-center h-11 px-4 sm:px-5 rounded-xl text-sm md:text-base font-semibold tracking-tight transition-colors ${
                  resolvedWriteUrl
                    ? "bg-orange-600 hover:bg-orange-500 text-white shadow-sm hover:shadow-md"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                }`}
                aria-disabled={!resolvedWriteUrl}
              >
                Yorum yaz
              </a>
            </div>
          </>
        </MotionReveal>
      </div>
    </section>
  );
}
