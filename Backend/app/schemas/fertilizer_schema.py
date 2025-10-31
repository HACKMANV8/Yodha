from pydantic import BaseModel
from typing import Optional

class FertilizerRequest(BaseModel):
    crop_name: Optional[str] = None
    soil_type: Optional[str] = None
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class FertilizerResponse(BaseModel):
    status: str
    recommendation: dict
