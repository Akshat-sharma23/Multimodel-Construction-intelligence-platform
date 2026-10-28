import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean, Integer, JSON, Text
from app.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    module = Column(String(50), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    summary = Column(Text, nullable=False)
    risk_level = Column(String(30), nullable=True)
    image_filename = Column(String(255), nullable=True)
    input_meta = Column(JSON, nullable=False, default=dict)
    result_data = Column(JSON, nullable=False, default=dict)
    is_demo = Column(Boolean, default=False, nullable=False)


class ProjectRecord(Base):
    __tablename__ = "project_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)
    name = Column(String(200), nullable=False, index=True)
    project_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False, default="")
    size = Column(String(100), nullable=False, default="")
    start_date = Column(String(30), nullable=False)
    target_date = Column(String(30), nullable=False)
    budget = Column(String(100), nullable=False, default="")
    constraints = Column(Text, nullable=False, default="")
    plan_data = Column(JSON, nullable=False, default=dict)
    status = Column(String(50), nullable=False, default="Draft")


class DailyReportRecord(Base):
    __tablename__ = "daily_reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    project_name = Column(String(200), nullable=False, index=True)
    report_date = Column(String(30), nullable=False)
    workforce_count = Column(Integer, nullable=False, default=0)
    work_completed = Column(Text, nullable=False, default="")
    materials_used = Column(Text, nullable=False, default="")
    equipment_used = Column(Text, nullable=False, default="")
    delays_issues = Column(Text, nullable=False, default="")
    safety_observations = Column(Text, nullable=False, default="")
    planned_work = Column(Text, nullable=False, default="")
    ai_report = Column(JSON, nullable=False, default=dict)
    is_demo = Column(Boolean, default=False, nullable=False)
