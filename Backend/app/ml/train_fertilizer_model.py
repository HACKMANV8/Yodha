import joblib
import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
import os

df = pd.read_csv("fertilizer_dataset.csv")
df["npk_ratio"] = df.apply(lambda r: f"{int(r['N'])}:{int(r['P'])}:{int(r['K'])}", axis=1)
df = df[(df["N"] > 0) & (df["P"] > 0) & (df["K"] > 0)]

df = df[["Temperature","Humidity","pH","Rainfall","Soil Type","Crop Name","npk_ratio"]]

class_counts = df['npk_ratio'].value_counts()
valid_classes = class_counts[class_counts >= 2].index
df = df[df['npk_ratio'].isin(valid_classes)]

X = df.drop("npk_ratio", axis=1)
y = df["npk_ratio"]

num_cols = ["Temperature","Humidity","pH","Rainfall"]
cat_cols = ["Soil Type","Crop Name"]

numeric_transform = StandardScaler()
category_transform = OneHotEncoder(handle_unknown="ignore")
target_encoder = LabelEncoder()

y_encoded = target_encoder.fit_transform(y)

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_transform, num_cols),
        ("cat", category_transform, cat_cols)
    ]
)

model = RandomForestClassifier(n_estimators=300, class_weight="balanced")
pipeline = Pipeline([
    ("preprocess", preprocessor),
    ("model", model)
])

pipeline.fit(X, y_encoded)

bundle = {
    "model": pipeline,
    "target_encoder": target_encoder,
    "feature_cols": list(X.columns)
}

MODEL_PATH = os.path.join(os.path.dirname(__file__), "fertilizer_model.pkl")
joblib.dump(bundle, MODEL_PATH)

print("✅ Fertilizer Model Trained & Saved Successfully:", MODEL_PATH)
