import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder

def load_and_preprocess_data(data_path: str):
    # Load the dataset
    df = pd.read_csv(data_path)

    # Separate features and labels
    features = df.drop('label', axis=1)
    labels = df['label']

    # Normalize features
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(features)

    # Encode labels
    label_encoder = LabelEncoder()
    encoded_labels = label_encoder.fit_transform(labels)

    return scaled_features, encoded_labels, scaler, label_encoder
