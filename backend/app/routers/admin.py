from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database.database import get_db
from app.models.application import Application
from app.models.scheme import Scheme
from app.models.partner import Partner

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/analytics")
async def get_analytics(db: AsyncSession = Depends(get_db)):
    total_apps = await db.scalar(select(func.count(Application.id)))
    total_schemes = await db.scalar(select(func.count(Scheme.id)))
    total_partners = await db.scalar(select(func.count(Partner.id)))
    
    return {
        "total_applications": total_apps,
        "total_schemes": total_schemes,
        "total_partners": total_partners,
        "applications_by_purpose": [],
        "applications_by_status": [],
        "applications_by_month": [],
        "most_popular_scheme": None,
        "average_loan_amount": 0,
        "partner_performance": [],
        "demand_by_state": [],
        "scheme_gap_keywords": []
    }
