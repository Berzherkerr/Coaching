// TEXT REVEAL ANIMASYONU - Başlıklar için harf harf veya kelime kelime belirme efekti
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function TextReveal({
  children,
  mode = "word", // "word" | "letter" | "line"
  delay = 0.2,
  duration = 0.7,
  staggerDelay = 0.03,
  className = "",
}) {
  const text = typeof children === "string" ? children : "";

  // Mode'a göre metni parçala
  const segments = useMemo(() => {
    if (!text) return [];

    switch (mode) {
      case "letter":
        return text.split("").map((char, i) => ({
          content: char,
          key: `letter-${i}`,
        }));

      case "word":
        return text.split(" ").map((word, i) => ({
          content: word,
          key: `word-${i}`,
        }));

      case "line":
        return text.split("\n").map((line, i) => ({
          content: line,
          key: `line-${i}`,
        }));

      default:
        return [];
    }
  }, [text, mode]);

  // Container animasyonu
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  // Her segment için animasyon
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {segments.map((segment, index) => (
        <motion.span
          key={segment.key}
          variants={itemVariants}
          className="inline-block"
          style={{ display: mode === "letter" ? "inline-block" : "inline" }}
        >
          {segment.content}
          {mode === "word" && index < segments.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Özel başlık component'i - daha kolay kullanım
export function RevealHeading({
  children,
  as = "h2",
  mode = "word",
  className = "",
  ...props
}) {
  const Tag = as;

  return (
    <Tag className={className} {...props}>
      <TextReveal mode={mode}>{children}</TextReveal>
    </Tag>
  );
}