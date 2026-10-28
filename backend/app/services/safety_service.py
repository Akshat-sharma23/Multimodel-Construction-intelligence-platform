import base64
import logging
from typing import Optional
from sqlalchemy.orm import Session
from app.config import settings
from app.models.entities import AnalysisRecord
from app.schemas.safety import SafetyAnalysisResponse
from app.services.grok_client import grok_client, GrokClientError
from app.services.demo_data import get_demo_safety_analysis, current_iso_time

logger = logging.getLogger("mcip.safety_service")

SAFETY_SYSTEM_PROMPT = """You are an expert construction safety inspector and civil engineer.
Analyze the provided construction site photograph with rigorous objectivity and engineering caution.
Rules:
1. Examine only hazards that can be reasonably and visually inferred from the image.
2. Clearly distinguish visible evidence from inference or uncertainty.
3. NEVER claim a worker lacks PPE unless the image provides clear, undeniable evidence.
4. NEVER claim an entire construction site is safe merely because no hazard is visible in this frame.
5. Identify recognized elements, potential hazards with specific locations in the image, risk level (low, medium, high, critical, unknown), actionable recommendations, and explicit visual limitations/blindspots.
6. Return your response ONLY as valid, parseable JSON conforming strictly to this structure:
{
  "module": "safety_monitoring",
  "summary": "Factual high-level summary of what is visible",
  "visible_elements": ["element 1", "element 2"],
  "observations": ["observation 1", "observation 2"],
  "potential_hazards": [
    {
      "description": "Hazard description",
      "severity": "low|medium|high|critical",
      "location_in_image": "e.g. Foreground left edge",
      "visible_evidence": "Direct visual cues supporting this"
    }
  ],
  "risk_level": "low|medium|high|critical|unknown",
  "recommendations": ["recommendation 1", "recommendation 2"],
  "limitations": ["blindspot 1", "blindspot 2"]
}
"""


async def analyze_site_safety(
    image_bytes: bytes,
    mime_type: str,
    site_description: Optional[str] = None,
    db: Optional[Session] = None,
    force_demo: bool = False
) -> SafetyAnalysisResponse:
    is_live = settings.is_ai_live_ready and not force_demo

    if is_live:
        try:
            b64_image = base64.b64encode(image_bytes).decode("utf-8")
            data_uri = f"data:{mime_type};base64,{b64_image}"

            user_text = "Analyze this construction site photograph for safety risks, visible PPE compliance, fall protection, and housekeeping."
            if site_description and site_description.strip():
                user_text += f"\nContext/Question provided by site engineer: {site_description.strip()}"

            messages = [
                {"role": "system", "content": SAFETY_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": user_text},
                        {"type": "image_url", "image_url": {"url": data_uri, "detail": "high"}}
                    ]
                }
            ]

            raw_json = await grok_client.chat_completion(
                messages=messages,
                model=settings.GROK_VISION_MODEL,
                temperature=0.2,
                expect_json=True
            )
            raw_json["is_demo"] = False
            raw_json["timestamp"] = current_iso_time()
            validated = SafetyAnalysisResponse(**raw_json)

        except (GrokClientError, Exception) as exc:
            logger.warning("Grok AI safety analysis failed or unavailable: %s. Falling back to calibrated demo data.", str(exc))
            demo_dict = get_demo_safety_analysis(site_description)
            validated = SafetyAnalysisResponse(**demo_dict)
    else:
        demo_dict = get_demo_safety_analysis(site_description)
        validated = SafetyAnalysisResponse(**demo_dict)

    # Persist record in database if session provided
    if db is not None:
        try:
            record = AnalysisRecord(
                module="safety_monitoring",
                title=f"Site Safety Inspection ({validated.risk_level.upper()} Risk)",
                summary=validated.summary,
                risk_level=validated.risk_level,
                input_meta={"site_description": site_description or ""},
                result_data=validated.model_dump(),
                is_demo=validated.is_demo
            )
            db.add(record)
            db.commit()
            db.refresh(record)
            validated.saved_record_id = record.id
        except Exception as db_exc:
            logger.error("Failed to persist safety analysis in database: %s", str(db_exc))
            db.rollback()

    return validated
