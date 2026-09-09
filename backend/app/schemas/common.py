from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class IntentExtractionInput(BaseModel):
    message: str
    language: str = 'en'
    conversation_history: Optional[List[Dict[str, Any]]] = None

class IntentExtractionResult(BaseModel):
    intent: str = "profile_building"

    purpose: Optional[str] = None
    business_type: Optional[str] = None
    loan_amount: Optional[float] = None
    project_cost: Optional[float] = None
    annual_income: Optional[float] = None
    age: Optional[int] = None
    education_status: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None

    language: str = 'en'

    missing_fields: List[str] = []

    follow_up_question: Optional[str] = None

    direct_answer: Optional[str] = None

    confidence: float = 0.0

class ProjectReportInput(BaseModel):
    business_type: str
    location: str
    investment_amount: float
    equipment: List[str]
    expected_monthly_revenue: float
    estimated_monthly_expenses: float
    loan_amount: float

class DocumentReadinessInput(BaseModel):
    documents_provided: List[str]
    scheme_id: int

class DocumentReadinessResult(BaseModel):
    score: float
    total_required: int
    provided: int
    missing: List[str]
    verified: List[str]
    warnings: List[str]
