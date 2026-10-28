import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Multimodal Construction Intelligence Platform (MCIP)"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # xAI Grok API Configuration
    XAI_API_KEY: str = ""
    XAI_BASE_URL: str = "https://api.x.ai/v1"
    GROK_MODEL: str = "grok-2-1212"
    GROK_VISION_MODEL: str = "grok-2-vision-1212"
    AI_DEMO_MODE: bool = False
    
    # Database
    DATABASE_URL: str = "sqlite:///./construction.db"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",
        "https://*.onrender.com"
    ]
    
    # File Upload Controls
    MAX_IMAGE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_IMAGE_TYPES: List[str] = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg"
    ]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    @property
    def is_ai_live_ready(self) -> bool:
        """Returns True if a non-placeholder API key is configured and demo mode is not forced."""
        if self.AI_DEMO_MODE:
            return False
        key = self.XAI_API_KEY.strip()
        return bool(key and key != "your_xai_api_key_here" and len(key) > 8)


settings = Settings()
