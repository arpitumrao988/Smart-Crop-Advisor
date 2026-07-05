"""
train_disease.py
====================
Standalone script that trains the Disease Detection model.

The model receives a crop name and a list of text symptoms,
and predicts the most likely disease name.

Approach:
  - Crop name is label-encoded as a numeric feature.
  - Symptoms (comma-separated text) are vectorized using TF-IDF.
  - Both feature sets are combined (hstacked).
  - A RandomForestClassifier is trained on the combined features.

Run from the project root with the venv activated:
    python ai/train_disease.py
"""

import os, sys, warnings
warnings.filterwarnings('ignore')

# Fix Windows console encoding for special characters
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from scipy.sparse import hstack, csr_matrix

from sklearn.ensemble         import RandomForestClassifier
from sklearn.model_selection  import (
    train_test_split, GridSearchCV, StratifiedKFold, cross_val_score
)
from sklearn.preprocessing    import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics          import (
    accuracy_score, classification_report,
    confusion_matrix, ConfusionMatrixDisplay
)

# -- Paths -------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR   = os.path.join(SCRIPT_DIR, 'data')
MODELS_DIR = os.path.join(SCRIPT_DIR, 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

# -- STEP 1: Load Dataset ----------------------------------------------------
csv_file = os.path.join(DATA_DIR, 'disease_data.csv')

if not os.path.exists(csv_file):
    raise FileNotFoundError(f'disease_data.csv not found in {DATA_DIR}')

print(f'\n[1/10] Loading: {csv_file}')
df = pd.read_csv(csv_file)
df.columns = df.columns.str.strip()
for col in df.select_dtypes(include='object').columns:
    df[col] = df[col].str.strip()

print(f'  -> Dataset loaded -- Shape: {df.shape}')
print(f'     Columns: {list(df.columns)}')

# -- STEP 2: Identify Columns ------------------------------------------------
CROP_COL     = 'Crop'
SYMPTOM_COL  = 'Symptoms'
TARGET_COL   = 'Disease'

print(f'\n[2/10] Column Identification')
print(f'  -> Target           : "{TARGET_COL}"')
print(f'  -> Crop column      : "{CROP_COL}"')
print(f'  -> Symptom column   : "{SYMPTOM_COL}"')
print(f'  -> Disease classes ({df[TARGET_COL].nunique()}): {sorted(df[TARGET_COL].unique())}')

# -- STEP 3: EDA Plots -------------------------------------------------------
print('\n[3/10] Generating EDA plots...')

# Disease class distribution
vc = df[TARGET_COL].value_counts()
fig, ax = plt.subplots(figsize=(12, 5))
colors = plt.cm.Set2(np.linspace(0, 1, len(vc)))
vc.plot(kind='bar', ax=ax, color=colors, edgecolor='black', width=0.7)
ax.set_title('Disease Class Distribution', fontsize=14, fontweight='bold')
ax.set_xlabel('Disease Name'); ax.set_ylabel('Count')
ax.tick_params(axis='x', rotation=30)
for p in ax.patches:
    ax.annotate(str(int(p.get_height())),
                (p.get_x() + p.get_width()/2., p.get_height()),
                ha='center', va='bottom', fontsize=10, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(MODELS_DIR, 'disease_class_dist.png'), dpi=100)
plt.close()

# Crop vs Disease heatmap
ct = pd.crosstab(df[CROP_COL], df[TARGET_COL])
fig, ax = plt.subplots(figsize=(14, 8))
sns.heatmap(ct, annot=True, fmt='d', cmap='YlOrRd', ax=ax,
            linewidths=0.5, square=False)
ax.set_title('Crop vs Disease Frequency Heatmap', fontsize=13, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(MODELS_DIR, 'disease_crop_heatmap.png'), dpi=100)
plt.close()

print('  -> EDA plots saved to models/')

# -- STEP 4: Preprocessing ---------------------------------------------------
print('\n[4/10] Preprocessing...')

# 4a. Encode the crop name
crop_encoder = LabelEncoder()
crop_encoded = crop_encoder.fit_transform(df[CROP_COL].astype(str))
print(f'  -> "{CROP_COL}" encoded  ->  {list(crop_encoder.classes_)}')

# 4b. Vectorize the symptom text using TF-IDF
#     This converts "Yellow leaves, Brown spots on leaves" into a sparse numeric vector.
#     The backend sends symptoms as a list; at inference time we join them with ", ".
tfidf = TfidfVectorizer(
    lowercase=True,
    max_features=200,       # Limit vocabulary size
    ngram_range=(1, 2),     # Capture "brown spots" as a bigram
    stop_words='english'
)
symptom_vectors = tfidf.fit_transform(df[SYMPTOM_COL].astype(str))
print(f'  -> TF-IDF applied -- vocabulary size: {len(tfidf.vocabulary_)}')

# 4c. Combine crop (as a column) + symptom TF-IDF vectors
crop_sparse = csr_matrix(crop_encoded.reshape(-1, 1).astype(np.float64))
X = hstack([crop_sparse, symptom_vectors])
print(f'  -> Combined feature matrix shape: {X.shape}')

# 4d. Encode the target (disease name)
target_encoder = LabelEncoder()
y = target_encoder.fit_transform(df[TARGET_COL].astype(str))
print(f'  -> Target "{TARGET_COL}" encoded  ->  {list(target_encoder.classes_)}')

# -- STEP 5: Train/Test Split ------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f'\n[5/10] Train: {X_train.shape[0]} | Test: {X_test.shape[0]}')

# -- STEP 6: Baseline + Cross-Validation -------------------------------------
print('\n[6/10] Training baseline RandomForest...')
baseline_rf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
baseline_rf.fit(X_train, y_train)
baseline_acc = accuracy_score(y_test, baseline_rf.predict(X_test))
print(f'  -> Baseline Accuracy: {baseline_acc * 100:.2f}%')

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(baseline_rf, X, y, cv=cv, scoring='accuracy', n_jobs=-1)
print(f'  -> 5-Fold CV: {cv_scores.mean() * 100:.2f}% +/- {cv_scores.std() * 100:.2f}%')

# -- STEP 7: GridSearchCV ----------------------------------------------------
print('\n[7/10] Running GridSearchCV...')
param_grid = {
    'n_estimators'     : [100, 200, 300],
    'max_depth'        : [None, 10, 20],
    'min_samples_split': [2, 5],
    'max_features'     : ['sqrt', 'log2']
}
grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42, n_jobs=-1),
    param_grid,
    cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=42),
    scoring='accuracy', n_jobs=-1, verbose=1
)
grid_search.fit(X_train, y_train)

