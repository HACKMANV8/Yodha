from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from difflib import get_close_matches
import numpy as np

app = FastAPI()

# 🔹 Load dataset once
data = pd.read_csv("synthetic_crop_full_dataset.csv")

# 🔹 Optional: Crop categories (for category fallback)
crop_categories = {
    "Cereals": ["Rice", "Wheat", "Maize"],
    "Pulses": ["Lentil", "Chickpea", "Pigeon Pea"],
    "Cash Crops": ["Coffee", "Cotton", "Sugarcane", "Tobacco"],
    "Oilseeds": ["Groundnut", "Soybean", "Sunflower"],
    "Vegetables": ["Tomato", "Potato", "Onion"]
}


class CropRequest(BaseModel):
    crop_name: str | None = None
    recommended_crop: str | None = None
    N: float | None = None
    P: float | None = None
    K: float | None = None
    temperature: float | None = None
    humidity: float | None = None
    ph: float | None = None
    rainfall: float | None = None


def get_closest_crop_name(crop_name: str, crop_list):
    """Fuzzy match crop name"""
    match = get_close_matches(crop_name.lower(), [c.lower() for c in crop_list], n=1, cutoff=0.7)
    return match[0].title() if match else None


def get_environmentally_similar_crop(N, P, K, temperature, humidity, ph, rainfall):
    """Find crop with closest environmental + NPK conditions"""
    if None in [N, P, K, temperature, humidity, ph, rainfall]:
        return None
    env_features = data[["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]].values
    input_features = np.array([N, P, K, temperature, humidity, ph, rainfall])
    distances = np.linalg.norm(env_features - input_features, axis=1)
    closest_index = np.argmin(distances)
    return data.iloc[closest_index]["Crop Name"]


@app.post("/get_fertilizer")
def recommend_fertilizer(req: CropRequest):
    crop_name = req.crop_name or req.recommended_crop

    # ✅ Step 1: Direct match
    if crop_name and crop_name in data["Crop Name"].values:
        crop_data = data[data["Crop Name"].str.lower() == crop_name.lower()].iloc[0]

    # ✅ Step 2: Fuzzy match if not exact
    elif crop_name:
        closest = get_closest_crop_name(crop_name, data["Crop Name"].unique())
        if closest:
            crop_data = data[data["Crop Name"].str.lower() == closest.lower()].iloc[0]
            crop_name = closest
        else:
            crop_data = None

    # ✅ Step 3: Category fallback (if crop_data still None)
    if crop_data is None and crop_name:
        for category, crops in crop_categories.items():
            if any(word.lower() in crop_name.lower() for word in category.split()):
                fallback_crop = crops[0]
                crop_data = data[data["Crop Name"].str.lower() == fallback_crop.lower()].iloc[0]
                crop_name = fallback_crop
                break

    # ✅ Step 4: Environmental similarity fallback
    if crop_data is None:
        similar_crop = get_environmentally_similar_crop(
            req.N, req.P, req.K, req.temperature, req.humidity, req.ph, req.rainfall
        )
        if similar_crop:
            crop_data = data[data["Crop Name"].str.lower() == similar_crop.lower()].iloc[0]
            crop_name = similar_crop

    # ✅ Step 5: Graceful error
    if crop_data is None:
        return {
            "error": "Crop not found in dataset.",
            "suggestion": f"Try checking spelling or selecting from available crops: {', '.join(data['Crop Name'].unique()[:10])}..."
        }

    # ✅ Final fertilizer recommendation
    result = {
        "Crop": crop_name.title(),
        "Recommended Fertilizers": crop_data["Recommended Fertilizers"],
        "Dose (kg/ha)": crop_data["Dose_kg_per_ha"],
        "Price (INR/kg)": crop_data["Price_per_kg_INR"],
        "Total Cost (INR/ha)": crop_data["Total_Cost_per_ha_INR"]
    }

    return result
