from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.safety import router as safety_router
from app.api.v1.cracks import router as cracks_router
from app.api.v1.valuation import router as valuation_router
from app.api.v1.planning import router as planning_router
from app.api.v1.assistant import router as assistant_router
from app.api.v1.weather import router as weather_router
from app.api.v1.reports import router as reports_router
from app.api.v1.history import router as history_router

api_v1_router = APIRouter()

api_v1_router.include_router(health_router)
api_v1_router.include_router(safety_router)
api_v1_router.include_router(cracks_router)
api_v1_router.include_router(valuation_router)
api_v1_router.include_router(planning_router)
api_v1_router.include_router(assistant_router)
api_v1_router.include_router(weather_router)
api_v1_router.include_router(reports_router)
api_v1_router.include_router(history_router)
