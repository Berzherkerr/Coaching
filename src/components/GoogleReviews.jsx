// src/components/GoogleReviews.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import MotionReveal from "./MotionReveal";

/* Google G — DIŞ KAYNAKTAN (Iconify CDN), renkli resmi logo */
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

/* Yıldızlar */
function Stars({ rating }) {
  const full = Math.round(rating ?? 0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-[18px] ${i < full ? "text-amber-400" : "text-neutral-600"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* Baş harf avatarı */
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

/* Kart ölçüleri (yükseklik +%15) */
const CARD_W = 300;
const CARD_H = 196; // 170 * 1.15
const GAP = 16;

export default function GoogleReviews({ placeId, averageRating, totalReviews }) {
  const [reviews, setReviews] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [autoData, setAutoData] = useState(null); // { rating,total,url,cid }

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

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const h = () => setIsMobile(mq.matches);
    h();
    mq.addEventListener?.("change", h);
    return () => mq.removeEventListener?.("change", h);
  }, []);
  const autoSpeed = isMobile ? 10 : 40;
  const manualSpeed = isMobile ? 120 : 180;

  const offsetRef = useRef(0);
  const velRef = useRef(-autoSpeed);
  const reqRef = useRef(0);
  const containerRef = useRef(null);
  const lastTsRef = useRef(0);

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
  useEffect(() => {
    const step = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      offsetRef.current += velRef.current * dt;

      if (offsetRef.current <= -setWidth) offsetRef.current += setWidth;
      else if (offsetRef.current >= 0) offsetRef.current -= setWidth;

      if (containerRef.current)
        containerRef.current.style.transform = `translateX(${offsetRef.current}px)`;

      reqRef.current = requestAnimationFrame(step);
    };
    reqRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(reqRef.current);
  }, [setWidth, autoSpeed]);

  const onPointerDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
    velRef.current = (x < rect.width / 2 ? +1 : -1) * manualSpeed;
  };
  const onPointerUp = () => {
    velRef.current = -autoSpeed;
  };

  const ctaStars = Math.round(Number(shownRating) || 0);

  // Kenar fade mesafesi (mask) — daha geniş yapıp çizgiyi yok ediyor
  const fadePx = isMobile ? 80 : 140;

  return (
    <section className="w-full pt-5 pb-20 px-4 sm:px-8 lg:px-20 select-none bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        {/* CTA Kart (reveal) */}
        <MotionReveal>
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 shadow-lg p-5 sm:p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 sm:gap-6">
              {/* Sol: Logo + Puan */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-xl bg-neutral-800">
                  <GoogleG className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>

                {/* Mobil ve masaüstünde AYNI düzen */}
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-semibold text-lg sm:text-xl">
                      {typeof shownRating === "number"
                        ? shownRating.toFixed(1)
                        : "—"}
                    </span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-[18px] ${
                            i < ctaStars ? "text-amber-400" : "text-neutral-600"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-400 mt-1">
                    {typeof shownTotal === "number"
                      ? `${shownTotal} yorum`
                      : "Google üzerinde"}
                  </div>
                </div>
              </div>

              {/* Sağ: Butonlar */}
              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:flex-nowrap sm:gap-4 w-full md:w-auto">
                <a
                  href={resolvedPlaceUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center justify-center h-11 px-5 rounded-xl text-sm font-semibold transition whitespace-nowrap
                    ${
                      resolvedPlaceUrl
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    }
                    w-full sm:w-auto`}
                  aria-disabled={!resolvedPlaceUrl}
                >
                  Yorumlar
                </a>
                <a
                  href={resolvedWriteUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center justify-center h-11 px-5 rounded-xl text-sm font-semibold transition whitespace-nowrap
                    ${
                      resolvedWriteUrl
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                        : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    }
                    w-full sm:w-auto`}
                  aria-disabled={!resolvedWriteUrl}
                >
                  Yorum yaz
                </a>
              </div>
            </div>
          </div>
        </MotionReveal>

        {/* Kayar kartlar (reveal) */}
        <MotionReveal delay={120}>
          <div
            className="relative overflow-hidden"
            onMouseDown={onPointerDown}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={onPointerDown}
            onTouchEnd={onPointerUp}
            /* Kenara tam dayalı ve çizgisiz fade için MASK kullanıyoruz */
            style={{
              WebkitMaskImage: `linear-gradient(to right,
                rgba(0,0,0,1) 0px,
                rgba(0,0,0,1) ${Math.max(fadePx - 40, 40)}px,
                rgba(0,0,0,0) ${fadePx}px,
                rgba(0,0,0,0) calc(100% - ${fadePx}px),
                rgba(0,0,0,1) calc(100% - ${Math.max(fadePx - 40, 40)}px),
                rgba(0,0,0,1) 100%)`,
              maskImage: `linear-gradient(to right,
                rgba(0,0,0,1) 0px,
                rgba(0,0,0,1) ${Math.max(fadePx - 40, 40)}px,
                rgba(0,0,0,0) ${fadePx}px,
                rgba(0,0,0,0) calc(100% - ${fadePx}px),
                rgba(0,0,0,1) calc(100% - ${Math.max(fadePx - 40, 40)}px),
                rgba(0,0,0,1) 100%)`,
            }}
          >
            {/* Track */}
            <div
              ref={containerRef}
              className="flex"
              style={{ gap: `${GAP}px`, willChange: "transform" }}
            >
              {[...reviews, ...reviews].map((r, i) => (
                <article
                  key={`${r.author_name}-${i}`}
                  className="flex-shrink-0 rounded-2xl shadow-lg p-4 flex flex-col bg-neutral-900 border border-neutral-800"
                  style={{ width: CARD_W, height: CARD_H }}
                >
                  <div className="flex items-center justify-between">
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
                        <div className="font-semibold text-neutral-100 text-sm">
                          {r.author_name}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {r.relative_time_description}
                        </div>
                      </div>
                    </div>
                    <GoogleG className="h-6 w-6" />
                  </div>

                  <div className="mt-2">
                    <Stars rating={r.rating} />
                  </div>

                  <p
                    className="mt-2 text-[12px] leading-snug text-neutral-300 flex-1 overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 5,
                    }}
                    title={r.text}
                  >
                    {r.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
