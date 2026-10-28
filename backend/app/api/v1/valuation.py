from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.valuation import ValuationRequest, ValuationResponse
from app.services.valuation_service import estimate_property_valuation

router = APIRouter(prefix="/valuation", tags=["Real Estate Valuation"])


@router.post("/estimate", response_model=ValuationResponse)
async def estimate_valuation_endpoint(
    request: ValuationRequest,
    force_demo: bool = Query(False, description="Request demo mode calculation"),
    db: Session = Depends(get_db)
):
    """
    Generate transparent algorithmic real estate valuation estimates with
    depreciated replacement cost breakdowns and verifiable benchmark comparables.
    """
    result = await estimate_property_valuation(request, db=db, force_demo=force_demo)
    return result
