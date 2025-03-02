from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class CashFlowRecord(BaseModel):
    time: int # number of days before the application
    amount: float
    category: str

class DigitalFootprint(BaseModel):
    tiktok: Optional[Dict[str, Any]] = None

class User(BaseModel):
    email: str
    hashed_password: str
    general_info: Dict[str, Any]
    cash_flow: Optional[List[CashFlowRecord]] = None
    digital_footprint: Optional[List[DigitalFootprint]] = None
    official_documents: Optional[str] = None
    application_history: str # -1 as default, 1 for paid loan back, 0 for did not pay back