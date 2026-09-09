from pydantic import BaseModel
from typing import List

class EMIInput(BaseModel):
    principal: float
    annual_rate: float
    tenure_months: int
    moratorium_months: int = 0

class EMIResult(BaseModel):
    monthly_emi: float
    total_interest: float
    total_payment: float
    monthly_rate: float
    effective_principal: float

class FinancialHealthInput(BaseModel):
    monthly_income: float
    monthly_expenses: float
    existing_emi: float
    proposed_emi: float

class FinancialHealthResult(BaseModel):
    disposable_income: float
    emi_to_income_ratio: float
    financial_stress_score: float
    risk_level: str
    safe_emi_min: float
    safe_emi_max: float
    recommendations: List[str]

class WhatIfInput(BaseModel):
    loan_amount: float
    interest_rate: float
    tenure_months: int
    moratorium_months: int = 0
    monthly_income: float
    monthly_expenses: float
    existing_emi: float

class WhatIfResult(BaseModel):
    emi: EMIResult
    financial_health: FinancialHealthResult
    eligible_scheme_ids: List[int]
