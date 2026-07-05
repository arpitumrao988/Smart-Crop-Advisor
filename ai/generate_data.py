import os
import random
import pandas as pd
import numpy as np

# Ensure data directory exists
os.makedirs("data", exist_ok=True)

# ── 1. GENERATING CROP RECOMMENDATION DATASET ──────────────────
print("Generating crop_recommendation.csv...")
crops_config = {
    "Rice":        {"N": (60, 90),   "P": (35, 55),  "K": (35, 45),  "temp": (20, 30), "hum": (80, 90), "ph": (5.5, 6.5), "rain": (180, 250)},
    "Maize":       {"N": (70, 90),   "P": (40, 60),  "K": (15, 25),  "temp": (22, 28), "hum": (55, 70), "ph": (5.8, 6.8), "rain": (60, 100)},
    "Jute":        {"N": (70, 90),   "P": (35, 50),  "K": (35, 45),  "temp": (25, 35), "hum": (75, 90), "ph": (6.0, 7.0), "rain": (140, 190)},
    "Cotton":      {"N": (70, 90),   "P": (35, 50),  "K": (15, 25),  "temp": (22, 30), "hum": (75, 85), "ph": (6.5, 7.5), "rain": (60, 90)},
    "Coconut":     {"N": (70, 90),   "P": (10, 25),  "K": (25, 35),  "temp": (25, 30), "hum": (85, 95), "ph": (5.5, 6.5), "rain": (130, 170)},
    "Papaya":      {"N": (40, 60),   "P": (45, 65),  "K": (40, 60),  "temp": (23, 28), "hum": (80, 90), "ph": (6.5, 7.0), "rain": (100, 140)},
    "Orange":      {"N": (10, 30),   "P": (5, 20),   "K": (5, 15),   "temp": (20, 30), "hum": (85, 95), "ph": (6.0, 7.0), "rain": (100, 130)},
    "Apple":       {"N": (10, 30),   "P": (120, 140),"K": (190, 210),"temp": (20, 24), "hum": (90, 95), "ph": (5.5, 6.5), "rain": (100, 130)},
    "Muskmelon":   {"N": (80, 100),  "P": (5, 25),   "K": (5, 15),   "temp": (25, 30), "hum": (90, 95), "ph": (6.2, 6.8), "rain": (20, 30)},
    "Watermelon":  {"N": (80, 100),  "P": (5, 25),   "K": (45, 55),  "temp": (24, 28), "hum": (80, 85), "ph": (6.0, 6.8), "rain": (40, 60)},
    "Grapes":      {"N": (20, 40),   "P": (120, 140),"K": (190, 210),"temp": (20, 26), "hum": (80, 85), "ph": (5.8, 6.5), "rain": (60, 80)},
    "Mango":       {"N": (10, 30),   "P": (15, 35),  "K": (25, 35),  "temp": (25, 35), "hum": (45, 55), "ph": (5.5, 6.0), "rain": (80, 100)},
    "Banana":      {"N": (80, 100),  "P": (70, 90),  "K": (45, 55),  "temp": (25, 28), "hum": (75, 85), "ph": (5.5, 6.5), "rain": (90, 110)},
    "Pomegranate": {"N": (10, 30),   "P": (10, 30),  "K": (35, 45),  "temp": (18, 25), "hum": (85, 95), "ph": (6.8, 7.2), "rain": (100, 115)},
    "Lentil":      {"N": (10, 30),   "P": (45, 60),  "K": (15, 25),  "temp": (18, 22), "hum": (60, 70), "ph": (6.5, 7.0), "rain": (35, 50)},
    "Blackgram":   {"N": (30, 50),   "P": (60, 75),  "K": (15, 25),  "temp": (25, 30), "hum": (60, 70), "ph": (6.5, 7.5), "rain": (60, 75)},
    "Mungbean":    {"N": (10, 30),   "P": (45, 60),  "K": (15, 25),  "temp": (27, 30), "hum": (80, 85), "ph": (6.2, 7.2), "rain": (35, 50)},
    "Chickpea":    {"N": (30, 50),   "P": (65, 80),  "K": (75, 85),  "temp": (17, 20), "hum": (15, 20), "ph": (7.0, 8.0), "rain": (65, 80)},
    "Coffee":      {"N": (90, 110),  "P": (15, 30),  "K": (25, 35),  "temp": (23, 28), "hum": (50, 60), "ph": (6.0, 7.0), "rain": (140, 160)},
    "Tea":         {"N": (90, 110),  "P": (10, 20),  "K": (15, 30),  "temp": (18, 25), "hum": (85, 95), "ph": (4.5, 5.3), "rain": (180, 230)},
    "Barley":      {"N": (40, 60),   "P": (30, 50),  "K": (30, 40),  "temp": (15, 20), "hum": (30, 45), "ph": (6.0, 7.0), "rain": (40, 70)},
    "Mustard":     {"N": (50, 70),   "P": (40, 60),  "K": (20, 35),  "temp": (15, 22), "hum": (40, 55), "ph": (6.0, 7.5), "rain": (30, 50)}
}

