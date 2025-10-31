# app/schemas/price_schema.py
from pydantic import BaseModel
from typing import Optional
from datetime import date

class PricePredictionRequest(BaseModel):
    state: str
    district: str
    crop: str
    variety: str
    date: Optional[date] = None

class PricePredictionResponse(BaseModel):
    state: str
    district: str
    crop: str
    variety: str
    date: date
    predicted_modal_price: float
    predicted_min_price: float
    predicted_max_price: float
    confidence: float
    trend: str
    recommended_action: str
    doc_id: Optional[str] = None

class DailyMarketResponse(BaseModel):
    state: str
    district: str
    market: str
    commodity: str
    variety: str
    arrival_date: date
    min_price: float
    max_price: float
    modal_price: float
    arrivals: int
    source: str
    last_updated: str
    doc_id: Optional[str] = None
