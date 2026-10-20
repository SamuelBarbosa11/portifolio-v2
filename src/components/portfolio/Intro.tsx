import { motion } from "motion/react";
import { useEffect, useState } from "react";

const R = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ";

/** Tela de abertura: anel de runas carregando e cortina que se abre. */
export function Intro() {
  const [n, setN] = useState(0);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setN((v) => Math.min(100, v + Math.ceil(Math.random() * 9))), 60);
    const t = setTimeout(() => setGone(true), 2300);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, []);
  return (
    <motion.div
      initial={{ clipPath: "inset(0 0 0 0)" }}
      animate={gone ? { clipPath: "inset(0 0 100% 0)" } : {}}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      className="pointer-events-none fixed inset-0 z-90 flex items-center justify-center bg-background px-4"
    >
      <div className="relative h-48 w-48 sm:h-56 sm:w-56 scale-90 sm:scale-100">
        {R.split("").map((r, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: i / R.length < n / 100 ? 1 : 0.1 }}
            className="absolute left-1/2 top-1/2 font-mono text-primary text-glow"
            style={{
              transform: `rotate(${(i / R.length) * 360}deg) translateY(-100px) rotate(-${(i / R.length) * 360}deg)`,
            }}
          >
            {r}
          </motion.span>
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl font-black text-primary text-glow">{n}%</span>
          <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            invocando
          </span>
        </div>
      </div>
    </motion.div>
  );
}
