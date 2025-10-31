import joblib
import numpy as np

# Load model correctly
model_bundle = joblib.load("app/ml/trained_model.pkl")
model = model_bundle["model"]
scaler = model_bundle["scaler"]
label_encoder = model_bundle["label_encoder"]

def predict_crop(features: dict):
    """Predict the best crop for given soil and climate conditions."""
    # Order should match training dataset columns
    input_data = np.array([
        features["N"],
        features["P"],
        features["K"],
        features["temperature"],
        features["humidity"],
        features["ph"],
        features["rainfall"]
    ]).reshape(1, -1)

    input_scaled = scaler.transform(input_data)
    prediction = model.predict(input_scaled)
    crop = label_encoder.inverse_transform(prediction)[0]

    return {"recommended_crop": crop}
