from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi.openapi.utils import get_openapi

from app.api import routes_crop, routes_price, routes_fertilizer, routes_risk, routes_weather
from app.core.db import init_db
from app.core.firebase_utils import init_firebase

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup and cleanup on shutdown"""
    print("🚀 Initializing Crop Mentor services...")
    init_db()
    init_firebase()
    yield
    print("🛑 Shutting down Crop Mentor backend...")

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
        
    openapi_schema = get_openapi(
        title="Crop Mentor AI API",
        version="1.0.0",
        description="""
        Smart Agriculture Assistant API providing advanced agricultural insights and recommendations.
        
        ## Features
        
        * 🌱 **Crop Recommendation**: Get personalized crop recommendations based on soil and climate conditions
        * 💰 **Price Prediction**: Predict future crop prices using market trends and historical data
        * 🌿 **Fertilizer Recommendation**: Get optimal fertilizer recommendations for your crops
        * 📊 **Risk Assessment**: Comprehensive risk analysis including yield prediction and profit estimation
        
        ## Models
        
        All predictions are powered by machine learning models trained on extensive agricultural data:
        - Random Forest for crop recommendation
        - XGBoost for price prediction
        - Ensemble models for fertilizer optimization
        - Multi-target regression for risk assessment
        
        ## Data Sources
        
        The system uses various data sources including:
        - Soil composition data
        - Climate and weather data
        - Historical price data
        - Crop yield statistics
        """,
        routes=app.routes,
    )
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app = FastAPI(
    title="Crop Mentor AI API",
    version="1.0.0",
    description="Smart Agriculture Assistant API for advanced farming insights",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Custom OpenAPI schema
app.openapi = custom_openapi

# Include routers with prefixes and documentation
app.include_router(
    routes_crop.router,
    prefix="/api/v1",
    tags=["Crop Recommendation"],
    responses={404: {"description": "Not found"}},
)

app.include_router(
    routes_price.router,
    prefix="/api/v1",
    tags=["Price Prediction"],
    responses={404: {"description": "Not found"}},
)

app.include_router(
    routes_fertilizer.router,
    prefix="/api/v1",
    tags=["Fertilizer Recommendation"],
    responses={404: {"description": "Not found"}},
)

app.include_router(
    routes_risk.router,
    prefix="/api/v1",
    tags=["Risk Assessment"],
    responses={404: {"description": "Not found"}},
)

app.include_router(
    routes_weather.router,
    prefix="/api/v1",
    tags=["Weather Information"],
    responses={404: {"description": "Not found"}},
)

# CORS Middleware
origins = [
    "http://localhost:3000",  # React development server
    "http://localhost:5173",  # Vite development server
    "*"                       # Allow all origins in development
]
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
