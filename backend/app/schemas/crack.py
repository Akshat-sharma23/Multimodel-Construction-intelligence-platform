from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class CrackPattern(BaseModel):
    pattern_type: str = Field(..., description="e.g. Diagonal Shear, Vertical Shrinkage, Horizontal Flexural, Craze/Hairline")
    visual_severity: Literal["negligible", "minor", "moderate", "severe", "uncertain"] = Field(..., description="Severity justified solely by visible photographic cues")
    description: str = Field(..., description="Visual description of the pattern, length, branching, and path")
    approximate_location: str = Field(..., description="Location on the element, e.g., midspan bottom, column capital, lintel corner")
    characteristics: str = Field(..., description="Characteristics such as spalling, efflorescence, rust staining, displacement")


class CrackAnalysisResponse(BaseModel):
    module: Literal["crack_analysis"] = "crack_analysis"
    summary: str = Field(..., description="Summary of visible surface patterns")
    building_element: str = Field(..., description="e.g. Reinforced Concrete Beam, Brick Masonry Wall, Foundation Slab, Plastered Ceiling")
    visual_crack_patterns: List[CrackPattern] = Field(default_factory=list, description="Observed crack patterns")
    overall_visual_severity: Literal["negligible", "minor", "moderate", "severe", "uncertain"] = "uncertain"
    possible_causes_hypothesis: List[str] = Field(default_factory=list, description="Hypothesized potential structural or environmental causes")
    recommended_actions: List[str] = Field(default_factory=list, description="Recommended non-destructive tests, crack monitoring, or immediate shoring")
    inspection_disclaimer: str = Field(
        default="AI-assisted visual analysis only. Does not measure internal crack depth, rebar yield, or structural stability. An in-person inspection by a licensed structural engineer is required for safety certification.",
        description="Mandatory engineering disclaimer"
    )
    is_demo: bool = False
    timestamp: str = ""
    saved_record_id: Optional[str] = None
