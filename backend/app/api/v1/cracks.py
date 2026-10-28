from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.schemas.crack import CrackAnalysisResponse
from app.services.crack_service import analyze_crack_image

router = APIRouter(prefix="/cracks", tags=["Crack Detection & Analysis"])


@router.post("/analyze", response_model=CrackAnalysisResponse)
async def analyze_crack_endpoint(
    image: UploadFile = File(..., description="Surface crack photograph (JPG, PNG, WebP)"),
    building_element: Optional[str] = Form(None, description="Building element, e.g. RC Beam, Masonry Wall, Slab"),
    force_demo: Optional[bool] = Form(False, description="Explicitly request demo mode"),
    db: Session = Depends(get_db)
):
    """
    Perform AI-assisted visual crack pattern identification, orientation classification,
    and preliminary severity estimation with forensic engineering cautions.
    """
    if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type '{image.content_type}'. Allowed types: {', '.join(settings.ALLOWED_IMAGE_TYPES)}"
        )

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

    result = await analyze_crack_image(
        image_bytes=contents,
        mime_type=image.content_type,
        building_element=building_element,
        db=db,
        force_demo=force_demo
    )
    return result
