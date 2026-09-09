import json

def parse_json_field(value: str) -> list:
    if not value:
        return []
    try:
        return json.loads(value)
    except Exception:
        return []

def format_currency(amount: float) -> str:
    # Basic Indian numbering format
    s = str(int(amount))
    if len(s) > 3:
        s = s[:-3] + ',' + s[-3:]
    return f"₹{s}"

def calculate_document_readiness(provided: list[str], required: list[str]) -> dict:
    if not required:
        return {"score": 100.0, "total_required": 0, "provided": len(provided), "missing": [], "verified": provided, "warnings": []}
    
    provided_set = set([p.lower() for p in provided])
    required_set = set([r.lower() for r in required])
    
    verified = list(required_set.intersection(provided_set))
    missing = list(required_set.difference(provided_set))
    
    score = (len(verified) / len(required_set)) * 100.0
    
    return {
        "score": round(score, 2),
        "total_required": len(required_set),
        "provided": len(verified),
        "missing": missing,
        "verified": verified,
        "warnings": ["Some documents are missing."] if missing else []
    }
