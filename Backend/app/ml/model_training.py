import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

def load_and_preprocess_data(data_path):
    """Load and preprocess the crop dataset."""
    # Load dataset
    df = pd.read_csv(data_path)

    # Features and target
    X = df.drop(columns=['label'])
    y = df['label']

    # Encode target labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, y_encoded, scaler, label_encoder


def train_crop_model():
    """Train and save the crop recommendation model."""
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    data_path = os.path.join(BASE_DIR, "data", "crop_recommendation.csv")
    model_path = os.path.join(BASE_DIR, "app", "ml", "trained_model.pkl")

    # Load data
    X, y, scaler, label_encoder = load_and_preprocess_data(data_path)

    # Split for validation
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train model
    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"✅ Model trained successfully! Accuracy: {accuracy * 100:.2f}%")

    # Save model and encoders
    joblib.dump({
        "model": model,
        "scaler": scaler,
        "label_encoder": label_encoder
    }, model_path)

    print(f"💾 Model saved at: {model_path}")


if __name__ == "__main__":
    train_crop_model()
