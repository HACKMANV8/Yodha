import numpy as np
import joblib
import os
from typing import Dict, Any

# Load the trained model
current_dir = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(current_dir, "risk_assessment_model.pkl")

try:
    model_bundle = joblib.load(MODEL_PATH)
    yield_model = model_bundle["yield_model"]
    profit_model = model_bundle["profit_model"]
    scaler = model_bundle["scaler"]
    encoders = model_bundle["encoders"]
    feature_cols = model_bundle["feature_cols"]
except Exception as e:
    print(f"❌ Error loading risk assessment model: {str(e)}")
    raise

def calculate_climate_risk(temperature: float, humidity: float, rainfall: float) -> float:
    """Calculate climate risk score"""
    temp_risk = abs(temperature - 25) / 15  # Optimal temp around 25°C
    humidity_risk = abs(humidity - 65) / 35  # Optimal humidity around 65%
    rainfall_risk = abs(rainfall - 1000) / 1000  # Optimal rainfall around 1000mm
    
    return (temp_risk + humidity_risk + rainfall_risk) / 3

def assess_risk(data: Dict[str, Any]) -> Dict[str, Any]:
    """Predict yield, profit, and assess risk for given conditions"""
    try:
        # Extract features
        temperature = data.get("temperature", 25)
        humidity = data.get("humidity", 60)
        ph = data.get("ph", 7)
        rainfall = data.get("rainfall", 1000)
        n = data.get("nitrogen", 50)
        p = data.get("phosphorus", 50)
        k = data.get("potassium", 50)
        soil_type = data.get("soil_type", "Loamy")
        crop_name = data.get("crop_name", "Rice")
        
        # Calculate derived features
        npk_balance = abs(n - p) + abs(p - k)
        season_risk = (
            "Low" if (20 <= temperature <= 30 and 50 <= humidity <= 80)
            else "High" if (temperature < 15 or temperature > 35 or humidity < 40 or humidity > 90)
            else "Moderate"
        )
        
        # Encode categorical features
        soil_type_enc = encoders["Soil Type"].transform([soil_type])[0]
        crop_name_enc = encoders["Crop Name"].transform([crop_name])[0]
        season_risk_enc = encoders["Season_Risk"].transform([season_risk])[0]
        
        # Prepare feature vector
        features = np.array([
            n, p, k, temperature, humidity, ph, rainfall,
            npk_balance, soil_type_enc, crop_name_enc, season_risk_enc
        ]).reshape(1, -1)
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Make predictions
        yield_prediction = float(yield_model.predict(features_scaled)[0])
        profit_prediction = float(profit_model.predict(features_scaled)[0])
        
        # Calculate risks
        climate_risk = calculate_climate_risk(temperature, humidity, rainfall)
        yield_uncertainty = 1 - yield_model.score(features_scaled, [yield_prediction])
        price_volatility = abs(profit_prediction) / (yield_prediction + 1e-6)  # Avoid division by zero
        
        risk_score, risk_category = calculate_risk_score(yield_uncertainty, price_volatility, climate_risk)
        
        return {
            "yield_prediction": {
                "value": round(yield_prediction, 2),
                "unit": "tons/ha",
                "confidence": round((1 - yield_uncertainty) * 100, 1)
            },
            "profit_prediction": {
                "value": round(profit_prediction, 2),
                "unit": "INR/ha",
                "confidence": round((1 - price_volatility) * 100, 1)
            },
            "risk_assessment": {
                "score": round(risk_score * 100, 1),
                "category": risk_category,
                "factors": {
                    "climate_risk": round(climate_risk * 100, 1),
                    "yield_uncertainty": round(yield_uncertainty * 100, 1),
                    "price_volatility": round(price_volatility * 100, 1)
                }
            },
            "growing_conditions": {
                "soil_compatibility": round((1 - soil_type_enc/len(encoders["Soil Type"].classes_)) * 100, 1),
                "season_risk": season_risk,
                "npk_balance": round(npk_balance, 2)
            }
        }
        
    except Exception as e:
        print(f"Error in risk assessment: {str(e)}")
        return {
            "error": str(e),
            "suggestion": "Please check input values and try again"
        }