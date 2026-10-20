import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/** Cursor customizado: ponto + anel geométrico que muda de forma sobre elementos interativos e deixa rastro. */
export function Cursor() {
  const x = useMotionValue(-100),
    y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 180, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 20, mass: 0.4 });
  const [mode, setMode] = useState<"default" | "link" | "text">("default");
  const [label, setLabel] = useState("");
  const [down, setDown] = useState(false);
  const trail = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const pts: { x: number; y: number; t: number }[] = [];
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      const t = (e.target as HTMLElement).closest("[data-cursor]") as HTMLElement | null;
      const a = (e.target as HTMLElement).closest("a,button");
      if (t) {
        setMode((t.dataset["cursor"] as "link" | "text") ?? "link");
        setLabel(t.dataset["cursorLabel"] ?? "");
      } else if (a) {
        setMode("link");
        setLabel("");
      } else {
        setMode("default");
        setLabel("");
      }
    };
    const dn = () => setDown(true),
      up = () => setDown(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", dn);
    window.addEventListener("mouseup", up);
    const c = trail.current!,
      ctx = c.getContext("2d")!;
    const resize = () => {
      c.width = innerWidth;
      c.height = innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const color = getComputedStyle(document.documentElement).getPropertyValue("--primary");
    let raf = 0;
    const loop = () => {
      const now = performance.now();
      while (pts[0] && now - pts[0].t > 350) pts.shift();
      ctx.clearRect(0, 0, c.width, c.height);
      for (let i = 1; i < pts.length; i++) {
        const a = 1 - (now - pts[i]!.t) / 350;
        ctx.strokeStyle = color;
        ctx.globalAlpha = a * 0.6;
        ctx.lineWidth = a * 2;
        ctx.beginPath();
        ctx.moveTo(pts[i - 1]!.x, pts[i - 1]!.y);
        ctx.lineTo(pts[i]!.x, pts[i]!.y);
        ctx.stroke();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", dn);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("resize", resize);
    };
  }, [x, y]);

  const size = mode === "link" ? (label ? 84 : 56) : mode === "text" ? 6 : 34;
  return (
    <div className="pointer-events-none fixed inset-0 z-100 hidden pointer-fine:block">
      <canvas ref={trail} className="absolute inset-0" />
      <motion.div style={{ x: sx, y: sy }} className="absolute left-0 top-0">
        <motion.div
          animate={{
            width: size,
            height: mode === "text" ? 32 : size,
            rotate: mode === "link" ? 45 : 0,
            scale: down ? 0.7 : 1,
            borderRadius: mode === "link" ? 4 : 999,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className={`-translate-x-1/2 -translate-y-1/2 flex items-center justify-center border border-primary ${mode === "link" ? "bg-primary/15 shadow-glow" : mode === "text" ? "bg-primary" : ""}`}
        >
          {label && (
            <span className="-rotate-45 font-mono text-[10px] uppercase tracking-widest text-primary">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>
      <motion.div style={{ x, y }} className="absolute left-0 top-0">
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-glow" />
      </motion.div>
    </div>
  );
}
