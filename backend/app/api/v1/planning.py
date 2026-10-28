from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import ProjectRecord
from app.schemas.planning import (
    ProjectPlanRequest,
    ProjectPlanResponse,
    ProjectSaveRequest
)
from app.schemas.common import DeleteResponse
from app.services.planning_service import generate_project_plan

router = APIRouter(tags=["Construction Project Planning"])


@router.post("/planning/generate", response_model=ProjectPlanResponse)
async def generate_plan_endpoint(
    request: ProjectPlanRequest,
    force_demo: bool = Query(False, description="Request demo plan generation"),
    db: Session = Depends(get_db)
):
    """Generate a multi-phase construction master schedule and critical path breakdown."""
    try:
        result = await generate_project_plan(request, db=db, force_demo=force_demo)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))


@router.get("/projects")
def list_projects_endpoint(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Retrieve saved construction projects."""
    query = db.query(ProjectRecord)
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(ProjectRecord.name.ilike(term) | ProjectRecord.project_type.ilike(term))
    total = query.count()
    records = query.order_by(ProjectRecord.created_at.desc()).offset(skip).limit(limit).all()

    items = []
    for r in records:
        items.append({
            "id": r.id,
            "name": r.name,
            "project_type": r.project_type,
            "size": r.size,
            "start_date": r.start_date,
            "target_date": r.target_date,
            "budget": r.budget,
            "status": r.status,
            "created_at": r.created_at.isoformat() if r.created_at else "",
            "phase_count": len(r.plan_data.get("phases", [])) if isinstance(r.plan_data, dict) else 0
        })

    return {"total": total, "items": items}


@router.post("/projects")
def save_project_endpoint(
    request: ProjectSaveRequest,
    db: Session = Depends(get_db)
):
    """Manually create or save an updated construction project."""
    record = ProjectRecord(
        name=request.name,
        project_type=request.project_type,
        description=request.description,
        size=request.size,
        start_date=request.start_date,
        target_date=request.target_date,
        budget=request.budget or "",
        constraints=request.constraints or "",
        plan_data=request.plan_data,
        status=request.status or "Draft"
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"id": record.id, "name": record.name, "status": record.status, "message": "Project saved successfully"}


@router.get("/projects/{project_id}")
def get_project_endpoint(
    project_id: str,
    db: Session = Depends(get_db)
):
    """Fetch complete details and schedule timeline of a saved project."""
    record = db.query(ProjectRecord).filter(ProjectRecord.id == project_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    return {
        "id": record.id,
        "name": record.name,
        "project_type": record.project_type,
        "description": record.description,
        "size": record.size,
        "start_date": record.start_date,
        "target_date": record.target_date,
        "budget": record.budget,
        "constraints": record.constraints,
        "status": record.status,
        "plan_data": record.plan_data,
        "created_at": record.created_at.isoformat() if record.created_at else "",
        "updated_at": record.updated_at.isoformat() if record.updated_at else ""
    }


@router.delete("/projects/{project_id}", response_model=DeleteResponse)
def delete_project_endpoint(
    project_id: str,
    db: Session = Depends(get_db)
):
    """Delete a saved project record."""
    record = db.query(ProjectRecord).filter(ProjectRecord.id == project_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    db.delete(record)
    db.commit()
    return DeleteResponse(
        success=True,
        id=project_id,
        message=f"Project '{record.name}' deleted successfully."
    )
