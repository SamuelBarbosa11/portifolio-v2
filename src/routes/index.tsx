import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import fox from "@/assets/fox.jpg";
import { Cursor } from "@/components/portfolio/Cursor";
import { Nav } from "@/components/portfolio/Nav";
import { Intro } from "@/components/portfolio/Intro";
import { RuneText } from "@/components/portfolio/RuneText";
import { WordsReveal, Scramble, Magnetic, TiltCard } from "@/components/portfolio/Reveal";
import { Avatar } from "@/components/portfolio/Avatar";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Samuel Barbosa — Desenvolvedor Full-Stack" },
      {
        name: "description",
        content:
          "Portfólio imersivo de Samuel Barbosa: desenvolvedor full-stack e estudante de Ciência da Computação.",
      },
      { property: "og:title", content: "Samuel Barbosa — Desenvolvedor Full-Stack" },
      {
        property: "og:description",
        content: "Experiências digitais na intersecção entre estética, usabilidade e engenharia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const stack = [
  {
    g: "Frontend",
    r: "ᚠ",
    items: ["React", "React Native", "Tailwind CSS", "Shadcn", "GSAP / Motion", "Vite.js"],
  },
  {
    g: "Backend",
    r: "ᛒ",
    items: ["Node.js", "Express.js", "API RESTful", "bcrypt", "Agentes de IA"],
  },
  { g: "Dados", r: "ᛞ", items: ["SQL", "NoSQL", "ORM's", "Supabase / Firebase"] },
  {
    g: "Linguagens",
    r: "ᛚ",
    items: ["TypeScript", "JavaScript", "Java", "Python", "Go", "C / C++"],
  },
  { g: "Workflow", r: "ᛟ", items: ["Git & GitHub", "CI/CD", "UI / UX"] },
];

