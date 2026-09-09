from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.database import get_db
from app.models.scheme import Scheme

router = APIRouter(prefix="/api/schemes", tags=["Schemes"])

@router.get("")
async def list_schemes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Scheme).where(Scheme.is_active == True))
    schemes = result.scalars().all()
    return [s.to_dict() for s in schemes]

@router.get("/{scheme_id}")
async def get_scheme(scheme_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Scheme).where(Scheme.id == scheme_id))
    scheme = result.scalar_one_or_none()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme.to_dict()
