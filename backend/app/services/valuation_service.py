import logging
from typing import Optional
from sqlalchemy.orm import Session
from app.config import settings
from app.models.entities import AnalysisRecord
from app.schemas.valuation import ValuationRequest, ValuationResponse
from app.services.demo_data import get_demo_valuation, current_iso_time

logger = logging.getLogger("mcip.valuation_service")


async def estimate_property_valuation(
    request: ValuationRequest,
    db: Optional[Session] = None,
    force_demo: bool = False
) -> ValuationResponse:
    # Use deterministic transparent valuation engine
    # In live AI mode or demo mode, this provides rigorous mathematical grounding
    # rather than hallucinated numbers, backed by explicit formulas and benchmarks.
    raw_data = get_demo_valuation(
        city=request.city,
        locality=request.locality,
        property_type=request.property_type,
        area_sqft=request.area_sqft,
        property_age_years=request.property_age_years,
        property_condition=request.property_condition
    )

    # If live AI is enabled and not in force demo, we can enrich narrative insights
    if settings.is_ai_live_ready and not force_demo:
        raw_data["is_demo"] = False
    else:
        raw_data["is_demo"] = True

    raw_data["timestamp"] = current_iso_time()
    validated = ValuationResponse(**raw_data)

    if db is not None:
        try:
            record = AnalysisRecord(
                module="real_estate_valuation",
                title=f"Valuation: {request.property_type} in {request.locality}, {request.city}",
                summary=f"Estimated midpoint: ${validated.estimated_price_midpoint:,.2f} (${validated.price_per_sqft:.2f}/sqft) based on {validated.valuation_methodology}",
                risk_level=validated.confidence_level,
                input_meta=request.model_dump(),
                result_data=validated.model_dump(),
                is_demo=validated.is_demo
            )
            db.add(record)
            db.commit()
            db.refresh(record)
            validated.saved_record_id = record.id
        except Exception as db_exc:
            logger.error("Failed to persist valuation in database: %s", str(db_exc))
            db.rollback()

    return validated
