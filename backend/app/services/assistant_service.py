import logging
import uuid
from typing import Optional, List
from app.config import settings
from app.schemas.assistant import AssistantChatRequest, AssistantChatResponse, ChatMessage
from app.services.grok_client import grok_client, GrokClientError
from app.services.demo_data import get_demo_assistant_response

logger = logging.getLogger("mcip.assistant_service")

ASSISTANT_SYSTEM_PROMPT = """You are the AI Construction Intelligence Assistant for the MCIP platform.
Your expertise spans:
- Civil and structural engineering concepts (concrete mix design, curing, rebar, steel structures, soil mechanics).
- Construction site safety standards (OSHA 1926, HSE, PPE requirements, fall protection, excavation shoring).
- Project management & scheduling (Critical Path Method, Lean Construction, delay mitigation).
- Material testing standards (ASTM, IS, BS, EN specifications) and quality control.
- Daily site reporting and contractor communication.

Guidelines:
1. Explain technical concepts in clear, professional, understandable language.
2. Clearly communicate uncertainty where site-specific data or geotechnical tests are missing.
3. NEVER invent or fabricate non-existent building codes, standards, or test numbers.
4. For safety-critical or structural modifications, advise users to obtain sign-off from certified on-site professional engineers.
5. Provide helpful structured markdown with bullet points, numbered lists, and bold headings.
"""


async def chat_with_assistant(
    request: AssistantChatRequest,
    force_demo: bool = False
) -> AssistantChatResponse:
    session_id = request.session_id or str(uuid.uuid4())
    is_live = settings.is_ai_live_ready and not force_demo

    if is_live:
        try:
            messages = [{"role": "system", "content": ASSISTANT_SYSTEM_PROMPT}]
            if request.history:
                for turn in request.history[-6:]:
                    messages.append({"role": turn.role, "content": turn.content})
            messages.append({"role": "user", "content": request.message})

            raw_resp = await grok_client.chat_completion(
                messages=messages,
                model=settings.GROK_MODEL,
                temperature=0.3,
                max_tokens=2000,
                expect_json=False
            )
            raw_text = raw_resp.get("raw_text", "")

            # Extract conceptual terms
            concepts = ["Civil Engineering Practice", "Building Codes & Standards"]
            if "concrete" in request.message.lower():
                concepts = ["Concrete Hydration", "Compressive Strength (ASTM C39)"]
            elif "safety" in request.message.lower():
                concepts = ["Hierarchy of Controls", "OSHA 1926 Safety Standard"]

            return AssistantChatResponse(
                response_text=raw_text,
                technical_concepts=concepts,
                suggested_followups=[
                    "Can you elaborate on quality control testing procedures?",
                    "What are the relevant OSHA / local code requirements?",
                    "How does this impact project schedule and critical path?"
                ],
                is_demo=False,
                session_id=session_id
            )

        except (GrokClientError, Exception) as exc:
            logger.warning("Grok AI assistant call failed: %s. Falling back to demo assistant.", str(exc))
            demo_dict = get_demo_assistant_response(request.message)
            demo_dict["session_id"] = session_id
            return AssistantChatResponse(**demo_dict)
    else:
        demo_dict = get_demo_assistant_response(request.message)
        demo_dict["session_id"] = session_id
        return AssistantChatResponse(**demo_dict)
