import base64
import logging
from typing import Optional
from sqlalchemy.orm import Session
from app.config import settings
from app.models.entities import AnalysisRecord
from app.schemas.crack import CrackAnalysisResponse
from app.services.grok_client import grok_client, GrokClientError
from app.services.demo_data import get_demo_crack_analysis, current_iso_time

logger = logging.getLogger("mcip.crack_service")

CRACK_SYSTEM_PROMPT = """You are an experienced structural and forensic civil engineer.
You are assisting in AI-assisted visual crack pattern analysis from a photograph.
Strict Guidelines:
1. Do NOT claim to determine structural integrity, exact internal crack depth, or engineering-grade safety from a photograph alone.
2. Clearly distinguish visible surface pattern observations from structural hypotheses.
3. Identify visible crack patterns, their apparent orientation (e.g. diagonal shear, vertical flexural/shrinkage, horizontal, crazing), approximate locations, and surface characteristics (e.g. spalling, efflorescence, rust staining).
4. Assign an overall visual severity based SOLELY on visual cues: 'negligible', 'minor', 'moderate', 'severe', or 'uncertain'.
5. Recommend next steps such as tell-tale crack gauges, UPV non-destructive testing, and an obligatory in-person inspection by a licensed structural engineer.
6. Return your response ONLY as valid JSON conforming strictly to:
{
  "module": "crack_analysis",
  "summary": "Summary of visible surface patterns",
  "building_element": "e.g. Reinforced Concrete Beam, Brick Masonry Wall",
  "visual_crack_patterns": [
    {
      "pattern_type": "Diagonal Shear | Vertical Flexural | Horizontal | Crazing",
      "visual_severity": "negligible|minor|moderate|severe|uncertain",
      "description": "Visual path, length, branching, and appearance",
      "approximate_location": "Location on element",
      "characteristics": "Spalling, flaking, moisture stains, etc."
    }
  ],
  "overall_visual_severity": "negligible|minor|moderate|severe|uncertain",
  "possible_causes_hypothesis": ["Hypothesis 1", "Hypothesis 2"],
  "recommended_actions": ["Action 1", "Action 2"],
  "inspection_disclaimer": "AI-assisted visual analysis only. Does not measure internal crack depth, rebar yield, or structural stability. An in-person inspection by a licensed structural engineer is required."
}
"""


async def analyze_crack_image(
    image_bytes: bytes,
    mime_type: str,
    building_element: Optional[str] = None,
    db: Optional[Session] = None,
    force_demo: bool = False
) -> CrackAnalysisResponse:
    is_live = settings.is_ai_live_ready and not force_demo

    if is_live:
        try:
            b64_image = base64.b64encode(image_bytes).decode("utf-8")
            data_uri = f"data:{mime_type};base64,{b64_image}"

            element_str = building_element if building_element and building_element.strip() else "structural element"
            user_text = f"Analyze the visible surface crack patterns in this photograph of a {element_str}."

            messages = [
                {"role": "system", "content": CRACK_SYSTEM_PROMPT},
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
            validated = CrackAnalysisResponse(**raw_json)

        except (GrokClientError, Exception) as exc:
            logger.warning("Grok AI crack analysis failed or unavailable: %s. Falling back to calibrated demo data.", str(exc))
            demo_dict = get_demo_crack_analysis(building_element)
            validated = CrackAnalysisResponse(**demo_dict)
    else:
        demo_dict = get_demo_crack_analysis(building_element)
        validated = CrackAnalysisResponse(**demo_dict)

    if db is not None:
        try:
            record = AnalysisRecord(
                module="crack_analysis",
                title=f"Visual Crack Assessment ({validated.building_element})",
                summary=validated.summary,
                risk_level=validated.overall_visual_severity,
                input_meta={"building_element": building_element or ""},
                result_data=validated.model_dump(),
                is_demo=validated.is_demo
            )
            db.add(record)
            db.commit()
            db.refresh(record)
            validated.saved_record_id = record.id
        except Exception as db_exc:
            logger.error("Failed to persist crack analysis in database: %s", str(db_exc))
            db.rollback()

    return validated
