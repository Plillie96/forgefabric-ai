from typing import TypedDict, Optional
from pydantic import BaseModel


class DealPayload(BaseModel):
    lead_id: Optional[str] = None
    company: str
    contact: str
    budget_estimate: float = 0
    company_size: int = 0
    lead: Optional[dict] = None


class RoiMetrics(BaseModel):
    total: float = 0
    breakdown: dict = {}
