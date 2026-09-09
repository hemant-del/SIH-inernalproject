def calculate_emi(principal: float, annual_rate: float, tenure_months: int, moratorium_months: int = 0) -> dict:
    monthly_rate = (annual_rate / 12) / 100

    # During moratorium, calculate interest accrued
    moratorium_interest = principal * monthly_rate * moratorium_months
    effective_principal = principal + moratorium_interest

    effective_tenure = tenure_months - moratorium_months
    if effective_tenure <= 0:
        return {
            'monthly_emi': 0,
            'total_interest': 0,
            'total_payment': 0,
            'monthly_rate': monthly_rate,
            'effective_principal': effective_principal
        }

    if monthly_rate == 0:
        monthly_emi = effective_principal / effective_tenure
    else:
        monthly_emi = effective_principal * monthly_rate * ((1 + monthly_rate) ** effective_tenure) / (((1 + monthly_rate) ** effective_tenure) - 1)

    total_payment = monthly_emi * effective_tenure
    total_interest = total_payment - principal

    return {
        'monthly_emi': monthly_emi,
        'total_interest': total_interest,
        'total_payment': total_payment,
        'monthly_rate': monthly_rate,
        'effective_principal': effective_principal
    }

def analyze_financial_health(monthly_income: float, monthly_expenses: float, existing_emi: float, proposed_emi: float) -> dict:
    disposable_income = monthly_income - monthly_expenses - existing_emi
    disposable_income_after_emi = disposable_income - proposed_emi
    emi_to_income_ratio = (existing_emi + proposed_emi) / monthly_income if monthly_income > 0 else 1.0

    financial_stress_score = max(0.0, 100 * (1 - (disposable_income_after_emi / monthly_income))) if monthly_income > 0 else 100.0

    if emi_to_income_ratio < 0.3:
        risk_level = "LOW"
    elif emi_to_income_ratio <= 0.5:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    safe_emi_min = max(0.0, disposable_income * 0.3)
    safe_emi_max = max(0.0, disposable_income * 0.5)

    recommendations = []
    if risk_level == "HIGH":
        recommendations.append("Your EMI to income ratio is high. Consider increasing tenure to reduce EMI.")
    elif risk_level == "LOW":
        recommendations.append("Your financial health is stable. You can comfortably manage this EMI.")

    return {
        'disposable_income': disposable_income,
        'emi_to_income_ratio': emi_to_income_ratio,
        'financial_stress_score': financial_stress_score,
        'risk_level': risk_level,
        'safe_emi_min': safe_emi_min,
        'safe_emi_max': safe_emi_max,
        'recommendations': recommendations
    }

def what_if_simulation(loan_amount: float, interest_rate: float, tenure_months: int, moratorium_months: int, monthly_income: float, monthly_expenses: float, existing_emi: float) -> dict:
    emi_result = calculate_emi(loan_amount, interest_rate, tenure_months, moratorium_months)
    health_result = analyze_financial_health(monthly_income, monthly_expenses, existing_emi, emi_result['monthly_emi'])

    return {
        'emi': emi_result,
        'financial_health': health_result,
        'eligible_scheme_ids': [] # Placeholder, could tie to eligibility engine
    }
