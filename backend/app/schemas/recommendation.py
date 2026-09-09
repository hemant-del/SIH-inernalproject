from pydantic import BaseModel
from typing import List, Optional

class UserProfileInput(BaseModel):
    income: float
    loan_amount: float
    purpose: str
    project_cost: float
    age: Optional[int] = None
    education_status: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    category: str = 'SC'

class EligibilityResult(BaseModel):
    scheme_id: int
    scheme_name: str
    eligible: bool
    reasons: List[str]
    disqualifiers: List[str]

class SchemeRecommendation(BaseModel):
    scheme_id: int
    scheme_name: str
    score: float
    match_pct: int
    reasons: List[str]
    interest_rate: float
    max_loan: float
    max_tenure_months: int
    moratorium_months: int
    required_documents: List[str]

class RecommendationResponse(BaseModel):
    recommendations: List[SchemeRecommendation]
    ineligible: List[EligibilityResult]
    user_profile: dict
