from fastapi import APIRouter, HTTPException
from app.schemas.risk_schema import RiskAssessmentRequest, RiskAssessmentResponse
from app.ml.risk_assessment import assess_risk
from app.core.firebase_utils import init_firebase
from datetime import datetime

router = APIRouter()
db = init_firebase()

@router.post("/assess_risk", response_model=RiskAssessmentResponse)
async def get_risk_assessment(req: RiskAssessmentRequest):
    try:
        # Get assessment from ML model
        result = assess_risk(req.dict())
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        # Store assessment in Firebase
        assessment_doc = {
            "timestamp": datetime.utcnow().isoformat(),
            "input_params": req.dict(),
            "assessment": result
        }
        
        db.collection("risk_assessments").add(assessment_doc)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))