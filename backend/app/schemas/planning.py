from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field


class ProjectPlanRequest(BaseModel):
    project_name: str = Field(..., min_length=2, max_length=150, description="Project title")
    project_type: str = Field(..., description="e.g. Commercial Office Fit-out, Multi-Family Residential, Industrial Warehouse, Highway Extension")
    project_description: str = Field(..., min_length=10, max_length=2000, description="Scope and objectives")
    project_size: str = Field(..., description="e.g. 50,000 sq ft, 5 stories, 24 units")
    start_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Project kick-off date (YYYY-MM-DD)")
    target_completion_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Target handover date (YYYY-MM-DD)")
    estimated_budget: Optional[str] = Field(None, description="Target budget, e.g. $2.5M or Rs 15 Crores")
    constraints_and_requirements: Optional[str] = Field(None, description="Zoning restrictions, winter shutdown, LEED certification goals, supply chain bottlenecks")


class TaskItem(BaseModel):
    id: str
    phase: str
    title: str
    duration_days: int
    suggested_start: str
    suggested_end: str
    dependencies: List[str] = Field(default_factory=list)
    assigned_trade: str
    critical_path: bool = False
    deliverables: str


class PhaseItem(BaseModel):
    name: str
    duration_weeks: int
    description: str
    key_milestone: str
    tasks: List[TaskItem] = Field(default_factory=list)


class ProjectRiskItem(BaseModel):
    risk: str
    probability: Literal["Low", "Medium", "High"]
    impact: Literal["Low", "Medium", "High", "Critical"]
    mitigation_strategy: str


class MilestoneItem(BaseModel):
    title: str
    target_date: str
    deliverable: str


class ProjectPlanResponse(BaseModel):
    module: Literal["project_planning"] = "project_planning"
    project_name: str
    project_summary: str
    total_estimated_days: int
    phases: List[PhaseItem]
    critical_path_summary: List[str]
    potential_risks: List[ProjectRiskItem]
    milestones: List[MilestoneItem]
    preliminary_disclaimer: str = Field(
        default="Generated durations, task sequences, and critical paths are AI-assisted estimates. They must be validated against regional building codes, local trade availability, and MEP subcontractor schedules before contract execution.",
        description="Planning disclaimer"
    )
    is_demo: bool = False
    timestamp: str = ""
    saved_project_id: Optional[str] = None


class ProjectSaveRequest(BaseModel):
    name: str
    project_type: str
    description: str
    size: str
    start_date: str
    target_date: str
    budget: Optional[str] = ""
    constraints: Optional[str] = ""
    plan_data: Dict[str, Any]
    status: Optional[str] = "Draft"
