from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./inventory.db"
    PROJECT_NAME: str = "Inventory Management API"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
