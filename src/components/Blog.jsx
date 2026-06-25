import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MotionReveal from "./MotionReveal";
import { RevealHeading } from "./TextReveal";

export default function Blog() {
  const [hasPosts, setHasPosts] = useState(false);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((d) => setHasPosts((d.posts || []).length > 0))
      .catch(() => {});
  }, []);

  if (!hasPosts) return null;

  return (
    <section id="blog" className="relative z-10 bg-neutral-950 pt-[5.25rem] pb-[4.2rem] px-4 sm:px-8 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <MotionReveal>
          <RevealHeading as="h2" mode="word"
            className="text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-[-0.02em]">
            Blog
          </RevealHeading>
          <p className="mt-4 text-base md:text-lg font-medium text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Fitness, beslenme ve sağlıklı yaşam üzerine yazılar.
          </p>
          <Link to="/blog"
            className="mt-8 inline-flex items-center justify-center h-11 px-6 rounded-xl text-sm font-semibold bg-orange-600 hover:bg-orange-500 text-white transition-colors">
            Yazıları Oku
          </Link>
        </MotionReveal>
      </div>
    </section>
  );
}
