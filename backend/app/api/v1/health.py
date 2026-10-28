from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.config import settings
from app.database import get_db
from app.schemas.common import HealthResponse, SystemStatusResponse

router = APIRouter(tags=["Health & Status"])


@router.get("/health", response_model=HealthResponse)
def get_health():
    """Health check endpoint providing platform status and AI readiness."""
    return HealthResponse(
        status="healthy",
        app_name=settings.PROJECT_NAME,
        version=settings.VERSION,
        live_ai_ready=settings.is_ai_live_ready,
        grok_model=settings.GROK_MODEL,
        grok_vision_model=settings.GROK_VISION_MODEL,
        demo_mode=not settings.is_ai_live_ready,
        environment="production" if not settings.DATABASE_URL.startswith("sqlite") else "development"
    )


@router.get("/status", response_model=SystemStatusResponse)
def get_system_status(db: Session = Depends(get_db)):
    """Safe system status reporting without leaking secrets or credentials."""
    db_connected = False
    try:
        db.execute(text("SELECT 1"))
        db_connected = True
    except Exception:
        db_connected = False

    return SystemStatusResponse(
        live_ai_ready=settings.is_ai_live_ready,
        configured_text_model=settings.GROK_MODEL,
        configured_vision_model=settings.GROK_VISION_MODEL,
        force_demo_mode=settings.AI_DEMO_MODE,
        database_connected=db_connected,
        storage_type="SQLite (Local)" if settings.DATABASE_URL.startswith("sqlite") else "PostgreSQL"
    )
