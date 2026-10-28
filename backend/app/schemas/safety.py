from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class HazardItem(BaseModel):
    description: str = Field(..., description="Description of the potential hazard visible in the image")
    severity: Literal["low", "medium", "high", "critical"] = Field(..., description="Estimated risk severity")
    location_in_image: str = Field(..., description="Where in the frame the hazard appears, e.g. foreground left, perimeter")
    visible_evidence: str = Field(..., description="Direct visual cues observed, distinguishing facts from inference")


class SafetyAnalysisResponse(BaseModel):
    module: Literal["safety_monitoring"] = "safety_monitoring"
    summary: str = Field(..., description="High-level factual summary of what is visible on site")
    visible_elements: List[str] = Field(default_factory=list, description="List of recognized machinery, workers, structures, PPE")
    observations: List[str] = Field(default_factory=list, description="Factual site observations")
    potential_hazards: List[HazardItem] = Field(default_factory=list, description="Specific hazards inferred with visible evidence")
    risk_level: Literal["low", "medium", "high", "critical", "unknown"] = Field("unknown", description="Overall risk level")
    recommendations: List[str] = Field(default_factory=list, description="Recommended engineering and procedural precautions")
    limitations: List[str] = Field(default_factory=list, description="Blindspots, resolution limits, and unverified areas")
    is_demo: bool = False
    timestamp: str = ""
    saved_record_id: Optional[str] = None
