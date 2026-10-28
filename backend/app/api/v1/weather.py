from fastapi import APIRouter
from app.schemas.weather import WeatherAdvisoryRequest, WeatherAdvisoryResponse
from app.services.weather_service import get_weather_advisory

router = APIRouter(prefix="/weather", tags=["Weather Advisory"])


@router.post("/advisory", response_model=WeatherAdvisoryResponse)
async def weather_advisory_endpoint(request: WeatherAdvisoryRequest):
    """
    Retrieve real-time meteorological conditions and construction operational advisories
    for concrete pouring, tower cranes, roofing/scaffolding, and earthwork excavation.
    """
    result = await get_weather_advisory(request)
    return result