crop_rows = []
for crop, ranges in crops_config.items():
    for _ in range(100): # 100 samples per crop = 2,200 rows total
        n = round(random.uniform(ranges["N"][0], ranges["N"][1]), 1)
        p = round(random.uniform(ranges["P"][0], ranges["P"][1]), 1)
        k = round(random.uniform(ranges["K"][0], ranges["K"][1]), 1)
        t = round(random.uniform(ranges["temp"][0], ranges["temp"][1]), 2)
        h = round(random.uniform(ranges["hum"][0], ranges["hum"][1]), 2)
        ph = round(random.uniform(ranges["ph"][0], ranges["ph"][1]), 2)
        r = round(random.uniform(ranges["rain"][0], ranges["rain"][1]), 2)
        crop_rows.append([n, p, k, t, h, ph, r, crop])

crop_df = pd.DataFrame(crop_rows, columns=["N", "P", "K", "temperature", "humidity", "ph", "rainfall", "label"])
crop_df.to_csv("data/crop_recommendation.csv", index=False)
print(f"Saved data/crop_recommendation.csv with {len(crop_df)} rows.")

# ── 2. GENERATING FERTILIZER RECOMMENDATION DATASET ────────────
print("Generating fertilizer_data.csv...")
soil_types = ["Sandy", "Loamy", "Black", "Red", "Clayey", "Sandy Loam"]
crop_names = list(crops_config.keys())

fert_rows = []
for _ in range(1000):
    crop = random.choice(crop_names)
    soil = random.choice(soil_types)
    n = round(random.uniform(10, 120), 1)
    p = round(random.uniform(5, 100), 1)
    k = round(random.uniform(5, 100), 1)
    
    # Target rules mapping (matching AI simulation rules with slight variation)
    if n < 40:
        fert = "Urea (High Nitrogen)"
    elif p < 30:
        fert = "DAP (Di-Ammonium Phosphate)"
    elif k < 20:
        fert = "MOP (Muriate of Potash)"
    else:
        fert = "NPK 19-19-19 (Balanced Fertilizer)"
        
    fert_rows.append([soil, crop, n, p, k, fert])

fert_df = pd.DataFrame(fert_rows, columns=["soilType", "cropName", "nitrogen", "phosphorus", "potassium", "prediction"])
fert_df.to_csv("data/fertilizer_data.csv", index=False)
print(f"Saved data/fertilizer_data.csv with {len(fert_df)} rows.")

