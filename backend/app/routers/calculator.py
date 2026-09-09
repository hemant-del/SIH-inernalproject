from fastapi import APIRouter
from app.schemas.calculator import EMIInput, EMIResult, FinancialHealthInput, FinancialHealthResult, WhatIfInput, WhatIfResult
from app.services.financial_calculator import calculate_emi, analyze_financial_health, what_if_simulation

router = APIRouter(prefix="/api/calculator", tags=["Calculator"])

@router.post("/emi", response_model=EMIResult)
async def calc_emi(input: EMIInput):
    return calculate_emi(input.principal, input.annual_rate, input.tenure_months, input.moratorium_months)

@router.post("/health", response_model=FinancialHealthResult)
async def calc_health(input: FinancialHealthInput):
    return analyze_financial_health(input.monthly_income, input.monthly_expenses, input.existing_emi, input.proposed_emi)

@router.post("/whatif", response_model=WhatIfResult)
async def whatif(input: WhatIfInput):
    return what_if_simulation(input.loan_amount, input.interest_rate, input.tenure_months, input.moratorium_months, input.monthly_income, input.monthly_expenses, input.existing_emi)
