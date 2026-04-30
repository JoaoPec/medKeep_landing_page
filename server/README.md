# medKeep — `server` (monorepo backend)

Monorepo **dentro de `server/`** com:

| Pasta | Stack | Papel |
|-------|--------|--------|
| `apps/api` | **NestJS** | API HTTP, regras de domínio, produtores/consumidores de fila (ex.: BullMQ + Redis) |
| `apps/bot` | **FastAPI** | Bot / worker leve, consumo de fila (Redis streams, listas ou futuro broker) |
| `infra/` | **Docker Compose** | Postgres, MongoDB, Redis, PgAdmin |

**Comunicação neste desenho:** Nest e o bot **não** precisam de HTTP entre si para tudo; o alvo é **mensagens assíncronas** (filas) — **Redis** já está na infra para BullMQ (lado Nest) e clientes Redis (lado Python). Evoluções comuns: **RabbitMQ**, **SQS**, etc.

## Pré-requisitos

- **Node.js** ≥ 20 e **pnpm** (igual ao resto do repo; em `server/package.json` há `packageManager`).
- **Docker** + **Docker Compose** para subir a infra.
- **Python** ≥ 3.11 para o bot (`apps/bot`).

## Infra (Postgres, Mongo, Redis, PgAdmin)

Na pasta **`server/`**:

1. Copia variáveis: `cp .env.example .env` (ajusta passwords em produção).
2. Sobe os serviços:

```bash
pnpm infra:up
# ou
docker compose -f infra/docker-compose.yml up -d
```

### Endpoints úteis (host)

- **Postgres:** `localhost:5432` — user/db default `medkeep` / password `medkeep_dev` (dev only).
- **MongoDB:** `mongodb://medkeep:medkeep_dev@localhost:<MONGO_PORT>/medkeep?authSource=admin` (`MONGO_PORT` no `.env`, default `27017`)
- **Redis:** `localhost:6379`
- **PgAdmin:** `http://localhost:5050` — email `admin@medkeep.local`, password `admin` (definidos em `.env.example`).

No PgAdmin, ao registar o servidor PostgreSQL, usa **Host** `host.docker.internal` (macOS/Windows) ou o IP da bridge Docker no Linux; **Port** `5432`, user/password como em `.env`.

Parar / ver logs:

```bash
pnpm infra:down
pnpm infra:logs
```

Cuidado: `pnpm infra:reset` apaga **volumes** (dados locais).

### Porta ocupada (`port is already allocated`)

Se aparecer erro ao subir o **Mongo** em **27017** (ou Redis/Postgres nos respectivos binds), já tens outro serviço a usar essa porta (ex.: Mongo instalado no macOS ou outro contentor).

1. **Ver quem usa a porta** (macOS/Linux): `lsof -i :27017` ou no Docker Desktop para o que estiver a publicar essa porta.
2. **Ou** em `server/.env`, define por exemplo `MONGO_PORT=27018` e ajusta `MONGO_URI` para `mongodb://medkeep:medkeep_dev@localhost:27018/medkeep?authSource=admin`.
3. Na pasta `server/`: `docker compose -f infra/docker-compose.yml up -d` (ou `make infra-up` na raiz).

Se ficou um contentor a meio: `pnpm infra-down` e volta a subir depois de corrigires.

## NestJS — `apps/api`

```bash
cd server
pnpm install
pnpm dev:api
```

- Base URL: `http://localhost:4000` (ou `API_PORT` no `.env`).
- `GET /health` — health check.

## FastAPI — `apps/bot`

```bash
cd server/apps/bot
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- `GET /health` — health check.

## Layout

```
server/
├── apps/
│   ├── api/          # NestJS (workspace pnpm)
│   └── bot/          # FastAPI (Python)
├── infra/
│   └── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── .env.example
└── README.md
```

## Próximos passos sugeridos

- Adicionar **BullMQ** na API Nest e um worker Python a consumir **Redis Streams** (ou pub/sub) com contratos partilhados (`@repo/types` no client ou um pacote `contracts` partilhado).
- **TypeORM** / **Prisma** no Nest para Postgres; driver **Motor** ou **Beanie** no bot para Mongo, conforme necessidade.
- Opcional: mover `docker-compose` para incluir **api** e **bot** como serviços após teres **Dockerfile** por app.
