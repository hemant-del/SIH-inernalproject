from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.database import get_db
from app.models.scheme import Scheme
from app.schemas.common import DocumentReadinessInput, DocumentReadinessResult
from app.utils.helpers import calculate_document_readiness
import io
import json

router = APIRouter(prefix="/api/documents", tags=["Documents"])

@router.post("/readiness", response_model=DocumentReadinessResult)
async def check_readiness(input: DocumentReadinessInput, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Scheme).where(Scheme.id == input.scheme_id))
    scheme = result.scalar_one_or_none()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
        
    req_docs = json.loads(scheme.required_documents) if scheme.required_documents else []
    return calculate_document_readiness(input.documents_provided, req_docs)

@router.post("/analyze")
async def analyze_document(file: UploadFile = File(...)):
    try:
        import pytesseract
        from PIL import Image
        content = await file.read()
        image = Image.open(io.BytesIO(content))
        text = pytesseract.image_to_string(image)
        return {"extracted_text": text, "confidence": 0.8}
    except ImportError:
        return {"error": "OCR dependencies (pytesseract/PIL) not available."}
    except Exception as e:
        return {"error": str(e)}
