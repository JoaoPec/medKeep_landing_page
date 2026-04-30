"""API do bot FastAPI — preparado para produtor/consumidor Redis (filas/stream)."""

from functools import lru_cache

from fastapi import FastAPI
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    bot_port: int = 8000  # BOT_PORT em .env
    redis_url: str = "redis://localhost:6379"  # REDIS_URL em .env


@lru_cache
def get_settings() -> Settings:
    return Settings()


app = FastAPI(title="MedKeep Bot", version="0.1.0")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "bot"}


@app.get("/")
async def root() -> dict[str, str]:
    _ = get_settings()
    return {
        "message": "MedKeep Bot (FastAPI)",
        "queue_transport": "redis (planeado para BullMQ ⇄ streams/listas)",
    }

