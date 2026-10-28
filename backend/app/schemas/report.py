from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class DailyReportRequest(BaseModel):
    project_name: str = Field(..., min_length=2, max_length=150)
    report_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    workforce_count: int = Field(..., ge=0, le=5000)
    work_completed: str = Field(..., min_length=5, max_length=3000)
    materials_used: str = Field(..., min_length=3, max_length=2000)
    equipment_used: str = Field(..., min_length=3, max_length=2000)
    delays_issues: Optional[str] = Field("None reported", max_length=2000)
    safety_observations: Optional[str] = Field("No incidents reported. PPE compliance inspected.", max_length=2000)
    planned_work_next_day: str = Field(..., min_length=5, max_length=2000)


class DailyReportResponse(BaseModel):
    module: Literal["daily_site_report"] = "daily_site_report"
    project_name: str
    report_date: str
    executive_summary: str
    manpower_productivity_analysis: str
    materials_and_equipment_notes: str
    delay_impact_assessment: str
    safety_and_compliance_review: str
    next_day_action_items: List[str]
    formatted_markdown_report: str
    is_demo: bool = False
    saved_report_id: Optional[str] = None
