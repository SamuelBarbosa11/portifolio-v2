# Portifolio v2 — Agent Notes

Este projeto usa **npm** e **Node.js** (≥ 20). Não use Bun, Yarn ou pnpm.

## Comandos principais

```sh
npm install      # instalar dependências
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção
npm test         # rodar testes
```

## Estrutura

- `src/routes/` — rotas TanStack Router (file-based)
- `src/components/portfolio/` — componentes principais do portfólio
- `src/lib/` — utilitários compartilhados
- `src/data/` — dados estáticos (projetos, etc.)
- `vite.config.ts` — configuração Vite (TanStack Start + Tailwind)
