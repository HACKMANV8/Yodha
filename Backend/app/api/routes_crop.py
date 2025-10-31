# app/api/routes_crop.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ml.model_inference import predict_crop
from app.core.firebase_utils import init_firebase
import datetime

router = APIRouter()

# Initialize Firestore
db = init_firebase()

class CropRequest(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

@router.get("/get_all_crops")
async def get_all_crops():
    """Fetch all crop records from Firebase."""
    try:
        docs = db.collection("crop_data").stream()
        data = []
        for doc in docs:
            item = doc.to_dict()
            item["id"] = doc.id
            data.append(item)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/add_crop_data")
async def add_crop_data(data: CropRequest):
    try:
        # ✅ Predict crop
        prediction = predict_crop(data.dict())

        # ✅ Store in Firebase
        doc_ref = db.collection("crop_data").add({
            "N": data.N,
            "P": data.P,
            "K": data.K,
            "temperature": data.temperature,
            "humidity": data.humidity,
            "ph": data.ph,
            "rainfall": data.rainfall,
            "predicted_crop": prediction["recommended_crop"],
            "timestamp": datetime.datetime.utcnow()
        })

        return {
            "status": "success",
            "recommended_crop": prediction["recommended_crop"],
            "doc_id": doc_ref[1].id
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
