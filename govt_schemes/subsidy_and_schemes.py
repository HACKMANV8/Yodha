from fastapi import FastAPI, Query
import json
from typing import Optional

app = FastAPI(title="Crop Schemes & Subsidies API")

with open("schemes.json", "r", encoding="utf-8") as f:
    schemes = json.load(f)

@app.get("/schemes")
def get_schemes(
    crop: str = Query(..., description="Crop name"),
    state: Optional[str] = Query(None, description="State name (optional)")
):
    crop = crop.lower()
    results = [s for s in schemes if s["crop"].lower() == crop]

    if state:
        state = state.lower()
        #  Includes matches even if the scheme covers 'All' or mentions that state
        results = [
            s for s in results
            if "all" in s["state"].lower() or state in s["state"].lower()
        ]

    if not results:
        return {
            "message": f"No government schemes found for crop '{crop}' and state '{state or 'All States'}'."
        }

    return {"schemes": results}

@app.get("/")
def root():
    return {"message": "Welcome to the Crop Schemes & Subsidies API!"}
