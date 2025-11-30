from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Alfa Income Modelling App"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/alfa_hack"
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:8080",
    ]

    class Config:
        env_file = ".env"


settings = Settings()
