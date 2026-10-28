import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.database import init_db
from app.api.v1.router import api_v1_router
from app.services.grok_client import GrokClientError

# Configure root logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("mcip.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    logger.info("Initializing MCIP database schema...")
    init_db()
    
    if settings.is_ai_live_ready:
        logger.info("xAI Grok API configured: Model '%s' / Vision '%s' [LIVE MODE]", settings.GROK_MODEL, settings.GROK_VISION_MODEL)
    else:
        logger.info("MCIP initialized in DEMO MODE (xAI API key unconfigured or AI_DEMO_MODE=true). Safe deterministic responses enabled.")
    
    yield
    # Shutdown actions
    logger.info("MCIP backend shutting down.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Multimodal decision-support platform for construction safety, crack analysis, real estate valuation, project planning, and weather-aware site management.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom exception handler for Grok errors
@app.exception_handler(GrokClientError)
async def grok_client_error_handler(request: Request, exc: GrokClientError):
    logger.error("GrokClientError: %s (status %d)", exc.message, exc.status_code)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.message,
            "error_code": "AI_SERVICE_ERROR",
            "is_demo_fallback_recommended": True
        }
    )

# Global unhandled exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled server exception at %s", request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An internal server error occurred while processing your request.",
            "error_code": "INTERNAL_SERVER_ERROR"
        }
    )

# Mount API v1 router
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


@app.get("/")
def root_endpoint():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "documentation": "/docs",
        "health_check": f"{settings.API_V1_STR}/health",
        "live_ai_ready": settings.is_ai_live_ready
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
