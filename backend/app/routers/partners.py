from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.database import get_db
from app.models.partner import Partner
from app.schemas.partner import PartnerRecommendInput, PartnerResponse
from app.services.partner_ranking import rank_partners

router = APIRouter(prefix="/api/partners", tags=["Partners"])

@router.post("/recommend", response_model=PartnerResponse)
async def recommend_partners(input: PartnerRecommendInput, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Partner).where(Partner.is_active == True))
    partners_orm = result.scalars().all()
    partners = [p.to_dict() for p in partners_orm]
    
    s_ids = input.scheme_ids or ([input.scheme_id] if input.scheme_id else [])
    ranked = rank_partners(partners, input.latitude, input.longitude, s_ids)
    
    return {"partners": ranked}

@router.get("")
async def list_partners(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Partner).where(Partner.is_active == True))
    return [p.to_dict() for p in result.scalars().all()]
