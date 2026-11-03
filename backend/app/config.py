from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


def _to_psycopg_url(url: str) -> str:
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg://", 1)
    return url


class Settings(BaseSettings):
    DATABASE_URL: str
    DATABASE_URL_POOLED: str = ""
    JWT_SECRET: str = "foundation_secret_key_change_me"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    ADMIN_DEFAULT_EMAIL: str = "admin@foundation.org"
    ADMIN_DEFAULT_PASSWORD: str = "Admin@12345"
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parent.parent / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def sqlalchemy_database_url(self) -> str:
        target = self.DATABASE_URL_POOLED or self.DATABASE_URL
        return _to_psycopg_url(target)

    @property
    def sqlalchemy_direct_url(self) -> str:
        return _to_psycopg_url(self.DATABASE_URL)

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


settings = Settings()
