# app/utils/agmarknet_api.py
import requests, os, datetime

def fetch_agmarknet_data(state: str, district: str, crop: str):
    api_key = os.getenv("AGMARKNET_API_KEY")
    base_url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
    params = {
        "api-key": api_key,
        "format": "json",
        "filters[state.keyword]": state,
        "filters[district.keyword]": district,
        "filters[commodity.keyword]": crop,
        "limit": 1
    }

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json().get("records", [])
        if not data:
            return {"message": "No recent data available for this crop/location"}

        record = data[0]
        return {
            "state": state,
            "district": district,
            "market": record.get("market", "Unknown"),
            "commodity": crop,
            "variety": record.get("variety", "Unknown"),
            "arrival_date": record.get("arrival_date", datetime.date.today().isoformat()),
            "min_price": int(record.get("min_price", 0)),
            "max_price": int(record.get("max_price", 0)),
            "modal_price": int(record.get("modal_price", 0)),
            "arrivals": int(record.get("arrivals", 0)),
            "source": "Agmarknet",
            "last_updated": datetime.datetime.now().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}
