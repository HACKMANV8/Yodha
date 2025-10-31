import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
import xgboost as xgb
import joblib

# Step 1: Load Data
df = pd.read_csv("synthetic_crop_full_dataset.csv")

# Safe numeric conversion
for col in df.columns:
    try:
        df[col] = pd.to_numeric(df[col])
    except Exception:
        pass

# Fill NaNs
df = df.fillna(df.median(numeric_only=True))

# Step 2: Derived Features
df["NPK_Balance"] = abs(df["N"] - df["P"]) + abs(df["P"] - df["K"])
df["Fertilizer_Cost"] = df["NPK_Balance"] * np.random.uniform(0.8, 1.5) + np.random.uniform(200, 800)
df["Base_Yield"] = (df["Rainfall"] * 0.02) + (df["Temperature"] * 0.3) - (abs(df["pH"] - 6.5) * 10) + np.random.normal(0, 2, len(df))

soil_yield_factor = {"Loamy": 1.05, "Clay": 0.9, "Sandy": 0.8, "Silty": 1.0, "Peaty": 0.95, "Chalky": 0.85}
df["Soil_Factor"] = df["Soil Type"].map(soil_yield_factor).fillna(1.0)

df["Predicted_Yield"] = df["Base_Yield"] * df["Soil_Factor"]

crop_price_map = {"Rice": 22, "Wheat": 20, "Maize": 18, "Sugarcane": 3, "Cotton": 65,
                  "Pulses": 55, "Groundnut": 45, "Potato": 25, "Tomato": 30, "Onion": 28}
df["Market_Price_per_kg"] = df["Crop Name"].map(crop_price_map).fillna(25)
df["Profit"] = (df["Predicted_Yield"] * df["Market_Price_per_kg"]) - df["Fertilizer_Cost"]

# Step 3: Risk Score
yield_std = df["Predicted_Yield"].std()
profit_std = df["Profit"].std()

df["Risk_Score"] = (
    (df["NPK_Balance"] / df["NPK_Balance"].max()) * 0.25
    + (abs(df["pH"] - 6.5) / 6.5) * 0.25
    + ((yield_std - df["Predicted_Yield"]) / yield_std).clip(0) * 0.25
    + ((profit_std - df["Profit"]) / profit_std).clip(0) * 0.25
)
df["Risk_Score"] = (df["Risk_Score"] - df["Risk_Score"].min()) / (df["Risk_Score"].max() - df["Risk_Score"].min())

# Step 4: Features
feature_cols = ["N", "P", "K", "Temperature", "Humidity", "pH", "Rainfall", "Soil_Factor", "Fertilizer_Cost"]
X = df[feature_cols]
y_yield = df["Predicted_Yield"]
y_profit = df["Profit"]

# Split
X_train, X_test, y_train_yield, y_test_yield = train_test_split(X, y_yield, test_size=0.2, random_state=42)
_, _, y_train_profit, y_test_profit = train_test_split(X, y_profit, test_size=0.2, random_state=42)

# Step 5: XGBoost Models
params = {
    "n_estimators": 300,
    "learning_rate": 0.05,
    "max_depth": 8,
    "subsample": 0.8,
    "colsample_bytree": 0.8,
    "random_state": 42,
    "tree_method": "hist"  # Use "gpu_hist" if you have GPU
}

yield_model = xgb.XGBRegressor(**params)
profit_model = xgb.XGBRegressor(**params)

yield_model.fit(X_train, y_train_yield, eval_set=[(X_test, y_test_yield)], verbose=False)
profit_model.fit(X_train, y_train_profit, eval_set=[(X_test, y_test_profit)], verbose=False)

# Step 6: Evaluation
y_pred_yield = yield_model.predict(X_test)
y_pred_profit = profit_model.predict(X_test)

#print("✅ Yield Model R²:", round(r2_score(y_test_yield, y_pred_yield), 3))
#print("✅ Profit Model R²:", round(r2_score(y_test_profit, y_pred_profit), 3))
#print("📉 MAE Yield:", round(mean_absolute_error(y_test_yield, y_pred_yield), 3))
#print("📉 MAE Profit:", round(mean_absolute_error(y_test_profit, y_pred_profit), 3))

# Step 7: Save Models
joblib.dump(yield_model, "yield_model_xgb.pkl")
joblib.dump(profit_model, "profit_model_xgb.pkl")


