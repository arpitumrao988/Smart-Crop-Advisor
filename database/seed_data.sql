-- ============================================================
--  Smart Crop Advisor — Database Reference Seed Data
--  File Location: database/seed_data.sql
-- ============================================================

USE smart_crop_advisor;

-- Clear any existing disease lookup data to avoid duplicates on re-runs
TRUNCATE TABLE disease_info;

INSERT INTO disease_info (crop_name, disease_name, symptoms, treatment, prevention) VALUES
-- ── RICE DISEASES ──────────────────────────────────────────
('Rice', 'Bacterial Leaf Blight',
 'Water-soaked stripes starting from leaf tips and margins, which enlarge and turn yellow/light brown. In young seedlings, leaves roll up, wilt, and dry out (known as kresek stage). Sticky yellow bacterial ooze may appear on leaves in high humidity.',
 'Avoid excessive nitrogen fertilization as it promotes vegetative growth that is highly vulnerable. Drain the fields temporarily if severe infection is observed. Apply copper-based bactericides (e.g., Copper Oxychloride) at 2.5g/L under expert consultation.',
 'Use disease-resistant rice cultivars. Ensure proper plant spacing for air circulation. Destroy infected crop residues and weeds around the bunds after harvest. Avoid flooding nursery beds.'),

('Rice', 'Blast',
 'Spindle-shaped or diamond-shaped lesions on leaves with gray/white centers and reddish-brown borders. In later stages, lesions can form on the neck of the panicle (neck blast), causing it to break and grains to remain empty.',
 'Apply systemic fungicides such as Tricyclazole (e.g., 0.6g/L) or Isoprothiolane immediately upon first symptom detection. Avoid late-season nitrogen applications.',
 'Select certified disease-free seeds or treat seeds with fungicides before sowing. Maintain balanced NPK nutrition. Avoid water stress (maintain continuous shallow flooding in fields).'),

-- ── WHEAT DISEASES ──────────────────────────────────────────
('Wheat', 'Leaf Rust',
 'Small, oval, orange-yellow to reddish-brown powdery pustules (uredinia) scattered randomly on the upper leaf surface. Under severe infestation, leaves turn yellow and die prematurely, shrinking grain size.',
 'Apply chemical fungicides such as Propiconazole (25% EC) or Tebuconazole at recommended doses. Spray at the first appearance of rust pustules.',
 'Plant rust-resistant wheat varieties (the most effective control method). Keep field borders clear of wild host grasses. Practice crop rotation with non-cereal crops.'),

('Wheat', 'Powdery Mildew',
 'Superficial, white-to-gray powdery fungal patches on the upper surface of leaves, sheaths, and stems. These patches turn dull gray or brown as the fungus matures, with tiny black dots (cleistothecia) embedding within.',
 'Spray wettable sulfur (2g/L) or systemic triazole fungicides like Hexaconazole or Propiconazole if weather is cool and damp and disease levels cross threshold limits.',
 'Avoid excessive planting density to allow sunlight penetration and airflow. Do not over-fertilize with nitrogen. Rotate crops annually.'),

-- ── TOMATO DISEASES ─────────────────────────────────────────
('Tomato', 'Early Blight',
 'Irregular dark brown or black spots with concentric rings (target-like pattern) appearing first on older leaves. Leaves turn yellow, wither, and drop. Can also cause dark sunken spots near the stem end of fruits.',
 'Apply protective fungicides like Chlorothalonil or Mancozeb every 7-10 days in warm, wet weather. Remove infected lower leaves to reduce spores bouncing from soil.',
 'Ensure crop rotation of at least 3 years away from Solanaceous crops (potatoes, eggplants). Apply mulch to prevent soil splashing onto foliage. Water plants at the base (avoid overhead irrigation).'),

('Tomato', 'Late Blight',
 'Large, irregular, water-soaked dark greenish-black lesions on leaves and stems that rapidly expand. Under humid conditions, a white velvety mold forms on the underside of infected leaves. Fruits develop firm, dark brown, greasy spots.',
 'This is a highly destructive disease. Spray preventative fungicides like Mancozeb or Copper Hydroxide. If disease is active, apply systemic fungicides containing Metalaxyl or Azoxystrobin.',
 'Destroy any potato or tomato volunteer plants in the vicinity. Use drip irrigation. Select resistant varieties. Ensure excellent drainage and ventilation.'),

-- ── POTATO DISEASES ─────────────────────────────────────────
('Potato', 'Common Scab',
 'Corky, rough, brown lesions that can be raised, pitted, or flat on the tuber skin. Although it does not rot the tuber or affect cooking quality, it heavily degrades market value.',
 'Maintain soil pH below 5.2 (scab bacteria cannot thrive in acidic soil). Ensure adequate soil moisture during the first 4-6 weeks of tuber development (critical stage).',
 'Use certified scab-free seed potatoes. Rotate potatoes with green manure crops like alfalfa, rye, or oats. Avoid using fresh manure or lime right before planting potatoes.'),

('Potato', 'Black Scurf',
 'Hard, dark brown or black dirt-like patches (sclerotia) adhering firmly to the tuber surface that do not wash off. Also causes "canker" on underground stems and stolons, leading to stunted plants or aerial tubers.',
 'Treat seed tubers with fungicides containing Fludioxonil or Pencycuron before planting. Apply Azoxystrobin in-furrow during planting for soil-borne protection.',
 'Harvest tubers immediately after vine kill (prolonged time in soil increases scurf accumulation). Plant seeds only when soil temperatures reach above 10°C to speed up emergence.');
