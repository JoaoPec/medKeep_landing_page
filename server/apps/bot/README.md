# MedKeep Bot (FastAPI)

Serviço pensado para integrar com a **API Nest** via **mensagens em fila** (Redis hoje; RabbitMQ é evolução natural).

## Como correr

Na pasta `server/apps/bot`:

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port ${BOT_PORT:-8000}
```

Variáveis: ver `server/.env.example`.

## Produção / Docker

Imagens Docker por serviço podem ser acrescentadas quando quiseres orquestração única (`docker-compose` com `api`, `bot` e infra).
