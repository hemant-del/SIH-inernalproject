def score_scheme(user_profile: dict, scheme: dict, all_schemes: list[dict]) -> dict:
    score = 0.0
    reasons = []

    # Calculate eligibility_match (40%)
    # All rules pass since we are mostly scoring eligible schemes
    score += 40
    reasons.append("Meets all core eligibility criteria.")

    # Calculate purpose_match (25%)
    purpose = user_profile.get('purpose', '').lower()
    eligible_purposes = [p.lower() for p in scheme.get('eligible_purposes', [])]
    if purpose in eligible_purposes:
        score += 25
        reasons.append("Exact purpose match.")
    else:
        score += 15 # partial match logic could be added
        reasons.append("Related purpose match.")

    # Calculate loan_amount_match (20%)
    loan_amount = user_profile.get('loan_amount', 0)
    max_loan = scheme.get('max_loan', 1)
    ratio = loan_amount / max_loan
    if 0.5 <= ratio <= 1.0:
        score += 20
        reasons.append("Loan amount optimally fits scheme limits.")
    else:
        score += 10
        reasons.append("Loan amount fits scheme limits.")

    # Calculate interest_advantage (15%)
    avg_interest = sum(s.get('interest_rate', 0) for s in all_schemes) / len(all_schemes) if all_schemes else 5.0
    interest = scheme.get('interest_rate', 5.0)
    if interest < avg_interest:
        score += 15
        reasons.append("Competitive interest rate.")
    elif interest == avg_interest:
        score += 10
        reasons.append("Standard interest rate.")
    else:
        score += 5
        reasons.append("Higher than average interest rate.")

    return {
        "scheme_id": scheme['id'],
        "scheme_name": scheme['name'],
        "score": round(score, 2),
        "match_pct": int(score),
        "reasons": reasons,
        "interest_rate": scheme.get('interest_rate', 0.0),
        "max_loan": scheme.get('max_loan', 0.0),
        "max_tenure_months": scheme.get('max_tenure_months', 0),
        "moratorium_months": scheme.get('moratorium_months', 0),
        "required_documents": scheme.get('required_documents', [])
    }

def rank_schemes(user_profile: dict, eligible_schemes: list[dict], all_schemes: list[dict]) -> list[dict]:
    scored = [score_scheme(user_profile, s, all_schemes) for s in eligible_schemes]
    scored.sort(key=lambda x: x['score'], reverse=True)
    return scored[:3]
