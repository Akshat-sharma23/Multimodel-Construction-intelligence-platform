from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field


class ValuationRequest(BaseModel):
    city: str = Field(..., min_length=2, max_length=100, description="City name, e.g. Mumbai, Bengaluru, New York, Austin, London")
    locality: str = Field(..., min_length=2, max_length=100, description="Neighborhood, sector, or locality name")
    property_type: Literal[
        "Apartment / Flat",
        "Independent House / Villa",
        "Commercial Office",
        "Retail Store",
        "Industrial Warehouse",
        "Plot / Land"
    ]
    area_sqft: float = Field(..., gt=50, le=500000, description="Super built-up or carpet area in sq ft")
    bedrooms: Optional[int] = Field(None, ge=0, le=30, description="Number of bedrooms (where applicable)")
    bathrooms: Optional[int] = Field(None, ge=0, le=30, description="Number of bathrooms")
    property_age_years: int = Field(..., ge=0, le=150, description="Age of structure in years")
    property_condition: Literal[
        "Brand New / Under Construction",
        "Excellent",
        "Good / Well Maintained",
        "Fair / Needs Minor Work",
        "Poor / Major Renovation Required"
    ]
    additional_features: Optional[List[str]] = Field(default_factory=list, description="Amenities like covered parking, high floor, corner plot")
    notes: Optional[str] = Field(None, max_length=1000, description="Any specific notes or zoning parameters")


class ComparableProperty(BaseModel):
    locality: str
    property_type: str
    area_sqft: float
    price_per_sqft: float
    transaction_type: str
    source: str


class ValuationBreakdown(BaseModel):
    base_rate_per_sqft: float
    base_value: float
    age_depreciation_percent: float
    age_depreciation_amount: float
    condition_adjustment_percent: float
    condition_adjustment_amount: float
    locality_tier_factor: float
    locality_adjustment_amount: float
    net_calculated_value: float


class ValuationResponse(BaseModel):
    module: Literal["real_estate_valuation"] = "real_estate_valuation"
    currency: str = "USD"
    estimated_price_min: float
    estimated_price_max: float
    estimated_price_midpoint: float
    price_per_sqft: float
    valuation_methodology: str
    breakdown: ValuationBreakdown
    inputs_used: Dict[str, Any]
    benchmark_comparables: List[ComparableProperty]
    confidence_level: Literal["High", "Medium", "Moderate", "Illustrative"]
    limitations_warning: str = Field(
        default="This is an algorithmic and comparative estimate for illustrative decision support only. It is not an appraisal by an accredited RICS or ASA certified appraiser.",
        description="Statutory valuation disclaimer"
    )
    is_demo: bool = False
    timestamp: str = ""
    saved_record_id: Optional[str] = None
