import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const MAP: Record<string, string> = {
  a: "ᚨ",
  b: "ᛒ",
  c: "ᚲ",
  d: "ᛞ",
  e: "ᛖ",
  f: "ᚠ",
  g: "ᚷ",
  h: "ᚺ",
  i: "ᛁ",
  j: "ᛃ",
  k: "ᚲ",
  l: "ᛚ",
  m: "ᛗ",
  n: "ᚾ",
  o: "ᛟ",
  p: "ᛈ",
  q: "ᚲ",
  r: "ᚱ",
  s: "ᛊ",
  t: "ᛏ",
  u: "ᚢ",
  v: "ᚹ",
  w: "ᚹ",
  x: "ᛉ",
  y: "ᛃ",
  z: "ᛉ",
};
const strip = (c: string) =>
  c
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
/** Transliteração determinística para Elder Futhark (mantém espaços, números e pontuação). */
export const toRune = (c: string) => MAP[strip(c)] ?? c;

/** Renderiza o texto: caracteres até `count` em português, o restante em runas. */
export function RuneGlyphs({
  text,
  count,
  runeClass,
}: {
  text: string;
  count: number;
  runeClass: string;
}) {
  const words = text.split(" ");
  let idx = 0;
  return (
    <>
      {words.map((word, wi) => {
        const chars = Array.from(word).map((ch) => {
          const i = idx++;
          const done = i < count;
          return (
            <motion.span
              key={`${i}-${done}`}
              aria-hidden
              className={`inline-block ${done ? "" : runeClass}`}
              initial={done ? { opacity: 0, y: -8, filter: "blur(4px)" } : false}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {done ? ch : toRune(ch)}
            </motion.span>
          );
        });
        idx++; // consome o espaço entre palavras
        return (
          <span key={wi}>
            {/* Palavra inteira como bloco indivisível: a quebra de linha só acontece entre palavras. */}
            <span className="inline-block whitespace-nowrap">{chars}</span>
            {wi < words.length - 1 && (
              <span className="inline-block" style={{ minWidth: "0.3em" }}>
                {" "}
              </span>
            )}
          </span>
        );
      })}
    </>
  );
}

/** Frase já escrita em runas que se traduz letra a letra para português ao entrar na tela. */
export function RuneText({
  text,
  className,
  delay = 0,
  speed = 90,
  runeClass = "text-primary/60",
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  runeClass?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let iv: number | undefined, to: number | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        to = window.setTimeout(() => {
          iv = window.setInterval(
            () =>
              setCount((c) => {
                if (c >= text.length) {
                  clearInterval(iv);
                  return c;
                }
                return c + 1;
              }),
            speed,
          );
        }, delay);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(to);
      clearInterval(iv);
    };
  }, [text, delay, speed]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <RuneGlyphs text={text} count={count} runeClass={runeClass} />
    </span>
  );
}