function Index() {
  const heroRef = useRef<HTMLElement>(null);
  const hScroll = useRef<HTMLDivElement>(null);
  const hTrack = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const foxY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const foxScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 }),
    smy = useSpring(my, { stiffness: 60, damping: 20 });
  const foxRX = useTransform(smy, [-1, 1], [10, -10]),
    foxRY = useTransform(smx, [-1, 1], [-14, 14]);
  const gridX = useTransform(smx, [-1, 1], [20, -20]),
    gridY = useTransform(smy, [-1, 1], [20, -20]);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08 });
    gsap.registerPlugin(ScrollTrigger);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / innerWidth) * 2 - 1);
      my.set((e.clientY / innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);

    const ctx = gsap.context(() => {
      // Scroll horizontal da stack
      if (hTrack.current && hScroll.current) {
        gsap.to(hTrack.current, {
          x: () => {
            const pad = window.innerWidth < 640 ? 24 : window.innerWidth < 1024 ? 48 : 64;
            return -(hTrack.current!.scrollWidth - window.innerWidth + pad);
          },
          ease: "none",
          scrollTrigger: {
            trigger: hScroll.current,
            pin: true,
            scrub: 1,
            end: () => "+=" + hTrack.current!.scrollWidth,
            invalidateOnRefresh: true,
          },
        });
      }
      gsap.utils.toArray<HTMLElement>("[data-line]").forEach((el) =>
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", end: "top 50%", scrub: true },
          },
        ),
      );
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) =>
        gsap.to(el, {
          yPercent: Number(el.dataset["parallax"]),
          ease: "none",
          scrollTrigger: { trigger: el, scrub: true },
        }),
      );
      gsap.fromTo(
        "[data-project]",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: "#projetos", start: "top 75%" },
        },
      );
    });
    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.removeEventListener("mousemove", onMove);
    };
  }, [mx, my]);

  return (
    <main className="noise relative">
      <Intro />
      <Cursor />
      <Nav />

      {/* HERO */}
      <section
        id="inicio"
        ref={heroRef}
        className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 sm:px-6"
      >
        <motion.div
          style={{ x: gridX, y: gridY }}
          className="grid-bg absolute -inset-10 mask-[radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        />
        <motion.div
          style={{ y: foxY, scale: foxScale, rotateX: foxRX, rotateY: foxRY, opacity: fade }}
          className="absolute perspective-[1000px]"
        >
          <div className="relative h-[70vmin] max-h-125 w-[70vmin] max-w-125">
            <img
              src={fox}
              alt="Raposa geométrica com runas"
              width={1024}
              height={1024}
              className="h-full w-full mask-[radial-gradient(circle,black_45%,transparent_70%)] object-contain opacity-50 mix-blend-screen"
            />
            <div className="border-primary/20 absolute inset-[-8%] animate-[spin-slow_60s_linear_infinite] rounded-full border border-dashed" />
            <div className="border-primary/10 absolute inset-[-16%] animate-[spin-slow_90s_linear_infinite_reverse] rounded-full border" />
          </div>
        </motion.div>
        <div className="scanlines absolute inset-0 opacity-40" />
        <motion.div
          style={{ y: titleY, opacity: fade }}
          className="relative z-10 w-full max-w-4xl px-2 text-center sm:px-6"
        >
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 1.2 }}
            className="text-primary mb-4 font-mono text-[11px] tracking-widest uppercase sm:mb-6 sm:text-xs sm:tracking-[0.35em] md:tracking-[0.5em]"
          >
            ᛋ // full-stack developer // ᛋ
          </motion.p>
          <h1
            className="font-display animate-[flicker_6s_infinite] text-4xl leading-none font-black tracking-tight uppercase min-[400px]:text-5xl sm:text-7xl md:text-8xl"
            data-cursor="text"
          >
            <RuneText text="Samuel" delay={2600} speed={110} />
            <br />
            <RuneText
              text="Barbosa"
              delay={3200}
              speed={110}
              className="text-transparent [-webkit-text-stroke:1px_var(--primary)]"
            />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.2, duration: 1 }}
            className="text-muted-foreground mx-auto mt-6 max-w-md px-2 text-sm sm:mt-8 sm:text-base"
          >
            Criando experiências digitais na intersecção entre{" "}
            <span className="text-primary">estética</span>,{" "}
            <span className="text-primary">usabilidade</span> e{" "}
            <span className="text-primary">engenharia</span>.
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.6 }}
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 sm:bottom-8"
        >
          <span className="text-muted-foreground font-mono text-[10px] tracking-[0.4em] uppercase">
            scroll
          </span>
          <motion.div
            animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="bg-primary h-10 w-px sm:h-12"
          />
        </motion.div>
        <div className="text-primary/40 absolute top-1/2 left-4 hidden -translate-y-1/2 flex-col gap-3 font-mono text-xs md:flex lg:left-6">
          {"ᚠᚢᚦᚨᚱᚲ".split("").map((r) => (
            <span key={r}>{r}</span>
          ))}
        </div>
        <div className="text-muted-foreground absolute top-1/2 right-4 hidden -translate-y-1/2 font-mono text-[10px] tracking-[0.3em] uppercase [writing-mode:vertical-rl] md:block lg:right-6">
          Fortaleza — BR · 2026
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-primary/30 bg-primary relative -rotate-2 overflow-hidden border-y py-3 sm:py-4">
        <div className="flex w-max animate-[marquee_25s_linear_infinite]">
          {Array.from({ length: 3 }).map((_, k) => (
            <div
              key={k}
              className="font-display text-primary-foreground flex shrink-0 items-center gap-6 pr-6 text-lg font-black uppercase sm:gap-8 sm:pr-8 sm:text-xl md:text-2xl"
            >
              {[
                "Frontend",
                "ᚠ",
                "Backend",
                "ᛒ",
                "APIs",
                "ᚨ",
                "Banco de Dados",
                "ᛞ",
                "CI/CD",
                "ᚲ",
                "UX / UI",
                "ᚢ",
              ].map((w, i) => (
                <span key={i}>{w}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* SOBRE */}
      <section
        id="sobre"
        className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-20 sm:gap-12 sm:px-6 sm:py-24 md:grid-cols-[1fr_1.4fr] md:gap-16 md:py-32"
      >
        <div
          data-parallax="-30"
          className="font-display text-primary/5 pointer-events-none absolute top-20 -left-6 overflow-hidden text-[12rem] leading-none font-black select-none sm:-left-10 sm:text-[16rem] md:text-[20rem]"
        >
          ᛊ
        </div>
        <div className="relative">
          <p className="text-primary mb-3 font-mono text-xs tracking-[0.3em] uppercase sm:mb-4">
            01 — Sobre
          </p>
          <h2 className="font-display text-3xl leading-tight font-bold uppercase sm:text-4xl md:text-5xl">
            <RuneText text="Código com alma" />
          </h2>
          <div
            data-line
            className="from-primary mt-4 h-px w-full origin-left bg-linear-to-r to-transparent sm:mt-6"
          />
          <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-4">
            {[
              ["∞", "Curiosidade"],
              ["Full", "Stack"],
              ["CC", "Graduando"],
            ].map(([a, b]) => (
              <TiltCard key={b} className="border-border bg-card border p-2.5 text-center sm:p-4">
                <div className="font-display text-primary text-glow text-xl font-bold sm:text-2xl">
                  {a}
                </div>
                <div className="text-muted-foreground mt-1 truncate font-mono text-[9px] tracking-wider uppercase sm:text-[10px] sm:tracking-widest">
                  {b}
                </div>
              </TiltCard>
            ))}
          </div>
          <Avatar />
        </div>
        <div className="text-muted-foreground relative space-y-4 text-base leading-relaxed sm:space-y-6 sm:text-lg">
          <p className="text-foreground text-xl font-medium sm:text-2xl">
            <WordsReveal text="Sou Samuel Barbosa, graduando em Ciência da Computação e desenvolvedor full-stack em formação, apaixonado por criar experiências digitais modernas e visualmente envolventes." />
          </p>
          <p>
            <WordsReveal text="Trabalho em toda a pilha de desenvolvimento — de interfaces frontend intuitivas a sistemas backend robustos, APIs e arquiteturas de banco de dados." />
          </p>
          <p>
            <WordsReveal text="Sigo boas práticas como controle de versão, fluxos ágeis e pipelines de CI/CD para entregar soluções sustentáveis e de alto desempenho." />
          </p>
          <motion.blockquote
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="border-primary font-display text-primary text-glow border-l-2 pl-4 text-lg sm:pl-6 sm:text-xl"
          >
            "Grandes produtos nascem onde estética, usabilidade e engenharia se encontram."
          </motion.blockquote>
        </div>
      </section>

      {/* STACK (horizontal) */}
      <section
        id="stack"
        ref={hScroll}
        className="relative flex min-h-dvh flex-col justify-center overflow-hidden py-16 md:py-0"
      >
        <div className="mb-6 px-4 sm:mb-10 sm:px-8 md:px-16">
          <p className="text-primary mb-3 font-mono text-xs tracking-[0.3em] uppercase sm:mb-4">
            02 — Arsenal
          </p>
          <h2 className="font-display text-3xl font-bold uppercase sm:text-4xl md:text-6xl">
            <RuneText text="Minhas runas" />
          </h2>
        </div>
        <div ref={hTrack} className="flex gap-4 pl-4 sm:gap-6 sm:pl-8 md:gap-8 md:pl-16">
          {stack.map((s, i) => (
            <TiltCard
              key={s.g}
              className="border-border bg-card/60 flex min-h-95 w-[84vw] shrink-0 flex-col justify-between border p-5 backdrop-blur [clip-path:polygon(16px_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%,0_16px)] sm:min-h-105 sm:w-[60vw] sm:p-7 sm:[clip-path:polygon(24px_0,100%_0,100%_calc(100%-24px),calc(100%-24px)_100%,0_100%,0_24px)] md:h-[52vh] md:w-[38vw] md:p-8 lg:w-[32vw]"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-muted-foreground font-mono text-xs">0{i + 1}</span>
                  <span className="font-display text-primary/80 text-glow text-5xl leading-none sm:text-6xl md:text-7xl">
                    {s.r}
                  </span>
                </div>
                <h3
                  className="font-display mt-4 text-2xl font-bold uppercase sm:mt-6 sm:text-3xl"
                  data-cursor="link"
                  data-cursor-label="ver"
                >
                  <Scramble text={s.g} />
                </h3>
              </div>
              <ul className="mt-4 space-y-2.5 sm:mt-6 sm:space-y-3">
                {s.items.map((it) => (
                  <li
                    key={it}
                    className="text-muted-foreground hover:text-primary flex items-center gap-2.5 font-mono text-xs transition-colors sm:gap-3 sm:text-sm"
                  >
                    <span className="bg-primary h-px w-4 shrink-0 sm:w-6" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </TiltCard>
          ))}
          <div className="w-4 shrink-0 sm:w-8" />
        </div>
      </section>

      {/* PROJETOS */}
      <section
        id="projetos"
        className="relative mx-auto min-h-screen max-w-6xl px-4 py-20 perspective-distant sm:px-6 sm:py-24 md:py-32"
      >
        <p className="text-primary mb-3 font-mono text-xs tracking-[0.3em] uppercase sm:mb-4">
          03 — Sagas
        </p>
        <h2 className="font-display mb-10 text-3xl font-bold uppercase sm:mb-16 sm:text-4xl md:text-6xl">
          <RuneText text="Projetos" />
        </h2>
        <div className="space-y-px">
          {projects.map((p, i) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              data-project
              data-cursor="link"
              data-cursor-label="abrir"
              className="group border-border relative flex flex-col gap-3 overflow-hidden border-t py-6 sm:gap-4 sm:py-8 md:grid md:grid-cols-[60px_1.2fr_1.5fr_auto] md:items-center md:py-10"
            >
              <div className="bg-primary/5 absolute inset-0 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
              <div className="relative flex items-center justify-between md:block">
                <span className="text-primary font-mono text-xs font-semibold sm:text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-muted-foreground border-border border px-1.5 py-0.5 font-mono text-[10px] uppercase md:hidden">
                  Ver ↗
                </span>
              </div>
              <h3 className="font-display relative text-2xl font-bold uppercase transition-transform duration-500 group-hover:translate-x-2 sm:text-3xl md:group-hover:translate-x-4">
                <Scramble text={p.title} />
              </h3>
              <p className="text-muted-foreground relative text-sm sm:text-base">{p.description}</p>
              <div className="relative flex flex-wrap gap-1.5 pt-1 sm:gap-2 md:pt-0">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="border-border text-muted-foreground group-hover:border-primary group-hover:text-primary border px-2 py-0.5 font-mono text-[10px] uppercase transition-colors sm:py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
          <div className="border-border border-t" />
        </div>
      </section>

      {/* CONTATO */}
      <section
        id="contato"
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-20 text-center sm:px-6"
      >
        <div className="grid-bg pointer-events-none absolute inset-0 mask-[radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div
          data-parallax="40"
          className="border-primary/20 pointer-events-none absolute h-[60vmin] w-[60vmin] rounded-full border"
        />
        <div
          data-parallax="-20"
          className="border-primary/10 pointer-events-none absolute h-[80vmin] w-[80vmin] rotate-45 border"
        />
        <p className="text-primary relative mb-4 font-mono text-xs tracking-[0.3em] uppercase sm:mb-6">
          04 — Contato
        </p>
        <h2 className="font-display relative text-3xl leading-none font-black uppercase min-[400px]:text-4xl sm:text-6xl md:text-8xl">
          <RuneText text="Vamos criar" />
          <br />
          <RuneText
            text="algo épico"
            delay={600}
            className="text-primary text-glow"
            runeClass="text-foreground/60"
          />
        </h2>
        <p className="text-muted-foreground relative mt-6 max-w-md px-2 text-sm sm:mt-8 sm:text-base">
          <WordsReveal text="Transformando ideias em soluções digitais impactantes. Me chame para conversar." />
        </p>
        <div className="relative mt-8 flex w-full max-w-md flex-col flex-wrap items-stretch justify-center gap-3 sm:mt-12 sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
          <Magnetic className="w-full sm:w-auto">
            <a
              href="mailto:samuelmbarbosa1107@gmail.com"
              className="border-primary bg-primary text-primary-foreground shadow-glow hover:text-primary block w-full border px-6 py-3.5 text-center font-mono text-xs tracking-widest uppercase transition-colors hover:bg-transparent sm:w-auto sm:px-8 sm:py-4 sm:text-sm"
            >
              <Scramble text="Enviar e-mail" runeClass="opacity-60" />
            </a>
          </Magnetic>
          {[
            ["GitHub", "https://github.com/SamuelBarbosa11"],
            ["LinkedIn", "https://www.linkedin.com/in/samuel-miguel-barbosa/"],
          ].map(([s, h]) => (
            <Magnetic key={s} className="w-full sm:w-auto">
              <a
                href={h}
                target="_blank"
                rel="noreferrer"
                className="border-border hover:border-primary hover:text-primary block w-full border px-6 py-3.5 text-center font-mono text-xs tracking-widest uppercase transition-colors sm:w-auto sm:px-8 sm:py-4 sm:text-sm"
              >
                <Scramble text={s!} />
              </a>
            </Magnetic>
          ))}
        </div>
        <footer className="text-muted-foreground relative mt-16 px-4 font-mono text-[9px] tracking-[0.2em] uppercase sm:absolute sm:bottom-6 sm:text-[10px] sm:tracking-[0.3em]">
          ᛋᚨᛗᚢᛖᛚ · © 2026 Samuel Barbosa
        </footer>
      </section>
    </main>
  );
}
