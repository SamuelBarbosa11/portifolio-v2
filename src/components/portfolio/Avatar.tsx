import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import me from "@/assets/me-3d.png";

const lines = [
  "Olá! Eu sou o Samuel",
  "Frontend + backend = full-stack",
  "git push && deploy",
  "Estética · Usabilidade · Engenharia",
  "Bora criar algo épico? ᛟ",
];

/** Samuel em estilo 3D, virado para o texto, com parallax pelo mouse. */
export function Avatar() {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 }),
    sy = useSpring(my, { stiffness: 60, damping: 18 });
  const bodyX = useTransform(sx, (v) => v * 18),
    bodyY = useTransform(sy, (v) => v * 10);
  const backX = useTransform(sx, (v) => v * -30),
    backY = useTransform(sy, (v) => v * -20);
  const frontX = useTransform(sx, (v) => v * 45),
    frontY = useTransform(sy, (v) => v * 30);
  const tilt = useTransform(sx, (v) => v * 4);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % lines.length), 3600);
    const move = (e: MouseEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      mx.set(Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (r.width * 1.5))));
      my.set(Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / (r.height * 1.5))));
    };
    window.addEventListener("mousemove", move);
    return () => {
      clearInterval(id);
      window.removeEventListener("mousemove", move);
    };
  }, [mx, my]);

  return (
    <div
      ref={ref}
      className="relative mx-auto mt-8 sm:mt-10 aspect-3/5 w-full max-w-70 sm:max-w-xs perspective-[900px]"
    >
      <motion.div
        style={{ x: backX, y: backY }}
        className="absolute inset-[8%] rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        style={{ x: backX, y: backY }}
        className="absolute inset-x-0 top-[10%] aspect-square rounded-full border border-dashed border-primary/30 animate-[spin-slow_40s_linear_infinite]"
      />
      <motion.div
        style={{ x: backX }}
        className="absolute bottom-[2%] left-1/2 h-4 w-2/3 -translate-x-1/2 rounded-[50%] bg-primary/20 blur-md"
      />

      <motion.img
        src={me}
        alt="Ilustração 3D de Samuel em corpo inteiro, braços cruzados, virado para o lado"
        width={768}
        height={1376}
        style={{ x: bodyX, y: bodyY, rotateY: tilt, transformOrigin: "50% 100%" }}
        className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_30px_color-mix(in_oklab,var(--primary)_35%,transparent)]"
      />

      {[
        { glyph: "</>", style: { left: "-2%", top: "18%" } },
        { glyph: "ᚠ", style: { right: "2%", top: "26%" } },
        { glyph: "{ }", style: { left: "0%", top: "62%" } },
        { glyph: "ᛒ", style: { right: "4%", top: "72%" } },
      ].map((item) => (
        <motion.span
          key={item.glyph}
          style={{
            x: frontX,
            y: frontY,
            ...item.style,
          }}
          className="absolute z-20 font-mono text-xs sm:text-sm text-primary text-glow select-none"
        >
          {item.glyph}
        </motion.span>
      ))}

      <div className="absolute -top-7 right-0 sm:-right-4 z-30 max-w-[85%] sm:max-w-[75%]">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="relative border border-primary bg-card/95 backdrop-blur-sm px-3 py-1.5 sm:py-2 font-mono text-[11px] sm:text-xs text-foreground shadow-glow"
          >
            {lines[i]}
            <span className="absolute -bottom-2 right-8 sm:left-6 h-3 w-3 rotate-45 border-b border-r border-primary bg-card" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
