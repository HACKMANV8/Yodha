from pydantic import BaseModel, Field
from typing import Optional

class RiskAssessmentRequest(BaseModel):
    crop_name: str
    soil_type: str
    temperature: float = Field(..., ge=0, le=50)
    humidity: float = Field(..., ge=0, le=100)
    ph: float = Field(..., ge=0, le=14)
    rainfall: float = Field(..., ge=0)
    nitrogen: float = Field(..., ge=0)
    phosphorus: float = Field(..., ge=0)
    potassium: float = Field(..., ge=0)

class YieldPrediction(BaseModel):
    value: float
    unit: str
    confidence: float

class ProfitPrediction(BaseModel):
    value: float
    unit: str
    confidence: float

class RiskFactors(BaseModel):
    climate_risk: float
    yield_uncertainty: float
    price_volatility: float

class RiskAssessment(BaseModel):
    score: float
    category: str
    factors: RiskFactors

class GrowingConditions(BaseModel):
    soil_compatibility: float
    season_risk: str
    npk_balance: float

class RiskAssessmentResponse(BaseModel):
    yield_prediction: YieldPrediction
    profit_prediction: ProfitPrediction
    risk_assessment: RiskAssessment
    growing_conditions: GrowingConditions