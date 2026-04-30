# medKeep — monorepo (Turborepo + pnpm)

> **Onde estou?** No repositório Git, este monorepo fica na pasta **`client/`**. A partir daqui, “raiz” = pasta `client/` (é aqui que corres `pnpm install` e `pnpm dev`).

Este projeto é um **monorepo**: vários pacotes (aplicações e bibliotecas) vivem no **mesmo Git**, com dependências ligadas localmente em vez de publicar pacotes no npm para desenvolvimento.

## O que é um monorepo?

- **Um repo** contém **vários projetos** (`apps/*`) e **código partilhado** (`packages/*`).
- **Um lockfile** (`pnpm-lock.yaml`) e **instalação única** na raiz (`pnpm install`).
- **Partilha de tipos, UI e config** sem copiar ficheiros entre repos.

## O que é o Turborepo?

O **Turborepo** **não** é o gestor de dependências — isso é o **pnpm workspaces**. O Turbo **corre e orquestra tarefas** em paralelo (`build`, `dev`, `lint`) e **guarda cache** dos resultados, para comandos seguintes serem mais rápidos.

Na pasta **`client/`**, comandos típicos:

```bash
pnpm install          # instala tudo (workspace)
pnpm dev             # turbo run dev — sobe o que cada app definir como "dev"
pnpm build           # turbo run build
pnpm lint            # turbo run lint
```

Para trabalhar **só na app web**:

```bash
cd apps/web
pnpm dev             # Next.js com Turbopack
pnpm build
pnpm lint             # ESLint via next lint
```

## Requisitos

- **Node.js** (LTS recomendado)
- **pnpm** — a versão do projeto está em `packageManager` em **`client/package.json`**; usar `corepack enable` e `corepack prepare` se necessário.

## Como correr localmente

A partir da **raiz do repositório Git** (pasta que contém `client/` e `server/`):

```bash
cd client
pnpm install
pnpm dev
```

Isto usa o **`turbo.json`**: todas as apps com script `dev` podem iniciar em paralelo. Hoje a app principal está em **`apps/web`**.

Se só quiseres o Next (a partir de **`client/`**):

```bash
pnpm exec turbo run dev --filter=web
# ou
cd apps/web && pnpm dev
```

Para **produção** (build de `apps/web`):

```bash
pnpm exec turbo run build --filter=web
cd apps/web && pnpm start
```

## Visão da arquitetura

```
medkeep/client/    # monorepo frontend
├── apps/
│   └── web/               # Frontend Next.js (landing)
├── packages/
│   ├── eslint-config/     # ESLint partilhado (@repo/eslint-config)
│   ├── styles/            # CSS tokens e temas (@repo/styles)
│   ├── tailwind-config/   # Preset Tailwind (@repo/tailwind-config)
│   ├── typescript-config/ # tsconfigs base (@repo/typescript-config)
│   ├── types/             # Tipos/DTOs partilhados (@repo/types)
│   ├── ui/                # Componentes React (@repo/ui)
│   └── utils/             # Funções helper (@repo/utils)
├── pnpm-workspace.yaml    # define apps/* e packages/*
├── turbo.json             # pipelines e cache
└── package.json           # scripts e dependências à raiz
```

- **`apps/web`**: aplicação Next.js (rotas em `apps/web/app`, componentes específicos em `apps/web/components`).
- **`packages/*`**: bibliotecas consumidas pelas apps com `workspace:*` no `package.json`.
- **`@repo/`** é o prefixo npm dos pacotes internos — importas como `@repo/ui`, `@repo/utils`, etc.

## Usar código partilhado

Nas dependências da app já estão referências do tipo `@repo/ui`: `workspace:*`. Depois importas por nome do pacote:

```ts
import { Button, Container } from "@repo/ui";
import { formatDate } from "@repo/utils";
import type { ApiErrorPayload } from "@repo/types";
```

No CSS global da app, os tokens partilhados:

```css
@import "@repo/styles/tokens.css";
@import "@repo/styles/themes.css";
```

O preset Tailwind vem de `@repo/tailwind-config` no `tailwind.config.mjs` da app.

## Adicionar componentes partilhados (`@repo/ui`)

1. Cria ou edita ficheiros em **`packages/ui/src/`** (ex.: `Card.tsx`).
2. Exporta em **`packages/ui/src/index.ts`**.
3. Garante que **`apps/web/next.config.ts`** tem `transpilePackages: ["@repo/ui"]` (já configurado).
4. Garante que o **`tailwind.config.mjs`** da app inclui o path do UI em **`content`**, para o Tailwind gerar classes usadas no pacote (já está `../../packages/ui/src/...`).

Usa o helper **`cn()`** de `@repo/ui` para juntar classes sem conflitos (`clsx` + `tailwind-merge`).

## Adicionar tipos ou utilitários

- **Tipos/DTOs:** `packages/types/src/` e export em `index.ts`.
- **Helpers:** `packages/utils/src/` e export em `index.ts`.

Cada pacote tem `tsconfig` que estende `@repo/typescript-config/library.json` (ou `react-library.json` para UI).

## Adicionar um novo frontend (outra app)

1. Cria uma pasta **`apps/<nome-da-app>/`** (ex.: `apps/admin`, `apps/docs`).
2. Inicializa com **`package.json`** próprio (`name`: ex. `admin`, `private: true`).
3. O **`pnpm-workspace.yaml`** já inclui `apps/*` — corre `pnpm install` na raiz para ligar dependências.
4. Adiciona **`@repo/ui`**, `@repo/types`, etc. com `"@repo/ui": "workspace:*"` (e os restantes pacotes que precisares).
5. Se for **Next.js + `@repo/ui`**:
   - `transpilePackages: ["@repo/ui"]` no `next.config`;
   - no `tailwind.config`, inclui `../../packages/ui/src/**/*.{ts,tsx}` em `content` e o preset `@repo/tailwind-config` se quiseres o mesmo design system.
6. Opcional: ajusta **`turbo.json`** ou filtros se quiseres pipelines específicos; por defeito `turbo run dev` corre `dev` em todas as apps que o definirem.

Assim podes ter **vários frontends** (landing, admin, site de docs) a partilhar **UI, tipos e estilos** sem duplicar.

## Nota sobre pnpm e ESLint

Existe um **`.npmrc`** em **`client/`** com hoisting do pacote **`resolve`** — necessário para o **ESLint / `eslint-plugin-react`** funcionar bem com layouts isolados do pnpm. Mantém esse ficheiro no repo ao clonar numa máquina nova.
