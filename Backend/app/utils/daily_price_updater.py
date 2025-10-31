import requests
import pandas as pd
from app.core.firebase_utils import init_firebase
import datetime

API_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
API_KEY = "YOUR_AGMARKNET_API_KEY"

db = init_firebase()

def fetch_daily_prices(state=None, district=None, commodity=None):
    params = {
        "api-key": API_KEY,
        "format": "json",
        "limit": 50
    }
    if state: params["filters[state]"] = state
    if district: params["filters[district]"] = district
    if commodity: params["filters[commodity]"] = commodity

    res = requests.get(API_URL, params=params)
    data = res.json().get("records", [])

    for rec in data:
        db.collection("daily_market_updates").add({
            "state": rec.get("state"),
            "district": rec.get("district"),
            "market": rec.get("market"),
            "commodity": rec.get("commodity"),
            "variety": rec.get("variety"),
            "arrival_date": rec.get("arrival_date"),
            "min_price": int(rec.get("min_price", 0)),
            "max_price": int(rec.get("max_price", 0)),
            "modal_price": int(rec.get("modal_price", 0)),
            "arrivals": int(rec.get("arrival", 0)),
            "source": "Agmarknet",
            "last_updated": datetime.datetime.utcnow()
        })
    print("✅ Daily market prices updated successfully!")
