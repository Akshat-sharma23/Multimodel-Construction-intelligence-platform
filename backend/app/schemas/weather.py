from typing import List, Literal
from pydantic import BaseModel, Field


class OperationalAdvisoryItem(BaseModel):
    activity: str = Field(..., description="e.g. Concrete Pouring & Curing, Crane & Lifting, Scaffolding/Roofing, Facade Painting, Earthwork")
    status: Literal["Safe / Normal", "Caution / Monitored", "Suspended / High Risk"]
    reason: str
    precautions: List[str] = Field(default_factory=list)


class WeatherAdvisoryRequest(BaseModel):
    location: str = Field(..., min_length=2, max_length=100, description="City or site location name")


class WeatherAdvisoryResponse(BaseModel):
    module: Literal["weather_advisory"] = "weather_advisory"
    location_name: str
    timestamp: str
    temperature_c: float
    temperature_f: float
    conditions: str
    wind_speed_kmh: float
    wind_gusts_kmh: float
    precipitation_chance_percent: int
    humidity_percent: int
    operational_advisories: List[OperationalAdvisoryItem]
    high_risk_alerts: List[str] = Field(default_factory=list)
    data_source: str
    is_demo: bool = False
