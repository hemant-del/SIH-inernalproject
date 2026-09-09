from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.database import get_db
from app.models.scheme import Scheme
from app.schemas.recommendation import UserProfileInput, RecommendationResponse
from app.services.eligibility_engine import check_all_schemes
from app.services.recommendation_engine import rank_schemes

router = APIRouter(prefix="/api/recommendation", tags=["Recommendation"])

@router.post("", response_model=RecommendationResponse)
async def recommend_schemes(user_input: UserProfileInput, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Scheme).where(Scheme.is_active == True))
    schemes_orm = result.scalars().all()
    schemes = [s.to_dict() for s in schemes_orm]
    
    user_profile = user_input.model_dump()
    
    eligible, ineligible = check_all_schemes(user_profile, schemes)
    
    eligible_schemes_full = [s for s in schemes if any(e['scheme_id'] == s['id'] for e in eligible)]
    ranked = rank_schemes(user_profile, eligible_schemes_full, schemes)
    
    return {
        "recommendations": ranked,
        "ineligible": ineligible,
        "user_profile": user_profile
    }
