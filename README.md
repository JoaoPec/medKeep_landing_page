# medKeep

Estrutura do repositório:

- **`client/`** — monorepo frontend (**pnpm**, **Turborepo**, **Next.js**). Toda a instalação e os scripts correm **a partir desta pasta**.
- **`server/`** — monorepo backend: **NestJS** (`apps/api`), **FastAPI** (`apps/bot`), Docker (**Postgres**, **Mongo**, **Redis**, **PgAdmin**) em `server/infra/`.

Para desenvolver o site:

```bash
cd client
pnpm install
pnpm dev
```

**Atalhos com Make** (na raiz do repo): `make help` — instalação (`make bootstrap`), infra Docker (`make infra-up`), `dev-client`, `dev-api`, `dev-bot`, builds e lints.

Documentação **backend** (`server/`): [`server/README.md`](server/README.md).

Documentação detalhada do monorepo **frontend**: [`client/README.md`](client/README.md).
