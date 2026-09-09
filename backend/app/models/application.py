from sqlalchemy import String, Float, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.database.database import Base

class Application(Base):
    __tablename__ = 'applications'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    applicant_name: Mapped[str] = mapped_column(String(200))
    purpose: Mapped[str] = mapped_column(String(100))
    business_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    loan_amount: Mapped[float] = mapped_column(Float)
    project_cost: Mapped[float] = mapped_column(Float)
    annual_income: Mapped[float] = mapped_column(Float)
    age: Mapped[int] = mapped_column(Integer)
    state: Mapped[str] = mapped_column(String(100))
    district: Mapped[str] = mapped_column(String(100))
    category: Mapped[str] = mapped_column(String(50), default='SC')
    education_status: Mapped[str | None] = mapped_column(String(100), nullable=True)
    scheme_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    partner_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default='initiated')
    readiness_score: Mapped[float] = mapped_column(Float, default=0.0)
    language: Mapped[str] = mapped_column(String(10), default='en')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
