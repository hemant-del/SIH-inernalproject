from sqlalchemy import String, Text, Float, Integer, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
import json
from app.database.database import Base
from app.utils.helpers import parse_json_field

class Scheme(Base):
    __tablename__ = 'schemes'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    max_loan: Mapped[float] = mapped_column(Float)
    min_income: Mapped[float | None] = mapped_column(Float, nullable=True)
    max_income: Mapped[float | None] = mapped_column(Float, nullable=True)
    interest_rate: Mapped[float] = mapped_column(Float)
    moratorium_months: Mapped[int] = mapped_column(Integer, default=0)
    max_tenure_months: Mapped[int] = mapped_column(Integer)
    eligible_purposes: Mapped[str] = mapped_column(Text) # JSON string
    required_documents: Mapped[str] = mapped_column(Text) # JSON string
    min_age: Mapped[int] = mapped_column(Integer, default=18)
    max_age: Mapped[int] = mapped_column(Integer, default=60)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "max_loan": self.max_loan,
            "min_income": self.min_income,
            "max_income": self.max_income,
            "interest_rate": self.interest_rate,
            "moratorium_months": self.moratorium_months,
            "max_tenure_months": self.max_tenure_months,
            "eligible_purposes": parse_json_field(self.eligible_purposes),
            "required_documents": parse_json_field(self.required_documents),
            "min_age": self.min_age,
            "max_age": self.max_age,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
