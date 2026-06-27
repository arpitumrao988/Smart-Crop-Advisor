from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from pathlib import Path
import requests

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent
print(BASE_DIR)
model= joblib.load(BASE_DIR/"models/crop_model.pkl")
label= joblib.load(BASE_DIR/"models/label_encoders.pkl")
scaler= joblib.load(BASE_DIR/"models/scaler.pkl")
fertilizer_label_encoders = joblib.load(BASE_DIR/"models/fertilizer_label_encoders.pkl")
fertilizer_model= joblib.load(BASE_DIR /"models/fertilizer_model.pkl")
fertilizer_scaler  = joblib.load(BASE_DIR/"models/fertilizer_scaler.pkl")
fertilizer_target_encoder= joblib.load(BASE_DIR/"models/fertilizer_target_encoder.pkl")
fertilizer_metadata=joblib.load(BASE_DIR/"models/fertilizer_model_metadata.pkl")



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




class fertilizerInput(BaseModel):
    cropName: str
    soilType: str
    nitrogen: float
    phosphorous: float
    potassium : float
    temperature: float
    humidity : float
    moisture: float


@app.post("/fertilizer_prediction")
def fertilizer_predict(data : fertilizerInput):

    
    #convert the soilType and croptype to numbers instead of str
    soil = fertilizer_label_encoders["Soil Type"].transform([data.soilType])[0]
    crop = fertilizer_label_encoders["Crop Type"].transform([data.cropName])[0]


    features=[
        [
            data.temperature, 
            data.humidity,
            data.moisture,
            soil,
            crop,
            data.nitrogen,
            data.potassium,
            data.phosphorous
        ]
    ]



    scaled = fertilizer_scaler.transform(features)
    prediction = fertilizer_model.predict(scaled)
    fertilizer = fertilizer_target_encoder.inverse_transform(prediction)[0]
    confidence= float(fertilizer_model.predict_proba(scaled).max()*100)

    print(prediction)
    print(type(prediction))

    print(fertilizer)
    print(type(fertilizer))

    print(confidence)
    print(type(confidence))
    return {
        "prediction ": fertilizer,
        "confidence": round(confidence,2)
    }


