from fastapi import APIRouter, Query
from app.schemas.assistant import AssistantChatRequest, AssistantChatResponse
from app.services.assistant_service import chat_with_assistant

router = APIRouter(prefix="/assistant", tags=["AI Construction Assistant"])


@router.post("/chat", response_model=AssistantChatResponse)
async def chat_assistant_endpoint(
    request: AssistantChatRequest,
    force_demo: bool = Query(False, description="Request demo assistant response")
):
    """
    Conversational assistant for civil engineering methods, materials specifications,
    safety codes, project scheduling, and daily reporting.
    """
    result = await chat_with_assistant(request, force_demo=force_demo)
    return result
