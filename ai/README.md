# 🤖 Smart Crop Advisor — AI & Machine Learning Module

This directory contains the machine learning components of the **Smart Crop Advisor** system. It is designed as a standalone Python service that exposes prediction endpoints via a FastAPI REST API.

---

## 📁 Directory Structure

```text
ai/
├── data/
│   ├── Crop_recommendation.csv      # Soil NPK & weather dataset
│   ├── Fertilizer Prediction.csv    # Soil, Crop, and Weather data for fertilizers
│   ├── disease_data.csv             # Crop and symptom data for diseases
│   └── generate_disease_dataset.py  # Script to generate synthetic disease data
├── models/
│   ├── crop_model.pkl               # Trained RF model for crop recommendation
│   ├── fertilizer_model.pkl         # Trained RF model for fertilizer prediction
│   ├── disease_model.pkl            # Trained RF model for disease prediction
│   └── ...                          # Scalers, Encoders, Metadata, and EDA plots
├── notebooks/
│   ├── crop_model_training.ipynb    # Interactive notebook for crop model
│   ├── fertilizer_model_training.ipynb # Interactive notebook for fertilizer model
│   └── disease_model_training.ipynb # Interactive notebook for disease model
├── app.py                           # FastAPI server exposing REST API endpoints
├── train_disease.py                 # Standalone script to train disease model
├── train_fertilizer.py              # Standalone script to train fertilizer model
└── README.md                        # You are reading this right now
```

---

## 🌾 1. Crop Recommendation Model
Suggests the optimal crop based on soil (N, P, K, pH) and weather metrics (temperature, humidity, rainfall).
- **Algorithm**: Random Forest Classifier
- **Endpoint**: `POST /predict`
- **Input**: JSON with `temperature`, `humidity`, `N`, `P`, `K`, `rainfall`, `ph`.
- **Output**: JSON with `recommended_crop`.

## 🧪 2. Fertilizer Prediction Model
Predicts the best fertilizer to use given crop type, soil type, and current soil conditions.
- **Algorithm**: Random Forest Classifier
- **Endpoint**: `POST /fertilizer_prediction`
- **Input**: JSON with `cropName`, `soilType`, `nitrogen`, `phosphorous`, `potassium`, `temperature`, `humidity`, `moisture`.
- **Output**: JSON with predicted `prediction ` and `confidence` score.

## 🦠 3. Disease Prediction Model
Identifies plant diseases based on the crop type and textual symptoms provided.
- **Algorithm**: Random Forest Classifier using TF-IDF for symptom vectorization.
- **Endpoint**: `POST /disease`
- **Input**: JSON with `cropName` (string) and `symptoms` (list of strings).
- **Output**: JSON with predicted `prediction` and `confidence` score.

---

## 🚀 Serving the API (FastAPI)

When the FastAPI server is running, the model serving flow handles incoming HTTP POST requests, standardizes/encodes the inputs using pre-saved `.pkl` artifacts, runs predictions, and returns JSON responses.

### Starting the Server
```bash
# Ensure you are in the ai directory and venv is activated
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
The microservice will start running, and interactive API documentation will be available at `http://localhost:8000/docs` (Swagger UI).

---

## ⚙️ Installation & Running

Please ensure you have completed the prerequisite setups before running the service.

### 1. Set Up Virtual Environment
```bash
cd ai

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r ../requirements.txt
# OR if requirements.txt is in ai/
pip install -r requirements.txt
```
*(Make sure dependencies like `fastapi`, `uvicorn`, `scikit-learn`, `pandas`, `numpy`, `joblib`, `scipy` are installed.)*

### 3. Model Training (Optional)
If you want to re-train the models and generate the `.pkl` files and EDA plots, you can run the standalone training scripts:
```bash
python train_fertilizer.py
python train_disease.py
```
*(Or use the provided Jupyter notebooks in the `notebooks/` directory for an interactive experience and for crop model training.)*
