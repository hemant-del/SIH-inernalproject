from sqlalchemy import String, Float, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.database.database import Base
from app.utils.helpers import parse_json_field

class Partner(Base):
    __tablename__ = 'partners'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200))
    partner_type: Mapped[str] = mapped_column(String(50))
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    state: Mapped[str] = mapped_column(String(100))
    district: Mapped[str] = mapped_column(String(100))
    address: Mapped[str] = mapped_column(String(500))
    contact_phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    supported_schemes: Mapped[str] = mapped_column(String(500)) # JSON string
    fund_utilization_pct: Mapped[float] = mapped_column(Float)
    npa_score: Mapped[float] = mapped_column(Float)
    pending_applications: Mapped[int] = mapped_column(Integer)
    avg_processing_days: Mapped[int] = mapped_column(Integer)
    reliability_score: Mapped[float] = mapped_column(Float)
    max_capacity: Mapped[int] = mapped_column(Integer, default=500)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "partner_type": self.partner_type,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "state": self.state,
            "district": self.district,
            "address": self.address,
            "contact_phone": self.contact_phone,
            "supported_schemes": parse_json_field(self.supported_schemes),
            "fund_utilization_pct": self.fund_utilization_pct,
            "npa_score": self.npa_score,
            "pending_applications": self.pending_applications,
            "avg_processing_days": self.avg_processing_days,
            "reliability_score": self.reliability_score,
            "max_capacity": self.max_capacity,
            "is_active": self.is_active
        }
