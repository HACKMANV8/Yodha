from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

app = FastAPI()

class CropInput(BaseModel):
    crop_name: str
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float
    soil_type: str

@app.post("/predict")
def predict_crop(data: CropInput):
    try:
        # Dummy prediction logic (replace with your trained model)
        predicted_yield = np.float32(14.36)
        predicted_profit = np.float32(-220.13)
        risk_score = np.float32(0.217)
        current_price = np.float32(22.0)

        # ✅ Convert NumPy floats to native Python types
        response = {
            "recommended_crop": data.crop_name,
            "predicted_yield_kg_per_ha": float(predicted_yield),
            "predicted_profit_inr_per_ha": float(predicted_profit),
            "risk_score": float(risk_score),
            "current_market_price": float(current_price)
        }

        return response

    except Exception as e:
        return {"error": str(e)}
