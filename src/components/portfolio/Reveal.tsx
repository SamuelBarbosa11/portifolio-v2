import { motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { RuneGlyphs } from "./RuneText";

/** Revela palavras com blur + subida, uma a uma. */
export function WordsReveal({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          className="mr-[0.25em] inline-block"
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

/** Ao passar o cursor, o texto vira runas Elder Futhark e se traduz devagar, letra a letra. */
export function Scramble({
  text,
  className,
  runeClass = "text-primary/60",
}: {
  text: string;
  className?: string;
  runeClass?: string;
}) {
  const [count, setCount] = useState(text.length);
  const iv = useRef<number | undefined>(undefined);
  useEffect(() => () => clearInterval(iv.current), []);
  const run = () => {
    if (count < text.length) return;
    setCount(0);
    iv.current = window.setInterval(
      () =>
        setCount((c) => {
          if (c + 1 >= text.length) clearInterval(iv.current);
          return c + 1;
        }),
      120,
    );
  };
  return (
    <span onMouseEnter={run} className={className} aria-label={text}>
      <RuneGlyphs text={text} count={count} runeClass={runeClass} />
    </span>
  );
}

/** Elemento magnético que segue o cursor. */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: MouseEvent) => {
    if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) return;
    const r = ref.current!.getBoundingClientRect();
    ref.current!.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.35}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`inline-block transition-transform duration-300 ease-out ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/** Card com inclinação 3D e brilho que segue o cursor. */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: MouseEvent) => {
    if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) return;
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width,
      py = (e.clientY - r.top) / r.height;
    ref.current!.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 12}deg) rotateX(${(0.5 - py) * 12}deg)`;
    ref.current!.style.setProperty("--mx", `${px * 100}%`);
    ref.current!.style.setProperty("--my", `${py * 100}%`);
  };
  const leave = () => {
    if (ref.current) {
      ref.current.style.transform = "";
    }
  };
  return (
    <div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`group relative transition-transform duration-200 ease-out transform-3d ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 [background:radial-gradient(400px_circle_at_var(--mx)_var(--my),color-mix(in_oklab,var(--primary)_18%,transparent),transparent_60%)]" />
      {children}
    </div>
  );
}
