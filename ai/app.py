from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import joblib
from pathlib import Path
import numpy as np
from scipy.sparse import hstack, csr_matrix

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent

# ── Load Model Artifacts ───────────────────────────────────────────────────
print("Loading machine learning models and encoders...")

# 1. Crop Model
try:
    crop_model = joblib.load(BASE_DIR / "models/crop_model.pkl")
    crop_label = joblib.load(BASE_DIR / "models/label_encoders.pkl")
    crop_scaler = joblib.load(BASE_DIR / "models/scaler.pkl")
    print("  Crop recommendation models loaded successfully.")
except Exception as e:
    print(f"  Error loading Crop models: {str(e)}")

# 2. Fertilizer Model
try:
    fertilizer_model = joblib.load(BASE_DIR / "models/fertilizer_model.pkl")
    fertilizer_label_encoders = joblib.load(BASE_DIR / "models/fertilizer_label_encoders.pkl")
    fertilizer_scaler = joblib.load(BASE_DIR / "models/fertilizer_scaler.pkl")
    fertilizer_target_encoder = joblib.load(BASE_DIR / "models/fertilizer_target_encoder.pkl")
    fertilizer_metadata = joblib.load(BASE_DIR / "models/fertilizer_model_metadata.pkl")
    print("  Fertilizer prediction models loaded successfully.")
except Exception as e:
    print(f"  Error loading Fertilizer models: {str(e)}")

# 3. Disease Model
try:
    disease_model = joblib.load(BASE_DIR / "models/disease_model.pkl")
    disease_crop_encoder = joblib.load(BASE_DIR / "models/disease_crop_encoder.pkl")
    disease_tfidf = joblib.load(BASE_DIR / "models/disease_tfidf.pkl")
    disease_target_encoder = joblib.load(BASE_DIR / "models/disease_target_encoder.pkl")
    disease_metadata = joblib.load(BASE_DIR / "models/disease_model_metadata.pkl")
    print("  Disease detection models loaded successfully.")
except Exception as e:
    print(f"  Error loading Disease models: {str(e)}")


# ── Pydantic Request Schemas ────────────────────────────────────────────────

class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class FertilizerInput(BaseModel):
    cropName: str
    soilType: str
    nitrogen: float
    phosphorus: Optional[float] = None
    phosphorous: Optional[float] = None  # Support spelling alias
    potassium: float
    temperature: Optional[float] = 30.0
    humidity: Optional[float] = 60.0
    moisture: Optional[float] = 43.0

class DiseaseInput(BaseModel):
    crop: Optional[str] = None
    cropName: Optional[str] = None
    symptoms: Optional[List[str]] = None
    symptomName: Optional[List[str]] = None


# ── API Endpoints ──────────────────────────────────────────────────────────

@app.get("/")
def health_check():
    return {
        "status": "UP",
        "message": "Smart Crop Advisor AI Module is running (FastAPI)"
    }


# ── Crop Recommendation Route ──
def predict_crop_logic(data: CropInput):
    feature = [
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
    
    scaled = crop_scaler.transform(feature)
    prediction = crop_model.predict(scaled)
    crop = crop_label.inverse_transform(prediction)[0]
    
    confidence = float(crop_model.predict_proba(scaled).max() * 100)
    
    return {
        "prediction": crop,
        "recommended_crop": crop,
        "confidence": round(confidence, 2)
    }

@app.post("/predict/crop")
def predict_crop(data: CropInput):
    return predict_crop_logic(data)

@app.post("/predict")
def predict_crop_alias(data: CropInput):
    return predict_crop_logic(data)


# ── Fertilizer Recommendation Route ──
def predict_fertilizer_logic(data: FertilizerInput):
    p_val = data.phosphorus if data.phosphorus is not None else data.phosphorous
    if p_val is None:
        raise HTTPException(status_code=400, detail="Phosphorus/phosphorous is required.")
        
    try:
        soil = fertilizer_label_encoders["Soil Type"].transform([data.soilType.strip()])[0]
    except Exception:
        soil = fertilizer_label_encoders["Soil Type"].transform([fertilizer_label_encoders["Soil Type"].classes_[0]])[0]
        
    try:
        crop = fertilizer_label_encoders["Crop Type"].transform([data.cropName.strip()])[0]
    except Exception:
        crop = fertilizer_label_encoders["Crop Type"].transform([fertilizer_label_encoders["Crop Type"].classes_[0]])[0]

    features = [
        [
            data.temperature,
            data.humidity,
            data.moisture,
            soil,
            crop,
            data.nitrogen,
            data.potassium,
            p_val
        ]
    ]

    scaled = fertilizer_scaler.transform(features)
    prediction = fertilizer_model.predict(scaled)
    fertilizer = fertilizer_target_encoder.inverse_transform(prediction)[0]
    
    confidence = float(fertilizer_model.predict_proba(scaled).max() * 100)

    return {
        "prediction": fertilizer,
        "prediction ": fertilizer,  # Trailing space alias
        "confidence": round(confidence, 2)
    }

@app.post("/predict/fertilizer")
def predict_fertilizer(data: FertilizerInput):
    return predict_fertilizer_logic(data)

@app.post("/fertilizer_prediction")
def predict_fertilizer_alias(data: FertilizerInput):
    return predict_fertilizer_logic(data)


# ── Disease Detection Route ──
def predict_disease_logic(data: DiseaseInput):
    crop_str = data.crop if data.crop is not None else data.cropName
    symptom_list = data.symptoms if data.symptoms is not None else data.symptomName
    
    if crop_str is None or symptom_list is None:
        raise HTTPException(status_code=400, detail="Both crop and symptoms must be provided.")

    try:
        crop_val = disease_crop_encoder.transform([crop_str.strip()])[0]
    except Exception:
        crop_val = disease_crop_encoder.transform([disease_crop_encoder.classes_[0]])[0]

    symptom_text = ", ".join(symptom_list)
    symptom_vector = disease_tfidf.transform([symptom_text])

    crop_sparse = csr_matrix([[float(crop_val)]])
    X = hstack([crop_sparse, symptom_vector])

    prediction = disease_model.predict(X)
    disease = disease_target_encoder.inverse_transform(prediction)[0]
    
    confidence = float(disease_model.predict_proba(X).max() * 100)

    return {
        "prediction": disease,
        "confidence": round(confidence, 2)
    }

@app.post("/predict/disease")
def predict_disease(data: DiseaseInput):
    return predict_disease_logic(data)
