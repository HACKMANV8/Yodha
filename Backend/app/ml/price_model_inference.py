# app/ml/price_model_inference.py
import os, joblib, numpy as np
from datetime import datetime

BASE = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE, "price_model.pkl")

bundle = joblib.load(MODEL_PATH)
model = bundle["model"]
encoders = bundle.get("encoders", {})
feature_cols = bundle["feature_cols"]

def make_features(input_payload, df_recent=None):
    """
    input_payload: dict {state, district, market, crop, variety, date, arrivals(optional)}
    df_recent: optional dataframe to extract lag features for that market+crop
    """
    # prepare features in same order as feature_cols
    arrival_date = datetime.fromisoformat(input_payload.get("date"))
    feat = {}
    feat["year"] = arrival_date.year
    feat["month"] = arrival_date.month
    feat["day"] = arrival_date.day
    feat["dayofweek"] = arrival_date.weekday()
    feat["arrivals"] = float(input_payload.get("arrivals", 0))

    # encode categories
    for key in ['state','district','market','crop','variety']:
        le = encoders.get(key)
        val = input_payload.get(key, "")
        if le:
            try:
                feat[f"{key}_enc"] = le.transform([str(val)])[0]
            except Exception:
                feat[f"{key}_enc"] = -1
        else:
            feat[f"{key}_enc"] = -1

    # lags: if df_recent provided, compute last modal prices
    if df_recent is not None:
        for lag in [1,2,3,7]:
            col = f"modal_lag_{lag}"
            try:
                feat[col] = float(df_recent.iloc[-lag]['modal_price'])
            except Exception:
                feat[col] = 0.0
    else:
        for lag in [1,2,3,7]:
            feat[f"modal_lag_{lag}"] = 0.0

    # Build array following feature_cols order
    arr = [float(feat.get(c,0.0)) for c in feature_cols]
    return np.array(arr).reshape(1, -1)

def predict_price(payload, df_recent=None):
    X = make_features(payload, df_recent)
    pred = model.predict(X)[0]
    # For confidence, approximate by normalized variance across trees
    try:
        preds_all = np.stack([t.predict(X) for t in model.estimators_]).flatten()
        std = float(np.std(preds_all))
        # heuristic confidence
        confidence = max(0.0, 1 - std / (abs(pred) + 1e-6))
    except Exception:
        confidence = 0.6

    # trend: compare to recent modal (if available)
    recent_modal = None
    if df_recent is not None and not df_recent.empty:
        recent_modal = float(df_recent.iloc[-1]['modal_price'])
    trend = "Stable"
    if recent_modal:
        if pred > recent_modal * 1.02: trend = "Increasing"
        elif pred < recent_modal * 0.98: trend = "Decreasing"

    # Estimate min/max with small buffer (or build separate models if needed)
    predicted_min = max(0, pred * 0.9)
    predicted_max = pred * 1.1

    return {
        "predicted_modal_price": round(float(pred), 2),
        "predicted_min_price": round(predicted_min, 2),
        "predicted_max_price": round(predicted_max, 2),
        "confidence": round(confidence, 2),
        "trend": trend,
        "recommended_action": "Sell soon" if trend=="Increasing" and confidence>0.6 else "Hold" if trend=="Stable" else "Wait"
    }
