def check_eligibility(user_profile: dict, scheme: dict) -> dict:
    eligible = True
    reasons = []
    disqualifiers = []

    # 1. Income check
    income = user_profile.get('income', 0)
    min_income = scheme.get('min_income')
    max_income = scheme.get('max_income')
    if min_income is not None and income < min_income:
        eligible = False
        disqualifiers.append(f"Income ₹{income} is below minimum requirement of ₹{min_income}")
    elif max_income is not None and income > max_income:
        eligible = False
        disqualifiers.append(f"Income ₹{income} is above maximum limit of ₹{max_income}")
    else:
        reasons.append("Income falls within the required range.")

    # 2. Loan Amount check
    loan_amount = user_profile.get('loan_amount', 0)
    max_loan = scheme.get('max_loan')
    if loan_amount > max_loan:
        eligible = False
        disqualifiers.append(f"Requested loan ₹{loan_amount} exceeds scheme maximum of ₹{max_loan}")
    else:
        reasons.append("Requested loan amount is within permissible limits.")

    # 3. Project Cost check
    project_cost = user_profile.get('project_cost', 0)
    if loan_amount > project_cost:
        eligible = False
        disqualifiers.append("Loan amount cannot exceed the total project cost.")
    else:
        reasons.append("Project cost justifies the loan amount.")

    # 4. Purpose check
    purpose = user_profile.get('purpose', '').lower()
    eligible_purposes = [p.lower() for p in scheme.get('eligible_purposes', [])]
    if purpose not in eligible_purposes:
        eligible = False
        disqualifiers.append(f"Purpose '{purpose}' is not supported by this scheme.")
    else:
        reasons.append(f"Purpose '{purpose}' is eligible.")

    # 5. Age check
    age = user_profile.get('age')
    if age is not None:
        min_age = scheme.get('min_age', 18)
        max_age = scheme.get('max_age', 60)
        if age < min_age or age > max_age:
            eligible = False
            disqualifiers.append(f"Age {age} is outside the permitted range ({min_age}-{max_age}).")
        else:
            reasons.append("Age criteria met.")

    return {
        'scheme_id': scheme['id'],
        'scheme_name': scheme['name'],
        'eligible': eligible,
        'reasons': reasons,
        'disqualifiers': disqualifiers
    }

def check_all_schemes(user_profile: dict, schemes: list[dict]) -> tuple[list, list]:
    eligible_list = []
    ineligible_list = []
    for s in schemes:
        res = check_eligibility(user_profile, s)
        if res['eligible']:
            eligible_list.append(res)
        else:
            ineligible_list.append(res)
    return eligible_list, ineligible_list
