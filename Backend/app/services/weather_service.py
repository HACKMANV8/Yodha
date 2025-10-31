from typing import Dict
import requests
import os
from dotenv import load_dotenv

load_dotenv()

WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')
BASE_URL = "http://api.weatherapi.com/v1"

def get_weather_forecast(location: str, days: int = 7) -> Dict:
    """
    Get weather forecast data for a location
    """
    try:
        url = f"{BASE_URL}/forecast.json"
        params = {
            "key": WEATHER_API_KEY,
            "q": location,
            "days": days,
            "aqi": "yes"  # Include air quality data
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        
        # Format the response for frontend consumption
        forecast_data = {
            "location": {
                "name": data["location"]["name"],
                "region": data["location"]["region"],
                "country": data["location"]["country"]
            },
            "current": {
                "temp_c": data["current"]["temp_c"],
                "humidity": data["current"]["humidity"],
                "condition": data["current"]["condition"]["text"],
                "wind_kph": data["current"]["wind_kph"],
                "precip_mm": data["current"]["precip_mm"],
                "air_quality": data["current"].get("air_quality", {}).get("pm10", 0)
            },
            "forecast": []
        }
        
        # Process forecast data
        for day in data["forecast"]["forecastday"]:
            forecast_data["forecast"].append({
                "date": day["date"],
                "max_temp_c": day["day"]["maxtemp_c"],
                "min_temp_c": day["day"]["mintemp_c"],
                "avg_temp_c": day["day"]["avgtemp_c"],
                "max_wind_kph": day["day"]["maxwind_kph"],
                "total_precip_mm": day["day"]["totalprecip_mm"],
                "humidity": day["day"]["avghumidity"],
                "condition": day["day"]["condition"]["text"],
                "chance_of_rain": day["day"]["daily_chance_of_rain"]
            })
        
        return forecast_data
    except Exception as e:
        raise Exception(f"Error fetching weather data: {str(e)}")

def get_soil_moisture_prediction(rainfall: float, temperature: float) -> float:
    """
    Predict soil moisture based on rainfall and temperature
    Basic linear model - replace with more sophisticated model if needed
    """
    # Simple moisture calculation (example model)
    base_moisture = 50  # Base moisture level
    rain_factor = 0.5   # Rainfall impact factor
    temp_factor = -0.3  # Temperature impact factor
    
    moisture = base_moisture + (rainfall * rain_factor) - (temperature * temp_factor)
    # Clamp between 0 and 100
    return max(0, min(100, moisture))