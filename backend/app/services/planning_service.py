from datetime import datetime
import logging
from typing import Optional
from sqlalchemy.orm import Session
from app.config import settings
from app.models.entities import ProjectRecord, AnalysisRecord
from app.schemas.planning import ProjectPlanRequest, ProjectPlanResponse
from app.services.grok_client import grok_client, GrokClientError
from app.services.demo_data import get_demo_project_plan, current_iso_time

logger = logging.getLogger("mcip.planning_service")

PLANNING_SYSTEM_PROMPT = """You are a Master Construction Project Planner, PMP, and Principal Civil Engineer.
Generate an exhaustive, realistic construction project execution plan based on the user's project parameters.
Rules:
1. Divide work logically into 4 to 6 sequential phases (e.g. Pre-Construction, Substructure, Superstructure, MEP & Envelope, Commissioning & Handover).
2. Each phase must contain specific tasks with realistic duration in days, suggested start and end dates (YYYY-MM-DD), assigned trades, deliverables, and sequential dependencies (e.g. T101).
3. Identify critical path items that directly constrain overall duration.
4. Highlight major project risks (probability, impact, and actionable mitigation strategy).
5. Output valid JSON strictly following this schema:
{
  "module": "project_planning",
  "project_name": "Project Name",
  "project_summary": "Summary text",
  "total_estimated_days": 180,
  "phases": [
    {
      "name": "Phase 1: Pre-Construction & Mobilization",
      "duration_weeks": 4,
      "description": "Phase description",
      "key_milestone": "Milestone title",
      "tasks": [
        {
          "id": "T101",
          "phase": "Phase 1",
          "title": "Task title",
          "duration_days": 10,
          "suggested_start": "YYYY-MM-DD",
          "suggested_end": "YYYY-MM-DD",
          "dependencies": [],
          "assigned_trade": "Trade name",
          "critical_path": true,
          "deliverables": "Deliverable description"
        }
      ]
    }
  ],
  "critical_path_summary": ["T101 -> T102 -> T201"],
  "potential_risks": [
    {
      "risk": "Description of risk",
      "probability": "Low|Medium|High",
      "impact": "Low|Medium|High|Critical",
      "mitigation_strategy": "Mitigation actions"
    }
  ],
  "milestones": [
    {
      "title": "Milestone Title",
      "target_date": "YYYY-MM-DD",
      "deliverable": "Deliverable summary"
    }
  ],
  "preliminary_disclaimer": "Generated durations are preliminary estimates and must be reviewed by a construction professional."
}
"""


async def generate_project_plan(
    request: ProjectPlanRequest,
    db: Optional[Session] = None,
    force_demo: bool = False
) -> ProjectPlanResponse:
    # Validate dates
    try:
        s_date = datetime.strptime(request.start_date, "%Y-%m-%d")
        t_date = datetime.strptime(request.target_completion_date, "%Y-%m-%d")
        if t_date <= s_date:
            raise ValueError("Target completion date must be strictly after the start date.")
    except ValueError as ve:
        raise ve

    is_live = settings.is_ai_live_ready and not force_demo

    if is_live:
        try:
            prompt = (
                f"Project Name: {request.project_name}\n"
                f"Project Type: {request.project_type}\n"
                f"Project Size: {request.project_size}\n"
                f"Description: {request.project_description}\n"
                f"Start Date: {request.start_date}\n"
                f"Target Completion Date: {request.target_completion_date}\n"
                f"Budget: {request.estimated_budget or 'Not specified'}\n"
                f"Constraints: {request.constraints_and_requirements or 'Standard municipal guidelines'}\n"
            )

            messages = [
                {"role": "system", "content": PLANNING_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ]

            raw_json = await grok_client.chat_completion(
                messages=messages,
                model=settings.GROK_MODEL,
                temperature=0.2,
                max_tokens=3500,
                expect_json=True
            )
            raw_json["is_demo"] = False
            raw_json["timestamp"] = current_iso_time()
            validated = ProjectPlanResponse(**raw_json)

        except (GrokClientError, Exception) as exc:
            logger.warning("Grok AI project planning failed: %s. Using calibrated demo plan generator.", str(exc))
            demo_dict = get_demo_project_plan(
                project_name=request.project_name,
                project_type=request.project_type,
                project_size=request.project_size,
                start_date=request.start_date,
                target_date=request.target_completion_date,
                budget=request.estimated_budget
            )
            validated = ProjectPlanResponse(**demo_dict)
    else:
        demo_dict = get_demo_project_plan(
            project_name=request.project_name,
            project_type=request.project_type,
            project_size=request.project_size,
            start_date=request.start_date,
            target_date=request.target_completion_date,
            budget=request.estimated_budget
        )
        validated = ProjectPlanResponse(**demo_dict)

    # Save to ProjectRecord in database if session provided
    if db is not None:
        try:
            record = ProjectRecord(
                name=request.project_name,
                project_type=request.project_type,
                description=request.project_description,
                size=request.project_size,
                start_date=request.start_date,
                target_date=request.target_completion_date,
                budget=request.estimated_budget or "",
                constraints=request.constraints_and_requirements or "",
                plan_data=validated.model_dump(),
                status="Draft"
            )
            db.add(record)
            db.commit()
            db.refresh(record)
            validated.saved_project_id = record.id

            # Also log to AnalysisRecord
            analysis_rec = AnalysisRecord(
                module="project_planning",
                title=f"Project Plan: {request.project_name}",
                summary=validated.project_summary[:300],
                risk_level="Medium",
                input_meta=request.model_dump(),
                result_data=validated.model_dump(),
                is_demo=validated.is_demo
            )
            db.add(analysis_rec)
            db.commit()
        except Exception as db_exc:
            logger.error("Failed to persist project in database: %s", str(db_exc))
            db.rollback()

    return validated
