from fastapi import APIRouter, HTTPException
from app.services.weather_service import get_weather_forecast, get_soil_moisture_prediction
from app.schemas.response_schema import WeatherResponse

router = APIRouter()

@router.get("/weather/{location}")
async def get_weather(location: str):
    try:
        weather_data = get_weather_forecast(location)
        return WeatherResponse(
            status="success",
            data=weather_data,
            message="Weather data retrieved successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/weather/moisture-prediction")
async def predict_soil_moisture(rainfall: float, temperature: float):
    try:
        moisture = get_soil_moisture_prediction(rainfall, temperature)
        return {
            "status": "success",
            "data": {
                "predicted_moisture": moisture
            },
            "message": "Soil moisture prediction successful"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))