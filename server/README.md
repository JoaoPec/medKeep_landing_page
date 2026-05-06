# medKeep — `server` (monorepo backend)

Monorepo **dentro de `server/`** com:

| Pasta | Stack | Papel |
|-------|--------|--------|
| `apps/api` | **NestJS** | API interna — regras de domínio, produtores/consumidores de fila (BullMQ + Redis) |
| `apps/api-public` | **NestJS** | API pública — endpoints expostos ao cliente web/mobile |
| `apps/bot` | **FastAPI** | Bot / worker leve, consumo de fila (Redis streams) |
| `libs/common` | **TypeScript** | Tipos e utilitários partilhados entre as APIs Nest (`@medkeep/common`) |
| `infra/` | **Docker Compose** | Postgres, MongoDB, Redis, PgAdmin |

**Comunicação:** As APIs Nest partilham código via `@medkeep/common` (workspace pnpm). Para dados em runtime, o alvo é **mensagens assíncronas** (filas via Redis/BullMQ) — as APIs são processos separados em produção.

## Modelo multi-tenant (Nest + FastAPI)

O domínio principal roda no Nest (`apps/api`) e usa um modelo multi-tenant em Postgres:

- `Tenant`: organização (tenant lógico do SaaS).
- `User`: utilizador do tenant com coluna polimórfica `kind` (`owner`, `admin`, `manager`, `member`).
- `UserAiAgentProfile`: extensão 1:1 do utilizador para configurações do chatbot (JSONB em `settings`).

Esse desenho evita espalhar várias FKs por tipo de utilizador. O `User.kind` define o tipo e o `UserAiAgentProfile` concentra a configuração de IA por utilizador.

Fluxo recomendado:

- `apps/api`: persiste utilizadores, tenant, perfil do agente e regras de negócio (pagamentos e afins).
- `apps/bot`: executa o runtime do chatbot usando as configurações salvas no Nest (via fila Redis ou API interna).

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

Se aparecer erro ao subir o **Mongo** em **27017** (ou Redis/Postgres nos respectivos binds), já tens outro serviço a usar essa porta.

1. **Ver quem usa a porta** (macOS/Linux): `lsof -i :27017`.
2. **Ou** em `server/.env`, define por exemplo `MONGO_PORT=27018` e ajusta `MONGO_URI`.

## NestJS — `apps/api` (porta 4000)

```bash
cd server
pnpm install
pnpm dev:api
```

- Base URL: `http://localhost:4000` (ou `API_PORT` no `.env`).
- `GET /health` — health check.
- `GET /users/health-db` — valida integração `DatabaseModule` + entidades multi-tenant.

## NestJS — `apps/api-public` (porta 4001)

```bash
cd server
pnpm dev:api-public
```

- Base URL: `http://localhost:4001` (ou `API_PUBLIC_PORT` no `.env`).
- `GET /health` — health check.

Para subir as duas APIs em paralelo:

```bash
pnpm dev
```

## FastAPI — `apps/bot`

```bash
cd server/apps/bot
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- `GET /health` — health check.

## Lib partilhada — `libs/common`

Pacote `@medkeep/common` com módulos transversais às APIs Nest:

| Módulo | Exporta |
|--------|---------|
| `database/*` | `DatabaseModule`, repositórios, decoradores e entidades (`Tenant`, `User`, `UserAiAgentProfile`) |
| `database/enums` | `TenantStatus`, `UserKind`, `RoleCode`, `UserRole` |
| `validation/*` | queries e validações reutilizáveis (ex.: `PaginationParamsQuery`) |
| `types/api-response.types` | `ApiResponse<T>`, `ApiErrorResponse` |
| `types/pagination.types` | `PaginatedResult<T>`, `PaginationQuery` |
| `types/health.types` | `HealthCheckResult` |

Para adicionar ao `package.json` de uma nova app:

```json
"@medkeep/common": "workspace:*"
```

E no `tsconfig.json` da app, em `compilerOptions.paths`:

```json
"@medkeep/common": ["../../libs/common/src/index.ts"],
"@medkeep/common/*": ["../../libs/common/src/*"],
"@app/common": ["../../libs/common/src/index.ts"],
"@app/common/*": ["../../libs/common/src/*"]
```

> **Build de produção:** para `nest build` funcionar com a lib, compila-a primeiro:
> `pnpm build:common && pnpm build:api`
> O script `pnpm build` na raiz de `server/` já faz isso automaticamente para todas as apps.

## Adicionar uma nova API Nest

1. Cria `server/apps/<nome>/` com a mesma estrutura de `apps/api-public` (copia e ajusta `name` e porta).
2. Adiciona `"@medkeep/common": "workspace:*"` ao `package.json` da nova app.
3. Copia o bloco `paths` do `tsconfig.json` de `apps/api-public`.
4. Adiciona os scripts no `server/package.json` raiz (`dev:<nome>`, `build:<nome>`, etc.).
5. A nova app aparece automaticamente no workspace pnpm (o glob `apps/*` já cobre).

## Layout

```
server/
├── apps/
│   ├── api/             # NestJS — API interna (porta 4000)
│   ├── api-public/      # NestJS — API pública  (porta 4001)
│   └── bot/             # FastAPI (Python)
├── libs/
│   └── common/          # @medkeep/common — tipos e utilitários TS partilhados
├── infra/
│   └── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── .env.example
└── README.md
```

## Próximos passos sugeridos

- **TypeORM / Prisma** no Nest para Postgres; separar schemas por bounded context.
- **BullMQ** nos módulos de domínio e workers Python a consumir **Redis Streams**.
- Adicionar `libs/auth` se a lógica de autenticação for partilhada entre as APIs.
- Mover `docker-compose` para incluir **api** e **api-public** como serviços após teres Dockerfiles por app.
