from fastapi import APIRouter
from pydantic import BaseModel
from app.schemas.common import IntentExtractionInput, IntentExtractionResult
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api/ai", tags=["AI"])

class ExplainInput(BaseModel):
    scheme: dict
    user_profile: dict
    language: str = 'en'

@router.post("/extract-intent", response_model=IntentExtractionResult)
async def extract_intent(input: IntentExtractionInput):
    res = await gemini_service.extract_intent(input.message, input.language, input.conversation_history)
    return res

@router.post("/explain")
async def explain_recommendation(input: ExplainInput):
    text = await gemini_service.explain_recommendation(input.scheme, input.user_profile, input.language)
    return {"explanation": text}
