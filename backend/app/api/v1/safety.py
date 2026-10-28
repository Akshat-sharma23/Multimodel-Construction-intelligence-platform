from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.schemas.safety import SafetyAnalysisResponse
from app.services.safety_service import analyze_site_safety

router = APIRouter(prefix="/safety", tags=["Site Safety Monitoring"])


@router.post("/analyze", response_model=SafetyAnalysisResponse)
async def analyze_safety_endpoint(
    image: UploadFile = File(..., description="Construction site image (JPG, PNG, WebP)"),
    site_description: Optional[str] = Form(None, description="Optional site context or specific question"),
    force_demo: Optional[bool] = Form(False, description="Explicitly request demo mode"),
    db: Session = Depends(get_db)
):
    """
    Analyze construction site image for potential safety hazards, PPE compliance,
    fall protection status, and housekeeping risks.
    """
    if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type '{image.content_type}'. Allowed types: {', '.join(settings.ALLOWED_IMAGE_TYPES)}"
        )

    # Read bytes with size protection
    contents = await image.read()
    if len(contents) > settings.MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image size exceeds the maximum limit of {settings.MAX_IMAGE_SIZE_BYTES // (1024*1024)}MB."
        )

    if len(contents) < 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file appears to be empty or corrupted."
        )

    result = await analyze_site_safety(
        image_bytes=contents,
        mime_type=image.content_type,
        site_description=site_description,
        db=db,
        force_demo=force_demo
    )
    return result