best_params = grid_search.best_params_
print(f'  -> Best Params  : {best_params}')
print(f'  -> Best CV Score: {grid_search.best_score_ * 100:.2f}%')

# -- STEP 8: Final Model (100% data) -----------------------------------------
print('\n[8/10] Retraining final model on 100% data...')
final_model = RandomForestClassifier(**best_params, random_state=42, n_jobs=-1)
final_model.fit(X, y)
print('  -> Final model retrained on 100% data')

# -- STEP 9: Evaluation ------------------------------------------------------
y_pred   = grid_search.best_estimator_.predict(X_test)
test_acc = accuracy_score(y_test, y_pred)

print(f'\n[9/10] Evaluation')
print(f'{"="*55}')
print(f'  TEST SET ACCURACY : {test_acc * 100:.2f}%')
print(f'{"="*55}')
print('\n  Classification Report:')
print(classification_report(y_test, y_pred, target_names=target_encoder.classes_))

# Confusion matrix plot
fig, ax = plt.subplots(figsize=(12, 10))
cm   = confusion_matrix(y_test, y_pred)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=target_encoder.classes_)
disp.plot(ax=ax, cmap='Blues', colorbar=True, xticks_rotation=30)
ax.set_title('Confusion Matrix -- Disease Detection', fontsize=13, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(MODELS_DIR, 'disease_confusion_matrix.png'), dpi=100)
plt.close()

# -- STEP 10: Save Artifacts -------------------------------------------------
print('\n[10/10] Saving model artifacts...')

joblib.dump(final_model,    os.path.join(MODELS_DIR, 'disease_model.pkl'))
joblib.dump(crop_encoder,   os.path.join(MODELS_DIR, 'disease_crop_encoder.pkl'))
joblib.dump(tfidf,          os.path.join(MODELS_DIR, 'disease_tfidf.pkl'))
joblib.dump(target_encoder, os.path.join(MODELS_DIR, 'disease_target_encoder.pkl'))
joblib.dump({
    'crop_column'          : CROP_COL,
    'symptom_column'       : SYMPTOM_COL,
    'target_column'        : TARGET_COL,
    'target_classes'       : list(target_encoder.classes_),
    'crop_classes'         : list(crop_encoder.classes_),
    'best_params'          : best_params,
    'test_accuracy_pct'    : round(test_acc * 100, 2),
    'cv_mean_accuracy_pct' : round(cv_scores.mean() * 100, 2),
    'tfidf_vocab_size'     : len(tfidf.vocabulary_),
}, os.path.join(MODELS_DIR, 'disease_model_metadata.pkl'))

print('\n  Disease model files in models/:')
for f in sorted(os.listdir(MODELS_DIR)):
    if 'disease' in f.lower():
        size_kb = os.path.getsize(os.path.join(MODELS_DIR, f)) / 1024
        print(f'   {f:<45} {size_kb:>7.1f} KB')

print(f'\n{"="*55}')
print(f'  DISEASE MODEL TRAINING COMPLETE')
print(f'{"="*55}')
print(f'  Algorithm    : RandomForestClassifier')
print(f'  Best Params  : {best_params}')
print(f'  CV Accuracy  : {cv_scores.mean() * 100:.2f}% +/- {cv_scores.std() * 100:.2f}%')
print(f'  Test Accuracy: {test_acc * 100:.2f}%')
print(f'  Output       : disease_model.pkl')
print(f'{"="*55}\n')
