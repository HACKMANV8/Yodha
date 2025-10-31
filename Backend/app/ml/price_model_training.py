# app/ml/price_model_training.py
import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score

# Load dataset
df = pd.read_csv("data/market_prices.csv")

# Normalize column names
df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]
# Now your CSV headers become:
# ['state', 'district', 'market', 'commodity', 'variety', 'grade', 'arrival_date', 'min_price', 'max_price', 'modal_price']

# Drop NAs safely
df.dropna(subset=["state", "district", "commodity", "variety", "min_price", "max_price", "modal_price"], inplace=True)

# Encode categorical features
encoders = {}
for col in ["state", "district", "commodity", "variety"]:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# Features & Targets
X = df[["state", "district", "commodity", "variety"]]
y_modal = df["modal_price"]
y_min = df["min_price"]
y_max = df["max_price"]

# Split data
X_train, X_test, y_train_modal, y_test_modal = train_test_split(X, y_modal, test_size=0.2, random_state=42)
_, _, y_train_min, y_test_min = train_test_split(X, y_min, test_size=0.2, random_state=42)
_, _, y_train_max, y_test_max = train_test_split(X, y_max, test_size=0.2, random_state=42)

# Train models
modal_model = RandomForestRegressor(n_estimators=200, random_state=42)
min_model = RandomForestRegressor(n_estimators=200, random_state=42)
max_model = RandomForestRegressor(n_estimators=200, random_state=42)

modal_model.fit(X_train, y_train_modal)
min_model.fit(X_train, y_train_min)
max_model.fit(X_train, y_train_max)

# Evaluate
print("Modal R²:", r2_score(y_test_modal, modal_model.predict(X_test)))
print("Min R²:", r2_score(y_test_min, min_model.predict(X_test)))
print("Max R²:", r2_score(y_test_max, max_model.predict(X_test)))

# Save models & encoders
os.makedirs("app/ml", exist_ok=True)
joblib.dump({
    "modal_model": modal_model,
    "min_model": min_model,
    "max_model": max_model,
    "encoders": encoders
}, "app/ml/price_model.pkl")

print("✅ Price prediction model trained and saved successfully at app/ml/price_model.pkl")
