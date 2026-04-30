.PHONY: default help bootstrap boostrap install install-client install-server \
	env-server env-example \
	build build-client build-server-api build-all \
	dev dev-client dev-web-only dev-api dev-bot tips \
	start-api-prod lint-client lint-api \
	infra-up infra-down infra-logs infra-ps infra-reset infra-restart \
	bot-venv bot-install \
	check

# ── Raíz do repo (Makefile na raíz)
ROOT    := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
CLIENT  := $(ROOT)/client
SERVER  := $(ROOT)/server
BOT     := $(SERVER)/apps/bot
# Portas configuráveis (sobrepor: make dev-web WEB_PORT=4000 não aplica ao Next; Next usa 3000)
WEB_PORT  ?= 3000
API_PORT  ?= 4000
BOT_PORT  ?= 8000

PNPM := pnpm
PYTHON := python3

default: help

## help        Mostra este painel
help:
	@echo ""
	@echo "medKeep — alvos Make (repo: $(ROOT))"
	@echo "========================================"
	@echo ""
	@echo "Setup"
	@echo "  make bootstrap      instala client + server + venv do bot + .env do server (se faltar)"
	@echo "                       (alias: make boostrap — typo comum)"
	@echo "  make install        só pnpm em client e server"
	@echo "  make bot-venv       cria .venv e pip install no bot"
	@echo "  make env-server     copia server/.env.example → server/.env (não sobrescreve)"
	@echo ""
	@echo "Desenvolvimento (cada um num terminal separado)"
	@echo "  make dev            lembretes multi-terminal + infra"
	@echo "  make dev-client     Next.js (Turborepo dev no client)"
	@echo "  make dev-web-only   só a app web (turbo --filter=web)"
	@echo "  make dev-api        NestJS em watch (server)"
	@echo "  make dev-bot        FastAPI/uvicorn (precisa make bot-venv ou Python com deps)"
	@echo ""
	@echo "Build / qualidade"
	@echo "  make build-all      client (turbo build) + nest build"
	@echo "  make build-client   turbo build no client"
	@echo "  make build-server-api  nest build"
	@echo "  make lint-client    turbo lint no client"
	@echo "  make lint-api       tsc --noEmit no Nest"
	@echo ""
	@echo "Infra (Docker — a partir de server/)"
	@echo "  make infra-up       sobe Postgres, Mongo, Redis, PgAdmin"
	@echo "  make infra-down     para serviços (mantém volumes)"
	@echo "  make infra-logs     segue logs"
	@echo "  make infra-ps       estado dos contentores"
	@echo "  make infra-reset CONFIRM_RESET=yes   apaga volumes Docker e recria tudo"
	@echo "  make infra-restart  down + up"
	@echo ""
	@echo "Produção local (API)"
	@echo "  make start-api-prod nest build + node dist (corre em server/apps/api)"
	@echo ""
	@echo "Utilitários"
	@echo "  make check          mostra versões de pnpm, node, docker, python"
	@echo "  make tips           lembretes de URLs e portas"
	@echo ""

## tips        URLs e portas usuais (dev)
tips:
	@echo "Client (Next):  http://localhost:3000"
	@echo "API (Nest):     http://localhost:$${API_PORT:-$(API_PORT)}"
	@echo "Bot (FastAPI):  http://localhost:$${BOT_PORT:-$(BOT_PORT)}/docs"
	@echo "PgAdmin:        http://localhost:$${PGADMIN_PORT:-5050}"
	@echo "Postgres/Mongo/Redis → ver server/.env.example"

## check       Versões de ferramentas
check:
	@echo "Node:    $$(node -v 2>/dev/null || echo 'n/a')"
	@echo "pnpm:    $$($(PNPM) -v 2>/dev/null || echo 'n/a')"
	@echo "Docker:  $$(docker -v 2>/dev/null || echo 'n/a')"
	@echo "Compose: $$(docker compose version 2>/dev/null | head -1 || echo 'n/a')"
	@echo "Python:  $$($(PYTHON) --version 2>/dev/null || echo 'n/a')"

