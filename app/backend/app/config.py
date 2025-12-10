from functools import lru_cache
from pydantic_settings import BaseSettings
from pathlib import Path
from pydantic import SecretStr
from urllib.parse import quote_plus

BASE_DIR = Path(__file__).resolve().parent


class Settings(BaseSettings):
    APP_NAME: str = "PawfectMatch"
    FRONTEND_SCHEME: str = "http"
    FRONTEND_HOST: str = "localhost"
    FRONTEND_PORT: str = "5173"
    database_hostname: str = "localhost"
    database_port: str = "5435"
    database_name: str = "pawfectmatch"
    database_password: SecretStr = SecretStr("P@ssw0rd123!")
    database_username: SecretStr = SecretStr("admin")
    GOOGLE_CLIENT_ID: SecretStr
    GOOGLE_CLIENT_SECRET: SecretStr

    @property
    def database_url(self) -> str:
        parsed_username = quote_plus(self.database_username.get_secret_value())
        parsed_password = quote_plus(self.database_password.get_secret_value())
        return f"postgresql+psycopg2://{parsed_username}:{parsed_password}@{self.database_hostname}:{self.database_port}/{self.database_name}"

    @property
    def frontend_url(self) -> str:
        return f"{self.FRONTEND_HOST}:{self.FRONTEND_PORT}"

    @property
    def frontend_url_with_scheme(self) -> str:
        return f"{self.FRONTEND_SCHEME}://{self.frontend_url}"

    class Config:
        env_file = f"{BASE_DIR}/.env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
