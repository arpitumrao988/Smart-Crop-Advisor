# 🤖 Smart Crop Advisor — AI & Machine Learning Module

This directory contains the machine learning components of the **Smart Crop Advisor** system. It is designed as a standalone Python service that exposes prediction endpoints via a Flask REST API.

---

## 📁 Directory Structure

```
ai/
├── data/
│   └── Crop_recommendation.csv      # Soil NPK & weather dataset (~2200 rows)
├── models/
│   ├── crop_model.pkl               # Trained Random Forest model
│   ├── label_encoders.pkl           # Target variable label encoder
│   └── scaler.pkl                   # Feature standardizer (StandardScaler)
├── notebooks/
│   └── crop_model_training.ipynb    # Interactive model training & EDA notebook
├── app.py                           # Flask server exposing REST API endpoints
├── predict.py                       # Inference logic for loaded models
└── README.md                        # You are reading this right now
```

---

## 🌾 Crop Recommendation Model

The crop recommendation module uses a **Random Forest Classifier** to suggest the optimal crop based on soil and weather metrics.

### 📊 Dataset Details
* **Source:** Agricultural dataset containing **2,200 samples**.
* **Target Classes (22 Crops):** Rice, Maize, Chickpea, Kidneybeans, Pigeonpeas, Mothbeans, Mungbean, Blackgram, Lentil, Pomegranate, Banana, Mango, Grapes, Watermelon, Muskmelon, Apple, Orange, Papaya, Coconut, Cotton, Jute, Coffee.
* **Class Balance:** Perfectly balanced dataset with **100 samples per crop class**.

### 🧪 Features (Inputs)
| Feature | Description | Range / Unit |
| :---: | :--- | :---: |
| **N** | Nitrogen content in soil | 0 – 140 (Ratio) |
| **P** | Phosphorus content in soil | 5 – 145 (Ratio) |
| **K** | Potassium content in soil | 5 – 205 (Ratio) |
| **temperature** | Ambient temperature | 8.8 – 43.7 °C |
| **humidity** | Relative humidity | 14.3 – 100.0 % |
| **ph** | Soil pH level | 3.5 – 9.9 |
| **rainfall** | Average rainfall | 20.2 – 298.6 mm |

---

## 🛠️ Model Training Pipeline (`crop_model_training.ipynb`)

The training pipeline in the Jupyter notebook consists of the following structured phases:

### 1. Exploratory Data Analysis (EDA)
* Summarizes statistical distributions (mean, standard deviation, min, max) for all feature metrics.
* Computes and plots a **Feature Correlation Matrix** to analyze dependencies (e.g., strong correlation between P and K).
* Visualizes class distributions to verify dataset balance.

### 2. Preprocessing
* **Target Encoding:** Converts textual crop labels (e.g., `'rice'`) into numeric labels (`0 – 21`) using Scikit-Learn's `LabelEncoder`.
* **Feature Scaling:** Standardizes features using `StandardScaler` to remove scale bias, which is essential if comparing with distance-based models or integrating with other neural modules.
* **Stratified Splitting:** Uses an 80/20 train-test split (`train_test_split`) with class stratification to ensure all 22 crop classes are represented equally in both sets.

### 3. Model Selection & Hyperparameter Tuning
* **Cross-Validation:** Evaluates a baseline Random Forest model using **5-Fold Stratified Cross-Validation**, ensuring accuracy metrics are robust and not subject to split bias.
* **GridSearchCV:** Scans a parameter grid to optimize the Random Forest:
  * `n_estimators`: `[100, 200, 300]`
  * `max_depth`: `[None, 10, 20]`
  * `min_samples_split`: `[2, 5]`
  * `max_features`: `['sqrt', 'log2']`

### 4. Performance & Metrics
* **Baseline Accuracy:** ~99.32%
* **Mean 5-Fold Cross-Validation Accuracy:** ~99.45% ± 0.23%
* **Feature Importance:** Explores Gini impurity decrease to rank feature influence. Humidty and rainfall generally emerge as top indicators for class discrimination.

### 5. Production Retraining & Export
* Retrains the optimized Random Forest configuration on the **entire dataset (100% of samples)**.
* Exports three persistent model artifacts into `ai/models/` using `joblib`:
  1. `crop_model.pkl` — The serialized Random Forest classifier.
  2. `scaler.pkl` — The saved `StandardScaler` fit parameters.
  3. `label_encoders.pkl` — The saved `LabelEncoder` classes mapping.

---

## 🚀 Serving the Model (Inference Flow)

When the Flask API server is running, the model serving flow is as follows:

```
[Java Spring Boot Backend]
       │  (HTTP POST JSON)
       ▼
 [app.py (Flask Endpoint)] ──► Parses JSON inputs
       │
       ▼
 [predict.py (Inference)]  ──► 1. Loads scaler.pkl, crop_model.pkl, label_encoders.pkl
       │                       2. standardizes inputs using scaler.transform()
       │                       3. Runs model.predict() & model.predict_proba()
       ▼
[JSON Response returned]  ◄─── 4. Decodes target class with label_encoders.pkl
```

### Inference Input JSON
```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 25.5,
  "humidity": 80.0,
  "ph": 6.5,
  "rainfall": 202.9
}
```

### Inference Output JSON
```json
{
  "prediction": "Rice",
  "confidence": 94.7
}
```

---

## ⚙️ Installation & Running

Please ensure you have completed the prerequisite setups before running the service.

### 1. Set Up Virtual Environment
```bash
# Navigate to the ai directory
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
pip install -r requirements.txt
```
*(Dependencies include: `flask`, `scikit-learn`, `pandas`, `numpy`, `joblib`, `matplotlib`, `seaborn`)*

### 3. Run Training Pipeline (Optional)
If you want to re-train the model and generate the `.pkl` files:
```bash
# Via command-line script (if train.py is created) or by running the Jupyter notebook:
jupyter notebook notebooks/crop_model_training.ipynb
```

### 4. Start the Flask Server
```bash
python app.py
```
The microservice will start running at `http://localhost:5000`.