## bootstrap   Instala tudo o que for Node + venv do bot + .env do server
bootstrap: env-server install bot-venv
	@echo ""
	@echo "✓ Bootstrap concluído. Próximos passos:"
	@echo "  1) make infra-up     (Docker)"
	@echo "  2) make dev-client   (terminal 1)"
	@echo "  3) make dev-api     (terminal 2)"
	@echo "  4) make dev-bot     (terminal 3, opcional)"
	@echo ""

boostrap: bootstrap

## install     pnpm install em client e server
install: install-client install-server

install-client:
	cd $(CLIENT) && $(PNPM) install

install-server:
	cd $(SERVER) && $(PNPM) install

## env-server  Cria server/.env a partir do exemplo (não sobrescreve)
env-server:
	@test -f $(SERVER)/.env && echo "server/.env já existe — mantido." || (cp $(SERVER)/.env.example $(SERVER)/.env && echo "Criado server/.env a partir de .env.example")

env-example:
	@echo "Ver variáveis em: $(SERVER)/.env.example"

## bot-venv    Python venv + requirements no bot
bot-venv:
	cd $(BOT) && $(PYTHON) -m venv .venv && ./.venv/bin/pip install -U pip && ./.venv/bin/pip install -r requirements.txt
	@echo "✓ Bot: venv em $(BOT)/.venv"

bot-install: bot-venv

## dev-client  Turborepo dev (client)
dev-client:
	cd $(CLIENT) && $(PNPM) dev

## dev-web-only Só app Next `web`
dev-web-only:
	cd $(CLIENT) && $(PNPM) exec turbo run dev --filter=web

## dev-api     Nest watch
dev-api:
	cd $(SERVER) && $(PNPM) dev:api

## dev-bot     Uvicorn reload (usa .venv se existir)
dev-bot:
	@if [ ! -f $(BOT)/.venv/bin/uvicorn ]; then \
		echo "Executa antes: make bot-venv"; exit 1; \
	fi
	@set -a; [ -f $(SERVER)/.env ] && . $(SERVER)/.env; set +a; \
	cd $(BOT) && exec ./.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port $${BOT_PORT:-$(BOT_PORT)}

## build-client
build-client:
	cd $(CLIENT) && $(PNPM) build

## build-server-api
build-server-api:
	cd $(SERVER) && $(PNPM) build:api

## build-all   Client + API
build-all: build-client build-server-api

## lint-client
lint-client:
	cd $(CLIENT) && $(PNPM) lint

## lint-api
lint-api:
	cd $(SERVER) && $(PNPM) --filter api lint

## start-api-prod  Build + node dist
start-api-prod: build-server-api
	cd $(SERVER) && $(PNPM) start:api

## infra-up
infra-up:
	cd $(SERVER) && $(PNPM) infra:up
	@echo "PgAdmin: http://localhost:$${PGADMIN_PORT:-5050} (ver server/.env)"

## infra-down
infra-down:
	cd $(SERVER) && $(PNPM) infra:down

## infra-logs
infra-logs:
	cd $(SERVER) && $(PNPM) infra:logs

## infra-ps
infra-ps:
	cd $(SERVER) && docker compose -f infra/docker-compose.yml ps

## infra-reset  Apaga volumes (CONFIRM_RESET=yes obrigatório)
infra-reset:
	@if [ "$(CONFIRM_RESET)" != "yes" ]; then \
		echo "⚠️  Esta operação APAGA volumes (Postgres, Mongo, Redis, PgAdmin)."; \
		echo "    Para confirmar: $(MAKE) infra-reset CONFIRM_RESET=yes"; \
		exit 1; \
	fi
	cd $(SERVER) && $(PNPM) infra:reset

## infra-restart
infra-restart: infra-down infra-up

## dev         Dica rápida (não lança vários servidores de uma vez)
dev:
	@echo "O Make corre um comando de cada vez. Abre vários terminais, por exemplo:"
	@echo "  Terminal 1: $(MAKE) dev-client"
	@echo "  Terminal 2: $(MAKE) dev-api"
	@echo "  Terminal 3: $(MAKE) dev-bot"
	@echo "Ou corre antes: $(MAKE) infra-up"
