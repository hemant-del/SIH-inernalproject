from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import Depends
from app.database.database import get_db
from datetime import datetime


class ContactRequest(BaseModel):
    name: str
    email: str
    phone: str = ""
    subject: str
    message: str


class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    subject: str
    message: str
    status: str
    created_at: str


router = APIRouter(prefix="/api/contact", tags=["Contact"])


# In-memory store as fallback (real persistence via Firestore on frontend)
_contact_store: list[dict] = []
_next_id = 1


@router.post("")
async def submit_contact(req: ContactRequest):
    global _next_id
    entry = {
        "id": _next_id,
        "name": req.name,
        "email": req.email,
        "phone": req.phone,
        "subject": req.subject,
        "message": req.message,
        "status": "new",
        "created_at": datetime.utcnow().isoformat(),
    }
    _contact_store.append(entry)
    _next_id += 1
    return {"success": True, "id": entry["id"]}


@router.get("")
async def list_contacts():
    return {"contacts": _contact_store, "total": len(_contact_store)}
