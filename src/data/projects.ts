/** Lista de projetos exibidos no portfólio. Edite aqui para adicionar, remover ou reordenar. */
export type Project = { title: string; description: string; url: string; tags: string[] };

export const projects: Project[] = [
  {
    title: "ReCircula",
    description: "Marketplace full-stack para anúncio de doação e venda de produtos no campus.",
    url: "https://recircula-marketplace.vercel.app/",
    tags: ["React", "Node / Express", "Supabase", "JWT"],
  },
  {
    title: "Portfólio Antigo",
    description: "Meu primeiro portfólio pessoal, ponto de partida da minha jornada.",
    url: "https://samuelbarbosadev.vercel.app/",
    tags: ["React", "Tailwind", "Firebase"],
  },
  {
    title: "Sorteador de Números",
    description: "Sorteador polido feito com JavaScript puro, sem frameworks.",
    url: "https://samuelbarbosa11.github.io/Sorteador-de-Numeros/",
    tags: ["HTML", "CSS", "JavaScript"],
  },
];
