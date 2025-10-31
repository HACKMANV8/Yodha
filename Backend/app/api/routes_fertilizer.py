from fastapi import APIRouter, HTTPException
from app.schemas.fertilizer_schema import CropRequest
from app.ml.fertilizer_model import recommend_fertilizer_logic

router = APIRouter()

@router.post("/get_fertilizer")
async def get_fertilizer_recommendation(req: CropRequest):
    try:
        result = recommend_fertilizer_logic(req)
        return {"status": "success", "recommendation": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
