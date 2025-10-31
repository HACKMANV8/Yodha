# train_price_model.py
import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error

# Get absolute paths
current_dir = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(current_dir))), "Dataset", "synthetic_crop_full_dataset.csv")
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(MODEL_DIR, "price_model.pkl")
TARGET_COL = "Market_Price_per_kg"

def prepare_price_data(df: pd.DataFrame):
    df = df.rename(columns=lambda c: c.strip())

    if TARGET_COL not in df.columns:
        raise KeyError(f"{TARGET_COL} not found in dataset.")

    numeric_cols = ["N", "P", "K", "Temperature", "Humidity", "pH", "Rainfall"]
    cat_cols = ["Crop Name", "Region", "Type", "Soil Type"]

    # Drop rows with missing target
    df = df.dropna(subset=[TARGET_COL])

    # Fill missing values
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
    for c in cat_cols:
        df[c] = df[c].fillna("Unknown").astype(str)

    # Encode categoricals
    encoders = {}
    for c in cat_cols:
        le = LabelEncoder()
        df[c + "_enc"] = le.fit_transform(df[c])
        encoders[c] = le

    # Combine features
    feature_columns = numeric_cols + [c + "_enc" for c in cat_cols]
    X = df[feature_columns].values
    y = df[TARGET_COL].astype(float).values

    return X, y, encoders, feature_columns, numeric_cols

def train():
    print("🔹 Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    X, y, encoders, feature_columns, numeric_cols = prepare_price_data(df)

    # Scale numeric portion
    scaler = StandardScaler()
    X[:, :len(numeric_cols)] = scaler.fit_transform(X[:, :len(numeric_cols)])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train model
    model = RandomForestRegressor(n_estimators=250, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    # Evaluate
    preds = model.predict(X_test)
    r2 = r2_score(y_test, preds)
    mae = mean_absolute_error(y_test, preds)
    print(f"✅ Price Prediction Model R²: {r2:.4f}, MAE: {mae:.2f}")

    # Save bundle
    bundle = {
        "model": model,
        "scaler": scaler,
        "encoders": encoders,
        "feature_columns": feature_columns
    }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    joblib.dump(bundle, OUT_PATH)
    print(f"💾 Model saved to: {OUT_PATH}")

    # Additional validation of model performance
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    print("\n🔍 Top 5 Important Features:")
    print(feature_importance.head())

    # Validate predictions are within reasonable range
    min_price, max_price = y_train.min(), y_train.max()
    print(f"\n📊 Price Range in Training Data: {min_price:.2f} - {max_price:.2f}")

if __name__ == "__main__":
    try:
        if not os.path.exists(DATA_PATH):
            raise FileNotFoundError(f"Dataset not found at: {DATA_PATH}")
        train()
        print("✨ Training completed successfully!")
    except Exception as e:
        print(f"❌ Error during training: {str(e)}")
        exit(1)
