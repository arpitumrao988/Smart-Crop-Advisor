from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from pathlib import Path

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent
print(BASE_DIR)
model= joblib.load(BASE_DIR/"models/crop_model.pkl")
label= joblib.load(BASE_DIR/"models/label_encoders.pkl")
scaler= joblib.load(BASE_DIR/"models/scaler.pkl")


class CropInput(BaseModel):
    temperature: float
    humidity: float
    N:float
    P: float
    K: float
    rainfall: float
    ph: float


@app.post("/predict")
def predict(data: CropInput):

    feature=[
        [
            data.N,
            data.P,
            data.K,
            data.temperature,
            data.humidity,
            data.ph,
            data.rainfall
        ]
    ]

    scaled = scaler.transform(feature)
    prediction = model.predict(scaled)
    crop = label.inverse_transform(prediction)[0]

    return{
        "recommended_crop" : crop
    }

