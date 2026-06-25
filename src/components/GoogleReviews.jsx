import { useEffect, useMemo, useRef, useState } from "react";
import MotionReveal from "./MotionReveal";
import { RevealHeading } from "./TextReveal";

function GoogleG({ className = "h-6 w-6", ariaHidden = true }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden={ariaHidden} xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function Stars({ rating }) {
  const full = Math.round(rating ?? 0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-lg ${i < full ? "text-amber-400" : "text-neutral-600"}`}>★</span>
      ))}
    </div>
  );
}

function InitialsAvatar({ name }) {
  const initials = (name || "?").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-semibold text-neutral-200">
      {initials}
    </div>
  );
}

function ReviewCard({ r }) {
  const numeric = Math.round(Number(r.rating || 0));
  const rawText = (r.text || "").trim();
  const shortText = rawText.length > 220 ? rawText.slice(0, 220).trimEnd() + "..." : rawText;
  return (
    <article className="rounded-sm p-4 flex flex-col bg-neutral-900/90">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {r.profile_photo_url ? (
            <img src={r.profile_photo_url} alt={r.author_name} className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <InitialsAvatar name={r.author_name} />
          )}
          <div className="leading-tight">
            <div className="font-semibold text-neutral-100 text-sm">{r.author_name}</div>
            <div className="text-xs text-neutral-400">{r.relative_time_description}</div>
          </div>
        </div>
        <GoogleG className="h-8 w-8 flex-shrink-0" ariaHidden={false} />
      </div>
      <div className="mt-2"><Stars rating={numeric} /></div>
      <p className="mt-3 text-xs sm:text-sm text-neutral-300 flex-1 overflow-hidden leading-snug"
        style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 4 }}
        title={rawText}>
        {shortText}
      </p>
    </article>
  );
}

const CARD_W = 300;
const CARD_H = 196;
const GAP = 16;

export default function GoogleReviews({ placeId, averageRating, totalReviews, cardsVisible = true }) {
  const [reviews, setReviews] = useState([]);
  const [autoData, setAutoData] = useState(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  const shownRating = typeof averageRating === "number" ? averageRating : autoData?.rating ?? null;
  const shownTotal  = typeof totalReviews  === "number" ? totalReviews  : autoData?.total  ?? null;

  const resolvedPlaceUrl = placeId
    ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
    : autoData?.url || undefined;

  const resolvedWriteUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : autoData?.cid ? `https://search.google.com/local/writereview?cid=${autoData.cid}` : undefined;

  // Reviews fetch
  useEffect(() => {
    fetch("/api/places-reviews")
      .then((r) => r.json())
      .then((d) => {
        const normalized = (d?.reviews || []).map((x) => ({
          profile_photo_url: x.profilePhotoUrl ?? x.profile_photo_url ?? "",
          author_name: x.authorName ?? x.author_name ?? "Google kullanıcısı",
          relative_time_description: x.relativeTime ?? x.relative_time_description ?? "",
          rating: x.rating ?? 0,
          text: x.text ?? "",
        }));
        setReviews(normalized);
        let cid = null;
        try { cid = new URL(d?.url || "").searchParams.get("cid"); } catch {}
        setAutoData({ rating: d?.rating ?? null, total: d?.total ?? null, url: d?.url ?? null, cid });
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!reviews.length) return;
    const t = setInterval(() => setMobileIndex((i) => (i + 1) % reviews.length), 7000);
    return () => clearInterval(t);
  }, [reviews.length]);

  const setWidth = useMemo(() => (reviews.length || 1) * (CARD_W + GAP), [reviews.length]);
  const offsetRef   = useRef(0);
  const velRef      = useRef(-40);
  const reqRef      = useRef(0);
  const containerRef = useRef(null);
  const lastTsRef   = useRef(0);

  useEffect(() => {
    if (!reviews.length || !setWidth) return;
    const step = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      offsetRef.current += velRef.current * dt;
      if (offsetRef.current <= -setWidth) offsetRef.current += setWidth;
      else if (offsetRef.current >= 0)    offsetRef.current -= setWidth;
      if (containerRef.current) containerRef.current.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      reqRef.current = requestAnimationFrame(step);
    };
    reqRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(reqRef.current);
  }, [reviews, setWidth]);

  const onPointerDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
    if (x < rect.width / 3) velRef.current = -120;
    else if (x > (rect.width / 3) * 2) velRef.current = 120;
    else velRef.current = 0;
  };
  const onPointerUp = () => { velRef.current = -40; };

  const ctaStars = Math.round(Number(shownRating) || 0);

  return (
    <section className="w-full pt-5 pb-16 px-4 sm:px-8 lg:px-20 select-none bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        <MotionReveal>
          <header className="mb-8 text-center">
            <RevealHeading as="h2" mode="word" className="text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-[-0.02em]">
              İnanç Coaching | Balıkesir
            </RevealHeading>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
              <Stars rating={ctaStars || 5} />
              <span className="text-sm sm:text-base text-neutral-300">
                {typeof shownRating === "number" ? `${shownRating.toFixed(1)} ` : "Google üzerinden değerlendirmeler"}
                {typeof shownTotal === "number" ? ` • ${shownTotal} yorum` : ""}
              </span>
            </div>
          </header>
        </MotionReveal>

        <MotionReveal delay={120}>
          <>
            {cardsVisible && reviews.length > 0 && (
              <div className="sm:hidden">
                <div className="relative overflow-hidden" style={{ height: CARD_H }}>
                  {reviews.map((r, i) => (
                    <div key={i} className="absolute inset-0 transition-opacity duration-700"
                      style={{ opacity: i === mobileIndex ? 1 : 0, pointerEvents: i === mobileIndex ? "auto" : "none" }}>
                      <ReviewCard r={r} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cardsVisible && (
              <div
                className="hidden sm:block relative overflow-hidden bg-transparent cursor-pointer"
                onMouseDown={onPointerDown} onMouseUp={onPointerUp} onMouseLeave={onPointerUp}
                onTouchStart={onPointerDown} onTouchEnd={onPointerUp}
                style={{ isolation: "isolate", touchAction: "pan-y" }}
              >
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
                  style={{ background: "linear-gradient(to right, rgb(10,10,10) 0%, transparent 100%)" }} />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
                  style={{ background: "linear-gradient(to left, rgb(10,10,10) 0%, transparent 100%)" }} />
                <div className="overflow-hidden">
                  <div ref={containerRef} className="flex" style={{ gap: `${GAP}px`, willChange: "transform", backfaceVisibility: "hidden" }}>
                    {[...reviews, ...reviews].map((r, i) => (
                      <div key={i} className="flex-shrink-0" style={{ width: CARD_W, height: CARD_H }}>
                        <ReviewCard r={r} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className={`flex flex-row gap-3 items-center justify-center ${cardsVisible ? "mt-12" : "mt-6"}`}>
              <a href={resolvedPlaceUrl || "#"} target="_blank" rel="noreferrer"
                className={`inline-flex items-center justify-center h-11 px-4 sm:px-5 rounded-xl text-sm md:text-base font-semibold tracking-tight border transition-colors ${
                  resolvedPlaceUrl ? "border-neutral-700 bg-neutral-900/80 text-neutral-100 hover:border-orange-500" : "border-neutral-800 bg-neutral-900/60 text-neutral-500 cursor-not-allowed"
                }`} aria-disabled={!resolvedPlaceUrl}>
                Google İşletme
              </a>
              <a href={resolvedWriteUrl || "#"} target="_blank" rel="noreferrer"
                className={`inline-flex items-center justify-center h-11 px-4 sm:px-5 rounded-xl text-sm md:text-base font-semibold tracking-tight transition-colors ${
                  resolvedWriteUrl ? "bg-orange-600 hover:bg-orange-500 text-white shadow-sm" : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                }`} aria-disabled={!resolvedWriteUrl}>
                Yorum yaz
              </a>
            </div>
          </>
        </MotionReveal>
      </div>
    </section>
  );
}
