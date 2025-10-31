import pandas as pd
import numpy as np
import joblib
from difflib import get_close_matches
import os
from typing import Optional, Dict

# -----------------------
# Load Trained Model
# -----------------------
current_dir = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(current_dir, "fertilizer_model.pkl")

try:
    model_bundle = joblib.load(MODEL_PATH)
    model = model_bundle["model"]
    scaler = model_bundle["scaler"]
    target_encoder = model_bundle["target_encoder"]
    cat_encoders = model_bundle["cat_encoders"]
except Exception as e:
    raise RuntimeError(f"❌ Error loading fertilizer model: {e}")

# -----------------------
# Crop Categories
# -----------------------
crop_categories = {
    "Cereals": ["Rice", "Wheat", "Maize"],
    "Pulses": ["Lentil", "Chickpea", "Pigeon Pea"],
    "Cash Crops": ["Coffee", "Cotton", "Sugarcane", "Tobacco"],
    "Oilseeds": ["Groundnut", "Soybean", "Sunflower"],
    "Vegetables": ["Tomato", "Potato", "Onion"]
}

# -----------------------
# Helpers
# -----------------------
def get_closest_crop_name(crop_name: str) -> Optional[str]:
    known_crops = [c.lower() for c in cat_encoders["Crop Name"].classes_]
    match = get_close_matches(crop_name.lower(), known_crops, n=1, cutoff=0.6)
    return match[0].title() if match else None

def get_soil_type_suggestion(ph: float) -> str:
    if ph < 5.5:
        return "Acidic"
    elif ph < 7.5:
        return "Neutral"
    else:
        return "Alkaline"

# -----------------------
# Prediction Logic
# -----------------------
def predict_npk_ratio(features: Dict) -> Dict:
    try:
        # Input extraction
        temperature = float(features.get("temperature", 25))
        humidity = float(features.get("humidity", 60))
        ph = float(features.get("ph", 7))
        rainfall = float(features.get("rainfall", 1000))
        
        soil_type = features.get("soil_type") or get_soil_type_suggestion(ph)
        crop_name = features.get("crop_name", "")

        # Crop match if mismatch
        if crop_name and crop_name not in cat_encoders["Crop Name"].classes_:
            closest = get_closest_crop_name(crop_name)
            crop_name = closest or "Rice"

        # Prepare input array
        numeric_scaled = scaler.transform([[temperature, humidity, ph, rainfall]])

        soil_enc = cat_encoders["Soil Type"].transform([soil_type])[0]
        crop_enc = cat_encoders["Crop Name"].transform([crop_name])[0]

        X = np.hstack([numeric_scaled, soil_enc.reshape(1, -1), crop_enc.reshape(1, -1)])

        # Model prediction
        prediction = model.predict(X)[0]
        recommended_ratio = target_encoder.inverse_transform([prediction])[0]

        # Confidence handling
        confidence = None
        if hasattr(model, "predict_proba"):
            confidence = float(max(model.predict_proba(X)[0]))

        n, p, k = map(float, recommended_ratio.split(":"))

        return {
            "crop": crop_name.title(),
            "soil_type": soil_type,
            "npk_recommendation": {
                "N": n,
                "P": p,
                "K": k,
                "ratio": recommended_ratio,
                "confidence": confidence
            },
            "conditions": {
                "temperature": temperature,
                "humidity": humidity,
                "ph": ph,
                "rainfall": rainfall
            },
            "additional_info": {
                "soil_condition": "Acidic" if ph < 6.5 else "Neutral" if ph < 7.5 else "Alkaline",
                "moisture_level": "Low" if humidity < 50 else "Moderate" if humidity < 70 else "High"
            }
        }

    except Exception as e:
        return {"error": str(e), "suggestion": "Check inputs & try again"}

# -----------------------
# Wrapper for backend
# -----------------------
def recommend_fertilizer_logic(req):
    features = {
        "temperature": getattr(req, "temperature", None),
        "humidity": getattr(req, "humidity", None),
        "ph": getattr(req, "ph", None),
        "rainfall": getattr(req, "rainfall", None),
        "soil_type": getattr(req, "soil_type", None),
        "crop_name": getattr(req, "crop_name", None)
    }

    result = predict_npk_ratio(features)
    if "error" in result:
        return result

    return {"status": "success", "recommendation": result}