# ── 3. GENERATING DISEASE DETECTION DATASET ────────────────────
print("Generating disease_data.csv...")
disease_symptoms_templates = [
    # Tomato
    ("Tomato", "Early Blight", [
        "yellow spots with dark concentric circles on leaves",
        "concentric target-like brown spots on older lower leaves",
        "dark spots on foliage causing leaves to turn yellow and drop",
        "black spot lesions on stems and lower leaves",
        "yellow rings and target-like circles on older tomato leaves"
    ]),
    ("Tomato", "Late Blight", [
        "large water-soaked green-black spots expanding on leaves",
        "white velvety mold on the underside of leaves",
        "greasy brown spots on tomato fruit with wet rot",
        "fast spreading dark lesions on stem and leaf stems",
        "leaves turning dark brown and wilting rapidly in wet weather"
    ]),
    # Rice
    ("Rice", "Bacterial Leaf Blight", [
        "water-soaked yellowish stripes on leaf margins from tip",
        "leaf tips turning yellow, dry, and rolling up",
        "sticky yellow droplets of ooze on dried leaf blades",
        "seedlings wilting and drying out completely (kresek stage)",
        "wavy yellow stripes stretching down the leaf edges"
    ]),
    ("Rice", "Blast", [
        "spindle-shaped or diamond spots with gray centers and red borders",
        "neck of the panicle rotting and breaking",
        "collapsing stalks with oval lesions on node joints",
        "grain husks showing brown spots and remaining empty",
        "diamond lesions on leaves with brown borders"
    ]),
    # Potato
    ("Potato", "Common Scab", [
        "rough corky scab-like spots on tuber skin",
        "pitted brown scab craters on potato skins",
        "raised brown scabby lesions on underground tubers",
        "corky spots spreading on potato skins",
        "scab-like patches on skin of harvested potatoes"
    ]),
    ("Potato", "Black Scurf", [
        "hard black dirt patches stuck on potato skin",
        "black sclerotia on tubers that do not wash off",
        "canker on underground stolons and young shoots",
        "black dirt spots adhering firmly to potato surface",
        "stunted plants with black dirt crusts on potatoes"
    ]),
    ("Potato", "Late Blight", [
        "water-soaked dark spots on potato leaves with white mold",
        "white mold on potato leaf undersides in wet morning",
        "rotting tubers with copper-brown skin lesions",
        "dark brown fast-decaying spots on foliage"
    ]),
    # Wheat
    ("Wheat", "Leaf Rust", [
        "orange-brown powdery pustules on leaf surface",
        "reddish-brown rusty powder on wheat leaves",
        "small oval orange pustules scattered on leaves",
        "rust-like dust coming off leaves when touched",
        "orange spots turning leaf yellow and dry"
    ]),
    ("Wheat", "Powdery Mildew", [
        "white powdery patches on leaves and stems",
        "grayish powdery mold covering leaf surface",
        "fluffy white mold spots on base of wheat plants",
        "powdery white dust on leaves making them die early",
        "wheat leaves covered with white flour-like patches"
    ]),
    # Healthy cases
    ("Tomato", "Healthy (No Disease Detected)", [
        "leaves are green and healthy",
        "strong plant growth, clean foliage, no spots",
        "perfectly healthy tomato crop"
    ]),
    ("Rice", "Healthy (No Disease Detected)", [
        "green upright leaves, no spots or blight",
        "healthy crop growth, golden panicles forming",
        "strong healthy rice crops"
    ]),
    ("Potato", "Healthy (No Disease Detected)", [
        "clean smooth potato tubers, healthy vines",
        "vibrant green foliage, no rot",
        "healthy potato crops"
    ]),
    ("Wheat", "Healthy (No Disease Detected)", [
        "clean golden wheat heads, green leaves",
        "healthy wheat growth, no rust or mildew",
        "perfect wheat fields"
    ])
]

disease_rows = []
for crop, disease, templates in disease_symptoms_templates:
    for _ in range(35): # 35 samples per template category
        raw_symptom = random.choice(templates)
        # Add slight natural language noise to make NLP classifier realistic
        prefix = random.choice(["I see ", "My crop has ", "Observing ", "There are ", "We found "])
        suffix = random.choice([". What is this?", " on my farm.", " near the borders.", " on older leaves.", " on the plant."])
        symptom = prefix + raw_symptom + suffix
        disease_rows.append([crop, symptom, disease])

disease_df = pd.DataFrame(disease_rows, columns=["crop", "symptoms", "prediction"])
disease_df.to_csv("data/disease_data.csv", index=False)
print(f"Saved data/disease_data.csv with {len(disease_df)} rows.")

print("All datasets generated successfully!")
