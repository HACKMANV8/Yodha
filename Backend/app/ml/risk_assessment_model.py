import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor
import joblib
from typing import Dict, Tuple, List

# Get absolute paths
current_dir = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(current_dir))), "Dataset", "synthetic_crop_full_dataset.csv")
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(MODEL_DIR, "risk_assessment_model.pkl")

def calculate_risk_score(yield_uncertainty: float, price_volatility: float, climate_risk: float) -> Tuple[float, str]:
    """Calculate overall risk score and category"""
    risk_score = (yield_uncertainty * 0.4) + (price_volatility * 0.3) + (climate_risk * 0.3)
    
    if risk_score < 0.3:
        category = "Low Risk"
    elif risk_score < 0.6:
        category = "Moderate Risk"
    else:
        category = "High Risk"
    
    return risk_score, category

def calculate_base_yield(row):
    """Calculate base yield based on environmental conditions"""
    # Normalize values to 0-1 scale
    temp_factor = 1 - abs(row["Temperature"] - 25) / 25  # Optimal temp around 25°C
    humidity_factor = 1 - abs(row["Humidity"] - 65) / 65  # Optimal humidity around 65%
    ph_factor = 1 - abs(row["pH"] - 6.5) / 6.5  # Optimal pH around 6.5
    rainfall_factor = min(row["Rainfall"] / 1000, 1)  # Scale rainfall, cap at 1000mm
    
    # NPK efficiency
    npk_balance = (min(row["N"], 100) + min(row["P"], 100) + min(row["K"], 100)) / 300
    
    # Combine factors
    base_yield = (temp_factor * 0.25 + 
                 humidity_factor * 0.2 + 
                 ph_factor * 0.15 + 
                 rainfall_factor * 0.2 + 
                 npk_balance * 0.2) * 10  # Scale to realistic yield values
    
    return base_yield

def calculate_profit(yield_value, base_cost=5000):
    """Calculate profit based on yield and base cost"""
    # Assume average market price per ton
    market_price = 15000
    revenue = yield_value * market_price
    
    # Calculate costs
    production_cost = base_cost + (yield_value * 2000)  # Base cost + variable cost
    profit = revenue - production_cost
    
    return profit

def prepare_risk_assessment_data(df: pd.DataFrame) -> Tuple:
    """Prepare data for risk assessment model"""
    # Required features
    numeric_cols = ["N", "P", "K", "Temperature", "Humidity", "pH", "Rainfall"]
    cat_cols = ["Soil Type", "Crop Name"]
    
    # Fill missing values
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
    for c in cat_cols:
        df[c] = df[c].fillna("Unknown").astype(str)
    
    # Create derived features
    df["NPK_Balance"] = abs(df["N"] - df["P"]) + abs(df["P"] - df["K"])
    df["Season_Risk"] = np.where(
        (df["Temperature"].between(20, 30)) & (df["Humidity"].between(50, 80)),
        "Low",
        np.where(
            (df["Temperature"].between(15, 35)) & (df["Humidity"].between(40, 90)),
            "Moderate",
            "High"
        )
    )
    
    # Calculate yield and profit
    df["Calculated_Yield"] = df.apply(calculate_base_yield, axis=1)
    df["Calculated_Profit"] = df["Calculated_Yield"].apply(calculate_profit)
    
    # Add soil type factors
    soil_yield_factors = {
        "Loamy": 1.2,
        "Clay": 0.9,
        "Sandy": 0.8,
        "Silty": 1.0,
        "Black": 1.1,
        "Red": 0.95,
        "Unknown": 1.0
    }
    df["Soil_Factor"] = df["Soil Type"].map(soil_yield_factors).fillna(1.0)
    df["Calculated_Yield"] = df["Calculated_Yield"] * df["Soil_Factor"]
    
    # Encode categorical features
    encoders = {}
    for col in cat_cols + ["Season_Risk"]:
        le = LabelEncoder()
        df[f"{col}_encoded"] = le.fit_transform(df[col])
        encoders[col] = le
    
    # Prepare feature matrix
    feature_cols = (
        numeric_cols +
        ["NPK_Balance"] +
        [f"{col}_encoded" for col in cat_cols + ["Season_Risk"]]
    )
    X = df[feature_cols].values
    
    # Prepare multiple targets
    y_yield = df["Calculated_Yield"].values
    y_profit = df["Calculated_Profit"].values
    
    return X, y_yield, y_profit, encoders, feature_cols

def train():
    print("🔹 Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    
    # Print dataset info
    print("\n📊 Dataset Overview:")
    print(f"Number of records: {len(df)}")
    print("\n🌱 Available crops:", ", ".join(df["Crop Name"].unique()[:5]), "...")
    print("🌍 Soil types:", ", ".join(df["Soil Type"].unique()))
    
    X, y_yield, y_profit, encoders, feature_cols = prepare_risk_assessment_data(df)
    
    # Print feature ranges
    print("\n📈 Feature Ranges:")
    for i, col in enumerate(feature_cols[:7]):  # Print only numeric features
        print(f"{col}: {df[col].min():.1f} - {df[col].max():.1f}")
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Split data
    X_train, X_test, y_yield_train, y_yield_test, y_profit_train, y_profit_test = train_test_split(
        X_scaled, y_yield, y_profit, test_size=0.2, random_state=42, shuffle=True
    )
    
    # Train yield model with cross-validation
    print("\n🌾 Training yield prediction model...")
    yield_model = RandomForestRegressor(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    yield_model.fit(X_train, y_yield_train)
    yield_score = yield_model.score(X_test, y_yield_test)
    
    # Train profit model
    print("💰 Training profit prediction model...")
    profit_model = RandomForestRegressor(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    profit_model.fit(X_train, y_profit_train)
    profit_score = profit_model.score(X_test, y_profit_test)
    
    print(f"\n✅ Model Performance:")
    print(f"Yield Model R²: {yield_score:.4f}")
    print(f"Profit Model R²: {profit_score:.4f}")
    
    # Feature importance analysis
    print("\n🔍 Top 5 Important Features for Yield Prediction:")
    importance = pd.DataFrame({
        'feature': feature_cols,
        'importance': yield_model.feature_importances_
    }).sort_values('importance', ascending=False)
    print(importance.head().to_string(index=False))
    
    # Save bundle
    bundle = {
        "yield_model": yield_model,
        "profit_model": profit_model,
        "scaler": scaler,
        "encoders": encoders,
        "feature_cols": feature_cols,
        "metadata": {
            "soil_types": list(df["Soil Type"].unique()),
            "crop_names": list(df["Crop Name"].unique()),
            "feature_ranges": {col: [float(df[col].min()), float(df[col].max())] 
                             for col in feature_cols if col in df.columns}
        }
    }
    
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    joblib.dump(bundle, OUT_PATH)
    print(f"\n💾 Models and metadata saved to: {OUT_PATH}")

if __name__ == "__main__":
    try:
        if not os.path.exists(DATA_PATH):
            raise FileNotFoundError(f"Dataset not found at: {DATA_PATH}")
        train()
        print("\n✨ Training completed successfully!")
    except Exception as e:
        print(f"❌ Error during training: {str(e)}")
        exit(1)