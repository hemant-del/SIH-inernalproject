import math

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0 # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def score_partner(partner: dict, user_lat: float, user_lon: float, scheme_ids: list[int]) -> dict:
    score = 0.0
    reasons = []

    # 1. Scheme compatibility (30%)
    partner_schemes = partner.get('supported_schemes', [])
    if any(s_id in partner_schemes for s_id in scheme_ids):
        score += 30
        reasons.append("Supports your eligible schemes.")
    else:
        reasons.append("Does not strongly match recommended schemes.")

    # 2. Fund availability (25%)
    utilization = partner.get('fund_utilization_pct', 100)
    fund_avail_score = ((100 - utilization) / 100.0) * 25
    score += fund_avail_score
    if fund_avail_score > 15:
        reasons.append("Good fund availability.")

    # 3. Processing efficiency (20%)
    avg_days = partner.get('avg_processing_days', 30)
    efficiency = max(0, 30 - avg_days) / 30.0 * 20
    score += efficiency
    if avg_days < 10:
        reasons.append("Fast processing time.")

    # 4. Distance score (15%)
    distance = haversine_distance(user_lat, user_lon, partner['latitude'], partner['longitude'])
    dist_score = max(0, 50 - distance) / 50.0 * 15
    score += dist_score
    if distance < 10:
        reasons.append(f"Nearby partner ({distance:.1f} km).")

    # 5. Reliability score (10%)
    reliability = partner.get('reliability_score', 50)
    rel_score = (reliability / 100.0) * 10
    score += rel_score

    # Load-balancing penalty
    pending = partner.get('pending_applications', 0)
    capacity = partner.get('max_capacity', 500)
    if pending > capacity * 0.9:
        score *= 0.70
        reasons.append("Partner is currently experiencing high load.")
    elif pending > capacity * 0.8:
        score *= 0.85
        reasons.append("Partner is moderately loaded.")

    return {
        "partner_id": partner['id'],
        "name": partner['name'],
        "partner_type": partner['partner_type'],
        "distance_km": round(distance, 2),
        "travel_time_mins": None,
        "score": round(score, 2),
        "match_pct": int(score),
        "reasons": reasons,
        "state": partner['state'],
        "district": partner['district'],
        "address": partner['address'],
        "contact_phone": partner['contact_phone'],
        "fund_utilization_pct": partner['fund_utilization_pct'],
        "avg_processing_days": partner['avg_processing_days'],
        "reliability_score": partner['reliability_score'],
        "supported_schemes": partner_schemes
    }

def rank_partners(partners: list[dict], user_lat: float, user_lon: float, scheme_ids: list[int], top_n: int = 3) -> list[dict]:
    scored = [score_partner(p, user_lat, user_lon, scheme_ids) for p in partners]
    scored.sort(key=lambda x: x['score'], reverse=True)
    return scored[:top_n]
