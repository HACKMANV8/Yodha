import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# Get absolute paths
current_dir = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(current_dir))), "Dataset", "synthetic_crop_full_dataset.csv")
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(MODEL_DIR, "fertilizer_model.pkl")

def validate_input_ranges(df, numeric_cols):
    """Validate and print the ranges of input features"""
    print("\n📊 Input Feature Ranges:")
    for col in numeric_cols:
        min_val, max_val = df[col].min(), df[col].max()
        print(f"{col}: {min_val:.2f} - {max_val:.2f}")
        
        if col in ["N", "P", "K"] and min_val < 0:
            print(f"⚠️ Warning: Negative values found in {col}")

def prepare_fertilizer_data(df: pd.DataFrame):
    df = df.rename(columns=lambda c: c.strip())
    
    # Required features for fertilizer recommendation
    numeric_cols = ["N", "P", "K", "Temperature", "Humidity", "pH", "Rainfall"]
    cat_cols = ["Soil Type", "Crop Name"]
    
    # Fill missing values
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
    for c in cat_cols:
        df[c] = df[c].fillna("Unknown").astype(str)
    
    # Encode categorical columns
    cat_encoders = {}
    X_cat_list = []
    for c in cat_cols:
        le = LabelEncoder()
        Xc = le.fit_transform(df[c].astype(str))
        cat_encoders[c] = le
        X_cat_list.append(Xc.reshape(-1, 1))
    
    # Create target variable based on NPK levels
    # Classify into different fertilizer categories based on NPK ratios
    df["NPK_ratio"] = df.apply(lambda x: f"{x['N']}:{x['P']}:{x['K']}", axis=1)
    target_le = LabelEncoder()
    y = target_le.fit_transform(df["NPK_ratio"])
    
    # Combine features (excluding N, P, K since they're part of target)
    feature_cols = [c for c in numeric_cols if c not in ["N", "P", "K"]] + cat_cols
    X = df[feature_cols].copy()
    
    # Encode remaining numeric features
    X_num = X[[c for c in feature_cols if c in numeric_cols]].values
    X_cat = np.hstack(X_cat_list)
    X_combined = np.hstack([X_num, X_cat])
    
    return X_combined, y, target_le, cat_encoders, feature_cols

def train():
    print("🔹 Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    
    # Validate input ranges
    numeric_cols = ["N", "P", "K", "Temperature", "Humidity", "pH", "Rainfall"]
    validate_input_ranges(df, numeric_cols)
    
    X, y, target_encoder, cat_encoders, feature_cols = prepare_fertilizer_data(df)
    
    # Scale numeric features
    scaler = StandardScaler()
    num_numeric = len([c for c in feature_cols if c in ["Temperature", "Humidity", "pH", "Rainfall"]])
    X[:, :num_numeric] = scaler.fit_transform(X[:, :num_numeric])
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Train model
    model = RandomForestClassifier(n_estimators=250, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    
    # Evaluate
    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"\n✅ Fertilizer Recommendation Model Accuracy: {acc*100:.2f}%")
    print("\n📊 Classification Report:")
    print(classification_report(y_test, preds, target_names=target_encoder.classes_[:5]))  # Show first 5 classes
    
    # Save bundle
    bundle = {
        "model": model,
        "scaler": scaler,
        "target_encoder": target_encoder,
        "cat_encoders": cat_encoders,
        "feature_cols": feature_cols
    }
    
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    joblib.dump(bundle, OUT_PATH)
    print(f"\n💾 Model saved to: {OUT_PATH}")
    
    # Print feature importance
    importance = pd.DataFrame({
        'feature': feature_cols,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n🔍 Top 5 Important Features:")
    print(importance.head())

if __name__ == "__main__":
    try:
        if not os.path.exists(DATA_PATH):
            raise FileNotFoundError(f"Dataset not found at: {DATA_PATH}")
        
        import sklearn
        print(f"🐍 Using scikit-learn version: {sklearn.__version__}")
        
        train()
        print("\n✨ Training completed successfully!")
    except Exception as e:
        print(f"❌ Error during training: {str(e)}")
        exit(1)