from pydantic import BaseModel
from typing import List, Optional

class PartnerRecommendInput(BaseModel):
    latitude: float
    longitude: float
    scheme_id: Optional[int] = None
    scheme_ids: Optional[List[int]] = None

class PartnerScore(BaseModel):
    partner_id: int
    name: str
    partner_type: str
    distance_km: float
    travel_time_mins: Optional[float] = None
    score: float
    match_pct: int
    reasons: List[str]
    state: str
    district: str
    address: str
    contact_phone: Optional[str] = None
    fund_utilization_pct: float
    avg_processing_days: int
    reliability_score: float
    supported_schemes: List[int]

class PartnerResponse(BaseModel):
    partners: List[PartnerScore]
