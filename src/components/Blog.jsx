import { useEffect, useState } from "react";
import MotionReveal from "./MotionReveal";
import { RevealHeading } from "./TextReveal";

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function Modal({ post, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm px-4 py-10 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-sm w-full max-w-2xl my-auto overflow-hidden">
        {post.coverImage && (
          <img src={post.coverImage} alt={post.title}
            className="w-full h-56 sm:h-72 object-cover"
            onError={(e) => e.target.style.display = "none"} />
        )}
        <div className="p-7 sm:p-10">
          <button onClick={onClose}
            className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors text-xl leading-none">✕</button>
          <p className="text-neutral-500 text-xs mb-3">{formatDate(post.publishedAt)}</p>
          <h2 className="text-white font-bold text-2xl sm:text-3xl leading-snug mb-6">{post.title}</h2>
          <div className="text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4">
            {post.content.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          {post.contentImages?.length > 0 && (
            <div className="mt-8 space-y-3">
              {post.contentImages.map((url, i) => (
                <img key={i} src={url} alt="" className="w-full rounded-sm object-cover"
                  onError={(e) => e.target.style.display = "none"} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((d) => { setPosts(d.posts || []); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || posts.length === 0) return null;

  return (
    <>
      <section id="blog" className="relative z-10 bg-neutral-950 pt-20 pb-16 px-4 sm:px-8 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <MotionReveal>
            <div className="text-center mb-12">
              <RevealHeading as="h2" mode="word"
                className="text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-[-0.02em]">
                Blog
              </RevealHeading>
              <p className="mt-4 text-base md:text-lg font-medium text-neutral-300 max-w-2xl mx-auto leading-relaxed">
                Fitness, beslenme ve sağlıklı yaşam üzerine yazılar.
              </p>
            </div>
          </MotionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <MotionReveal key={post.id} delay={i * 60}>
                <button type="button" onClick={() => setActive(post)}
                  className="group w-full text-left bg-neutral-900 border border-neutral-800 rounded-sm hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)] transition-all duration-300 flex flex-col h-full overflow-hidden">
                  {post.coverImage && (
                    <img src={post.coverImage} alt={post.title}
                      className="w-full h-44 object-cover flex-shrink-0"
                      onError={(e) => e.target.style.display = "none"} />
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-neutral-600 text-xs mb-2">{formatDate(post.publishedAt)}</p>
                    <h3 className="text-white font-semibold text-base leading-snug mb-3 group-hover:text-orange-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
                    <span className="mt-4 text-orange-500 text-xs font-semibold">Devamını oku →</span>
                  </div>
                </button>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {active && <Modal post={active} onClose={() => setActive(null)} />}
    </>
  );
}
