from typing import Optional, Literal
from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    live_ai_ready: bool
    grok_model: str
    grok_vision_model: str
    demo_mode: bool
    environment: str


class SystemStatusResponse(BaseModel):
    live_ai_ready: bool
    configured_text_model: str
    configured_vision_model: str
    force_demo_mode: bool
    database_connected: bool
    storage_type: str


class ErrorResponse(BaseModel):
    detail: str
    error_code: str
    timestamp: str


class DeleteResponse(BaseModel):
    success: bool
    id: str
    message: str
