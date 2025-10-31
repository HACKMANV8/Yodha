from fastapi import APIRouter, HTTPException
from app.schemas.fertilizer_schema import FertilizerRequest, FertilizerResponse
from app.ml.fertilizer_model import recommend_fertilizer_logic
from app.core.firebase_utils import init_firebase
from datetime import datetime

router = APIRouter()
db = init_firebase()

@router.post("/get_fertilizer", response_model=FertilizerResponse)
async def get_fertilizer_recommendation(req: FertilizerRequest):
    try:
        # Get recommendation from ML model
        result = recommend_fertilizer_logic(req)
        
        # Store recommendation in Firebase
        recommendation_doc = {
            "timestamp": datetime.utcnow().isoformat(),
            "input_params": req.dict(),
            "recommendation": result
        }
        
        db.collection("fertilizer_recommendations").add(recommendation_doc)
        
        return FertilizerResponse(
            status="success",
            recommendation=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
