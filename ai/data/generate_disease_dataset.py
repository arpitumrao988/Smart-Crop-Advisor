import pandas as pd
import random
import os

# Set seed for reproducibility
random.seed(42)

# Based exactly on the React frontend components
crops = [
    "Rice", "Wheat", "Maize", "Tomato", "Potato", "Cotton", 
    "Sugarcane", "Groundnut", "Soybean", "Mango", "Banana", "Grapes"
]

symptoms_list = [
    "Yellow leaves", "Brown spots on leaves", "Wilting stems", 
    "White powder on leaves", "Black lesions", "Stunted growth", 
    "Root rot", "Leaf curl", "Fruit discoloration", 
    "Premature fruit drop", "Water-soaked patches", "Rusty orange pustules"
]

# Mapping logical diseases to crops and their primary symptoms
disease_map = {
    "Rice": {
        "Brown Spot": ["Brown spots on leaves", "Yellow leaves"],
        "Bacterial Blight": ["Water-soaked patches", "Wilting stems", "Yellow leaves"],
        "Blast": ["Black lesions", "Stunted growth", "Brown spots on leaves"]
    },
    "Wheat": {
        "Powdery Mildew": ["White powder on leaves", "Yellow leaves"],
        "Leaf Rust": ["Rusty orange pustules", "Yellow leaves"],
        "Root Rot": ["Root rot", "Stunted growth", "Yellow leaves"]
    },
    "Maize": {
        "Common Rust": ["Rusty orange pustules", "Brown spots on leaves"],
        "Leaf Blight": ["Black lesions", "Wilting stems", "Yellow leaves"]
    },
    "Tomato": {
        "Early Blight": ["Brown spots on leaves", "Yellow leaves", "Premature fruit drop"],
        "Late Blight": ["Water-soaked patches", "Black lesions", "Fruit discoloration"],
        "Leaf Curl": ["Leaf curl", "Stunted growth", "Yellow leaves"]
    },
    "Potato": {
        "Late Blight": ["Water-soaked patches", "Black lesions", "Wilting stems"],
        "Early Blight": ["Brown spots on leaves", "Yellow leaves"],
        "Black Scurf": ["Black lesions", "Stunted growth"]
    },
    "Cotton": {
        "Bacterial Blight": ["Water-soaked patches", "Black lesions", "Premature fruit drop"],
        "Wilt": ["Wilting stems", "Yellow leaves", "Stunted growth"]
    },
    "Sugarcane": {
        "Red Rot": ["Wilting stems", "Yellow leaves", "Stunted growth"],
        "Rust": ["Rusty orange pustules", "Brown spots on leaves"]
    },
    "Groundnut": {
        "Leaf Spot": ["Brown spots on leaves", "Yellow leaves", "Premature fruit drop"],
        "Rust": ["Rusty orange pustules", "Premature fruit drop"]
    },
    "Soybean": {
        "Rust": ["Rusty orange pustules", "Yellow leaves", "Premature fruit drop"],
        "Root Rot": ["Root rot", "Wilting stems", "Stunted growth"]
    },
    "Mango": {
        "Anthracnose": ["Black lesions", "Fruit discoloration", "Premature fruit drop"],
        "Powdery Mildew": ["White powder on leaves", "Fruit discoloration"]
    },
    "Banana": {
        "Panama Disease": ["Yellow leaves", "Wilting stems", "Root rot"],
        "Black Sigatoka": ["Black lesions", "Brown spots on leaves", "Premature fruit drop"]
    },
    "Grapes": {
        "Powdery Mildew": ["White powder on leaves", "Fruit discoloration", "Stunted growth"],
        "Downy Mildew": ["Yellow leaves", "White powder on leaves", "Premature fruit drop"]
    }
}

print("Generating synthetic crop disease data...")

# Generate dataset
data = []
# Create 3000 rows to ensure enough training samples
for _ in range(3000):
    crop = random.choice(list(disease_map.keys()))
    disease = random.choice(list(disease_map[crop].keys()))
    core_symptoms = disease_map[crop][disease]
    
    # Pick a random number of valid symptoms from the core list (at least 1)
    num_symptoms = random.randint(1, len(core_symptoms))
    selected_symptoms = random.sample(core_symptoms, num_symptoms)
    
    # 15% chance to add a random noise symptom (mimics real-world messy input)
    if random.random() < 0.15:
        noise = random.choice([s for s in symptoms_list if s not in selected_symptoms])
        selected_symptoms.append(noise)
        
    symptoms_str = ", ".join(selected_symptoms)
    severity = random.choice(["Low", "Medium", "High", "Critical"])
    
    data.append([crop, symptoms_str, disease, severity])

df = pd.DataFrame(data, columns=["Crop", "Symptoms", "Disease", "Severity"])

# Save to the ai/data directory
output_path = os.path.join(os.path.dirname(__file__), "disease_data.csv")
df.to_csv(output_path, index=False)

print(f"Successfully generated {len(df)} rows!")
print(f"File saved to: {output_path}")
