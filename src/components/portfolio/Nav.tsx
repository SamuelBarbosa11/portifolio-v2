import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";

const links = [
  { id: "inicio", label: "Início", rune: "ᛁ" },
  { id: "sobre", label: "Sobre", rune: "ᛊ" },
  { id: "stack", label: "Stack", rune: "ᛏ" },
  { id: "projetos", label: "Projetos", rune: "ᛈ" },
  { id: "contato", label: "Contato", rune: "ᚲ" },
];

export function Nav() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  const [active, setActive] = useState("inicio");
  const [hover, setHover] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { threshold: 0.45 },
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 right-0 top-0 z-50 h-px origin-left bg-primary shadow-glow"
      />
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-1/2 top-5 z-50 -translate-x-1/2"
      >
        <nav className="flex items-center gap-1 border border-border bg-background/60 px-2 py-2 backdrop-blur-xl [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]">
          <button
            onClick={() => go("inicio")}
            data-cursor="link"
            className="px-3 font-display text-sm font-black tracking-widest text-primary text-glow"
          >
            SB<span className="text-muted-foreground">/</span>
          </button>
          <div className="hidden md:flex" onMouseLeave={() => setHover(null)}>
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                onMouseEnter={() => setHover(l.id)}
                className="relative px-4 py-2 font-mono text-xs uppercase tracking-[0.2em]"
              >
                {(hover ?? active) === l.id && (
                  <motion.span
                    layoutId="pill"
                    className="absolute inset-0 border border-primary/50 bg-primary/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={hover === l.id ? "r" : "l"}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className={active === l.id ? "text-primary" : "text-muted-foreground"}
                    >
                      {hover === l.id ? `${l.rune} ${l.label}` : l.label}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Menu"
          >
            <motion.span
              animate={{ rotate: open ? 45 : 0, y: open ? 4 : 0 }}
              className="h-px w-5 bg-primary"
            />
            <motion.span
              animate={{ rotate: open ? -45 : 0, y: open ? -3 : 0 }}
              className="h-px w-5 bg-primary"
            />
          </button>
        </nav>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={{ clipPath: "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-background grid-bg md:hidden"
          >
            {links.map((l, i) => (
              <motion.button
                key={l.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                onClick={() => go(l.id)}
                className="font-display text-3xl font-bold"
              >
                <span className="mr-3 text-primary">{l.rune}</span>
                {l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
