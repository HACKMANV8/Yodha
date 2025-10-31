from pydantic import BaseModel

class CropRequest(BaseModel):
    crop_name: str | None = None
    recommended_crop: str | None = None
    N: float | None = None
    P: float | None = None
    K: float | None = None
    temperature: float | None = None
    humidity: float | None = None
    ph: float | None = None
    rainfall: float | None = None
