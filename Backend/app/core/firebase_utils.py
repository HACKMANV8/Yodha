# app/core/firebase_utils.py
import firebase_admin
from firebase_admin import credentials, firestore
import os

# Global variable for db client
db = None

def init_firebase():
    """Initialize Firebase and return Firestore client."""
    global db
    if db is not None:
        return db  # already initialized

    # Resolve correct key path
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    FIREBASE_KEY_PATH = os.path.join(BASE_DIR, "firebase_key.json")

    if not os.path.exists(FIREBASE_KEY_PATH):
        raise FileNotFoundError(f"Firebase key not found at {FIREBASE_KEY_PATH}")

    # Initialize Firebase app
    if not firebase_admin._apps:
        cred = credentials.Certificate(FIREBASE_KEY_PATH)
        firebase_admin.initialize_app(cred)

    db = firestore.client()
    print("🔥 Firebase initialized successfully!")
    return db
