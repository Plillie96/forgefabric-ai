from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    app_name: str = "ForgeFabric AI"
    debug: bool = Field(default=False)
    port: int = Field(default=8000)
    secret_key: str = Field(default="changeme-in-production")
    allowed_hosts: List[str] = Field(default=["*"])
    cors_origins: List[str] = Field(default=["http://localhost:3000"])
    temporal_host: str = Field(default="localhost:7233")
    opa_url: str = Field(default="http://localhost:8181")
    redis_url: str = Field(default="redis://localhost:6379")
    database_url: str = Field(default="postgresql://user:pass@localhost:5432/forgefabric")
    openai_api_key: str = Field(default="")
    stripe_secret_key: str = Field(default="")
    clerk_secret_key: str = Field(default="")
    supabase_url: str = Field(default="")
    supabase_key: str = Field(default="")

    model_config = {"env_file": ".env", "case_sensitive": False}


settings = Settings()
