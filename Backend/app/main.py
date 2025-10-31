from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api import routes_crop, routes_price
from app.core.db import init_db
from app.core.firebase_utils import init_firebase

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    init_firebase()
    yield
    print("🛑 Shutting down Crop Mentor backend...")

app = FastAPI(
    title="Crop Mentor API",
    version="1.0.0",
    description="Smart Agriculture Assistant API for price prediction, crop trends, and visualization.",
    lifespan=lifespan
)

# Include routers
app.include_router(routes_crop.router, prefix="", tags=["Crop Recommendation"])
app.include_router(routes_price.router, prefix="", tags=["Price Prediction"])

# CORS Middleware
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Crop Mentor Backend is running 🚀"}
