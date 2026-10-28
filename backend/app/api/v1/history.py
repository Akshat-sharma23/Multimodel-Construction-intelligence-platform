from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import AnalysisRecord
from app.schemas.common import DeleteResponse

router = APIRouter(prefix="/history", tags=["Analysis History"])


@router.get("")
def list_history_endpoint(
    module: Optional[str] = Query(None, description="Filter by module: safety_monitoring, crack_analysis, real_estate_valuation, project_planning, daily_site_report"),
    search: Optional[str] = Query(None, description="Search term in title or summary"),
    skip: int = Query(0, ge=0),
    limit: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Retrieve persisted multimodal analysis records."""
    query = db.query(AnalysisRecord)
    if module and module.strip():
        query = query.filter(AnalysisRecord.module == module.strip())
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(AnalysisRecord.title.ilike(term) | AnalysisRecord.summary.ilike(term))

    total = query.count()
    records = query.order_by(AnalysisRecord.created_at.desc()).offset(skip).limit(limit).all()

    items = []
    for r in records:
        items.append({
            "id": r.id,
            "created_at": r.created_at.isoformat() if r.created_at else "",
            "module": r.module,
            "title": r.title,
            "summary": r.summary,
            "risk_level": r.risk_level,
            "is_demo": r.is_demo,
            "input_meta": r.input_meta,
            "result_data": r.result_data
        })

    return {"total": total, "items": items}


@router.get("/{record_id}")
def get_history_detail_endpoint(
    record_id: str,
    db: Session = Depends(get_db)
):
    """Fetch complete JSON data for an individual analysis record."""
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis record not found")

    return {
        "id": record.id,
        "created_at": record.created_at.isoformat() if record.created_at else "",
        "module": record.module,
        "title": record.title,
        "summary": record.summary,
        "risk_level": record.risk_level,
        "is_demo": record.is_demo,
        "input_meta": record.input_meta,
        "result_data": record.result_data
    }


@router.delete("/{record_id}", response_model=DeleteResponse)
def delete_history_record_endpoint(
    record_id: str,
    db: Session = Depends(get_db)
):
    """Delete a single analysis record."""
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis record not found")

    db.delete(record)
    db.commit()
    return DeleteResponse(
        success=True,
        id=record_id,
        message=f"Analysis record '{record.title}' deleted successfully."
    )


@router.delete("", response_model=DeleteResponse)
def clear_history_endpoint(
    confirm: bool = Query(False, description="Must be true to confirm clear"),
    db: Session = Depends(get_db)
):
    """Clear all analysis records with explicit confirmation."""
    if not confirm:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Must provide ?confirm=true to clear history.")

    count = db.query(AnalysisRecord).delete()
    db.commit()
    return DeleteResponse(
        success=True,
        id="all",
        message=f"Cleared {count} analysis history records."
    )
