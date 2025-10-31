import joblib
import numpy as np

# Load model correctly
import os

# Get the absolute path to the model file
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "crop_model.pkl")

try:
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")
    model_bundle = joblib.load(MODEL_PATH)
    model = model_bundle["model"]
    scaler = model_bundle["scaler"]
    label_encoder = model_bundle["label_encoder"]
    cat_encoders = model_bundle["cat_encoders"]
    numeric_cols = model_bundle["numeric_cols"]
    cat_cols = model_bundle["cat_cols"]
except Exception as e:
    print(f"❌ Error loading model: {str(e)}")
    raise

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
