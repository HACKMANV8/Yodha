# app/core/service_utils.py
from typing import Dict, Any
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

def handle_prediction_error(e: Exception, model_name: str) -> Dict[str, Any]:
    """Standardized error handling for ML model predictions"""
    error_msg = f"Error in {model_name}: {str(e)}"
    logger.error(error_msg)
    raise HTTPException(status_code=500, detail=error_msg)

def validate_model_input(data: Dict[str, Any], required_fields: list) -> None:
    """Validate that all required fields are present in the input data"""
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required fields: {', '.join(missing_fields)}"
        )

def format_prediction_response(
    prediction: Any,
    confidence: float = None,
    metadata: Dict[str, Any] = None
) -> Dict[str, Any]:
    """Format model prediction response with standard structure"""
    response = {
        "status": "success",
        "prediction": prediction,
    }
    
    if confidence is not None:
        response["confidence"] = confidence
    
    if metadata:
        response["metadata"] = metadata
        
    return response