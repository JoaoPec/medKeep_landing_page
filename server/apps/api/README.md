# API Nest (MedKeep)

Monorepo `server`: expõe HTTP e (futuro) acopla a **Postgres**, **Mongo** e **filas Redis** apontadas em `server/.env`.

## Scripts

Na pasta `server`:

```bash
pnpm install          # apenas instala workspaces JS (Nest)
pnpm dev:api          # modo watch na porta API_PORT (.env), default 4000
pnpm build:api
pnpm start:api
```

Variáveis: copiar `server/.env.example` → `server/.env`.

## NestJS

Este projeto foi gerado de forma mínima (sem `nest new` interativo). `ConfigModule` procura `.env` em `.`, `..` e `../..` para funcionar quer corras a partir de `server/` quer de `apps/api/`.
