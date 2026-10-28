from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import DailyReportRecord
from app.schemas.report import DailyReportRequest, DailyReportResponse
from app.schemas.common import DeleteResponse
from app.services.weather_service import generate_daily_site_report

router = APIRouter(prefix="/reports", tags=["Daily Site Reports"])


@router.post("/generate", response_model=DailyReportResponse)
async def generate_report_endpoint(
    request: DailyReportRequest,
    force_demo: bool = Query(False, description="Request demo report generation"),
    db: Session = Depends(get_db)
):
    """
    Generate an authoritative, structured daily site report from raw shift notes,
    including workforce productivity, delay analysis, safety logs, and downloadable format.
    """
    result = await generate_daily_site_report(request, db=db, force_demo=force_demo)
    return result


@router.get("")
def list_reports_endpoint(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """List historical daily site reports."""
    query = db.query(DailyReportRecord)
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(DailyReportRecord.project_name.ilike(term))
    total = query.count()
    records = query.order_by(DailyReportRecord.created_at.desc()).offset(skip).limit(limit).all()

    items = []
    for r in records:
        items.append({
            "id": r.id,
            "project_name": r.project_name,
            "report_date": r.report_date,
            "workforce_count": r.workforce_count,
            "is_demo": r.is_demo,
            "created_at": r.created_at.isoformat() if r.created_at else "",
            "summary": r.ai_report.get("executive_summary", "") if isinstance(r.ai_report, dict) else ""
        })

    return {"total": total, "items": items}


@router.get("/{report_id}")
def get_report_endpoint(
    report_id: str,
    db: Session = Depends(get_db)
):
    """Fetch details and full markdown of a specific daily report."""
    record = db.query(DailyReportRecord).filter(DailyReportRecord.id == report_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Daily report not found")

    return {
        "id": record.id,
        "project_name": record.project_name,
        "report_date": record.report_date,
        "workforce_count": record.workforce_count,
        "work_completed": record.work_completed,
        "materials_used": record.materials_used,
        "equipment_used": record.equipment_used,
        "delays_issues": record.delays_issues,
        "safety_observations": record.safety_observations,
        "planned_work": record.planned_work,
        "ai_report": record.ai_report,
        "is_demo": record.is_demo,
        "created_at": record.created_at.isoformat() if record.created_at else ""
    }


@router.delete("/{report_id}", response_model=DeleteResponse)
def delete_report_endpoint(
    report_id: str,
    db: Session = Depends(get_db)
):
    """Delete a daily report record."""
    record = db.query(DailyReportRecord).filter(DailyReportRecord.id == report_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Daily report not found")

    db.delete(record)
    db.commit()
    return DeleteResponse(
        success=True,
        id=report_id,
        message=f"Daily report for '{record.project_name}' on {record.report_date} deleted."
    )
