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
          x: () => -(hTrack.current!.scrollWidth - innerWidth + 64),
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
        { y: 120, opacity: 0, rotateX: -25 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: "#projetos", start: "top 60%" },
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
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        <motion.div
          style={{ x: gridX, y: gridY }}
          className="absolute -inset-10 grid-bg [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        />
        <motion.div
          style={{ y: foxY, scale: foxScale, rotateX: foxRX, rotateY: foxRY, opacity: fade }}
          className="absolute [perspective:1000px]"
        >
          <div className="relative h-[70vmin] w-[70vmin]">
            <img
              src={fox}
              alt="Raposa geométrica com runas"
              width={1024}
              height={1024}
              className="h-full w-full object-contain opacity-50 mix-blend-screen [mask-image:radial-gradient(circle,black_45%,transparent_70%)]"
            />
            <div className="absolute inset-[-8%] rounded-full border border-dashed border-primary/20 [animation:spin-slow_60s_linear_infinite]" />
            <div className="absolute inset-[-16%] rounded-full border border-primary/10 [animation:spin-slow_90s_linear_infinite_reverse]" />
          </div>
        </motion.div>
        <div className="absolute inset-0 scanlines opacity-40" />
        <motion.div style={{ y: titleY, opacity: fade }} className="relative z-10 px-6 text-center">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "1em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ delay: 2.8, duration: 1.2 }}
            className="mb-6 font-mono text-xs uppercase text-primary"
          >
            ᛋ // full-stack developer // ᛋ
          </motion.p>
          <h1
            className="font-display text-5xl font-black uppercase leading-none tracking-tight sm:text-7xl md:text-8xl [animation:flicker_6s_infinite]"
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
            className="mx-auto mt-8 max-w-md text-muted-foreground"
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
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            scroll
          </span>
          <motion.div
            animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="h-12 w-px bg-primary"
          />
        </motion.div>
        <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 font-mono text-xs text-primary/40 md:flex">
          {"ᚠᚢᚦᚨᚱᚲ".split("").map((r) => (
            <span key={r}>{r}</span>
          ))}
        </div>
        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground [writing-mode:vertical-rl] md:block">
          Fortaleza — BR · 2026
        </div>
      </section>

      {/* MARQUEE */}
      <div className="relative -rotate-2 border-y border-primary/30 bg-primary py-4">
        <div className="flex w-max [animation:marquee_25s_linear_infinite]">
          {Array.from({ length: 2 }).map((_, k) => (
            <div
              key={k}
              className="flex shrink-0 items-center gap-8 pr-8 font-display text-2xl font-black uppercase text-primary-foreground"
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
        className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-16 px-6 py-32 md:grid-cols-[1fr_1.4fr]"
      >
        <div
          data-parallax="-30"
          className="pointer-events-none absolute -left-10 top-20 select-none font-display text-[20rem] font-black leading-none text-primary/5"
        >
          ᛊ
        </div>
        <div className="relative">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary">
            01 — Sobre
          </p>
          <h2 className="font-display text-4xl font-bold uppercase leading-tight md:text-5xl">
            <RuneText text="Código com alma" />
          </h2>
          <div
            data-line
            className="mt-6 h-px w-full origin-left bg-gradient-to-r from-primary to-transparent"
          />
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              ["∞", "Curiosidade"],
              ["Full", "Stack"],
              ["CC", "Graduando"],
            ].map(([a, b]) => (
              <TiltCard key={b} className="border border-border bg-card p-4 text-center">
                <div className="font-display text-2xl font-bold text-primary text-glow">{a}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {b}
                </div>
              </TiltCard>
            ))}
          </div>
          <Avatar />
        </div>
        <div className="relative space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p className="text-2xl text-foreground">
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
            className="border-l-2 border-primary pl-6 font-display text-xl text-primary text-glow"
          >
            "Grandes produtos nascem onde estética, usabilidade e engenharia se encontram."
          </motion.blockquote>
        </div>
      </section>

      {/* STACK (horizontal) */}
      <section
        id="stack"
        ref={hScroll}
        className="relative flex h-screen flex-col justify-center overflow-hidden"
      >
        <div className="mb-10 px-8 md:px-16">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary">
            02 — Arsenal
          </p>
          <h2 className="font-display text-4xl font-bold uppercase md:text-6xl">
            <RuneText text="Minhas runas" />
          </h2>
        </div>
        <div ref={hTrack} className="flex gap-8 pl-8 md:pl-16">
          {stack.map((s, i) => (
            <TiltCard
              key={s.g}
              className="h-[50vh] w-[80vw] shrink-0 border border-border bg-card/60 p-8 backdrop-blur md:w-[38vw] [clip-path:polygon(24px_0,100%_0,100%_calc(100%-24px),calc(100%-24px)_100%,0_100%,0_24px)]"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                <span className="font-display text-7xl text-primary/80 text-glow">{s.r}</span>
              </div>
              <h3
                className="mt-6 font-display text-3xl font-bold uppercase"
                data-cursor="link"
                data-cursor-label="ver"
              >
                <Scramble text={s.g} />
              </h3>
              <ul className="mt-6 space-y-3">
                {s.items.map((it) => (
                  <li
                    key={it}
                    className="flex items-center gap-3 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <span className="h-px w-6 bg-primary" />
                    {it}
                  </li>
                ))}
              </ul>
            </TiltCard>
          ))}
          <div className="w-8 shrink-0" />
        </div>
      </section>

      {/* PROJETOS */}
      <section
        id="projetos"
        className="relative mx-auto min-h-screen max-w-6xl px-6 py-32 [perspective:1200px]"
      >
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary">03 — Sagas</p>
        <h2 className="mb-16 font-display text-4xl font-bold uppercase md:text-6xl">
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
              className="group relative grid items-center gap-4 overflow-hidden border-t border-border py-10 md:grid-cols-[80px_1fr_1fr_auto]"
            >
              <div className="absolute inset-0 origin-left scale-x-0 bg-primary/5 transition-transform duration-500 group-hover:scale-x-100" />
              <span className="relative font-mono text-sm text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="relative font-display text-3xl font-bold uppercase transition-transform duration-500 group-hover:translate-x-4 md:text-4xl">
                <Scramble text={p.title} />
              </h3>
              <p className="relative text-muted-foreground">{p.description}</p>
              <div className="relative flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="border border-border px-2 py-1 font-mono text-[10px] uppercase text-muted-foreground group-hover:border-primary group-hover:text-primary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
          <div className="border-t border-border" />
        </div>
      </section>

      {/* CONTATO */}
      <section
        id="contato"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
      >
        <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div
          data-parallax="40"
          className="absolute h-[60vmin] w-[60vmin] rounded-full border border-primary/20"
        />
        <div
          data-parallax="-20"
          className="absolute h-[80vmin] w-[80vmin] rotate-45 border border-primary/10"
        />
        <p className="relative mb-6 font-mono text-xs uppercase tracking-[0.3em] text-primary">
          04 — Contato
        </p>
        <h2 className="relative font-display text-5xl font-black uppercase leading-none md:text-8xl">
          <RuneText text="Vamos criar" />
          <br />
          <RuneText
            text="algo épico"
            delay={600}
            className="text-primary text-glow"
            runeClass="text-foreground/60"
          />
        </h2>
        <p className="relative mt-8 max-w-md text-muted-foreground">
          <WordsReveal text="Transformando ideias em soluções digitais impactantes. Me chame para conversar." />
        </p>
        <div className="relative mt-12 flex flex-wrap justify-center gap-4">
          <Magnetic>
            <a
              href="mailto:samuelmbarbosa1107@gmail.com"
              className="block border border-primary bg-primary px-8 py-4 font-mono text-sm uppercase tracking-widest text-primary-foreground shadow-glow transition-colors hover:bg-transparent hover:text-primary"
            >
              <Scramble text="Enviar e-mail" runeClass="opacity-60" />
            </a>
          </Magnetic>
          {[
            ["GitHub", "https://github.com/SamuelBarbosa11"],
            ["LinkedIn", "https://www.linkedin.com/in/samuel-miguel-barbosa/"],
          ].map(([s, h]) => (
            <Magnetic key={s}>
              <a
                href={h}
                target="_blank"
                rel="noreferrer"
                className="block border border-border px-8 py-4 font-mono text-sm uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
              >
                <Scramble text={s!} />
              </a>
            </Magnetic>
          ))}
        </div>
        <footer className="absolute bottom-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          ᛋᚨᛗᚢᛖᛚ · © 2026 Samuel Barbosa
        </footer>
      </section>
    </main>
  );
}
