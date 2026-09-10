CATEGORY_GROUPS = {
    "business": {"business", "shop", "startup", "enterprise", "tailoring", "tailor", "retail", "kirana", "trading", "services", "manufacturing", "self_employment", "commercial", "micro", "store", "vendor", "repair", "small business"},
    "agriculture": {"agriculture", "farm", "farming", "dairy", "poultry", "fishery", "crop", "cattle", "allied", "livestock", "agro", "fish"},
    "education": {"education", "study", "college", "university", "school", "course", "fees", "student", "skill", "skill_training", "training", "degree"},
    "housing": {"housing", "home", "house", "construction", "renovation", "repair", "flat", "plot", "building", "property"},
    "handicraft": {"handicraft", "artisan", "craft", "pottery", "weaving", "self_employment"},
    "green_energy": {"green_energy", "solar", "biogas", "renewable", "energy"},
}

def is_purpose_match(user_purpose: str, scheme_purposes: list[str]) -> bool:
    if not user_purpose:
        return True
    u = user_purpose.lower().strip()
    s_purposes = [p.lower().strip() for p in scheme_purposes]
    
    # Direct match or substring
    for sp in s_purposes:
        if sp in u or u in sp:
            return True
            
    # Category mappings
    user_cats = {cat for cat, words in CATEGORY_GROUPS.items() if any(w in u for w in words)}
    for sp in s_purposes:
        sp_cats = {cat for cat, words in CATEGORY_GROUPS.items() if any(w in sp for w in words)}
        if user_cats & sp_cats:
            return True
            
    return False

def check_eligibility(user_profile: dict, scheme: dict) -> dict:
    eligible = True
    reasons = []
    disqualifiers = []

    # 1. Income check
    income = user_profile.get('income')
    min_income = scheme.get('min_income')
    max_income = scheme.get('max_income')
    if income is not None and income > 0:
        if min_income is not None and income < min_income:
            eligible = False
            disqualifiers.append(f"Income Rs. {income} is below minimum requirement of Rs. {min_income}")
        elif max_income is not None and income > max_income:
            eligible = False
            disqualifiers.append(f"Income Rs. {income} is above maximum limit of Rs. {max_income}")
        else:
            reasons.append("Income falls within the required range.")
    else:
        reasons.append("Income criteria met.")

    # 2. Loan Amount check
    loan_amount = user_profile.get('loan_amount', 0)
    max_loan = scheme.get('max_loan', float('inf'))
    if loan_amount > max_loan:
        eligible = False
        disqualifiers.append(f"Requested loan Rs. {loan_amount} exceeds scheme maximum of Rs. {max_loan}")
    else:
        reasons.append("Requested loan amount is within permissible limits.")

    # 3. Project Cost check (auto-adjust project_cost to at least loan_amount)
    project_cost = user_profile.get('project_cost') or loan_amount
    if loan_amount > project_cost:
        eligible = False
        disqualifiers.append("Loan amount cannot exceed total project cost.")
    else:
        reasons.append("Project cost justifies the loan amount.")

    # 4. Purpose check (flexible category-based matching)
    purpose = user_profile.get('purpose', '')
    eligible_purposes = scheme.get('eligible_purposes', [])
    if not is_purpose_match(purpose, eligible_purposes):
        eligible = False
        disqualifiers.append(f"Purpose '{purpose}' is not supported by this scheme.")
    else:
        reasons.append(f"Purpose '{purpose}' is eligible.")

    # 5. Age check
    age = user_profile.get('age')
    if age is not None and age > 0:
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
