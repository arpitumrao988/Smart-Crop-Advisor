"""
train_fertilizer.py
====================
Standalone script that replicates every step of the
fertilizer_model_training.ipynb notebook.

Run from the project root with the venv activated:
    python ai/train_fertilizer.py
"""

import os, warnings
warnings.filterwarnings('ignore')

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

from sklearn.ensemble         import RandomForestClassifier
from sklearn.model_selection  import (
    train_test_split, GridSearchCV, StratifiedKFold, cross_val_score
)
from sklearn.preprocessing    import LabelEncoder, StandardScaler
from sklearn.metrics          import (
    accuracy_score, classification_report,
    confusion_matrix, ConfusionMatrixDisplay
)

# ── Paths ──────────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR   = os.path.join(SCRIPT_DIR, 'data')
MODELS_DIR = os.path.join(SCRIPT_DIR, 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

# ── STEP 1: Load Dataset ───────────────────────────────────────────────────
csv_file = None
for f in os.listdir(DATA_DIR):
    if 'fertil' in f.lower() and f.lower().endswith('.csv'):
        csv_file = os.path.join(DATA_DIR, f)
        break

if csv_file is None:
    raise FileNotFoundError('No fertilizer CSV found in ai/data/')

print(f'\n📄 Loading: {csv_file}')
df = pd.read_csv(csv_file, dtype_backend='numpy_nullable')
df.columns = df.columns.str.strip()
for col in df.select_dtypes(include='object').columns:
    df[col] = df[col].str.strip()
df = df.convert_dtypes(convert_string=False)

print(f'✅ Dataset loaded — Shape: {df.shape}')
print(f'   Columns: {list(df.columns)}')

# ── STEP 2: Identify Columns ───────────────────────────────────────────────
TARGET_COL = None
for col in df.columns:
    if 'fertilizer' in col.lower():
        TARGET_COL = col
        break
if TARGET_COL is None:
    TARGET_COL = df.columns[-1]

FEATURE_COLS = [c for c in df.columns if c != TARGET_COL]
NUM_COLS     = [c for c in FEATURE_COLS if pd.api.types.is_numeric_dtype(df[c])]
CAT_COLS     = [c for c in FEATURE_COLS if not pd.api.types.is_numeric_dtype(df[c])]

print(f'\n🎯 Target          : "{TARGET_COL}"')
print(f'🔢 Numeric cols    : {NUM_COLS}')
print(f'🔤 Categorical cols: {CAT_COLS}')
print(f'🌿 Classes ({df[TARGET_COL].nunique()}): {sorted(df[TARGET_COL].unique())}')

# ── STEP 3: EDA Plots ──────────────────────────────────────────────────────
print('\n📊 Generating EDA plots...')

# Class distribution
vc = df[TARGET_COL].value_counts()
fig, ax = plt.subplots(figsize=(11, 5))
colors = plt.cm.Set2(np.linspace(0, 1, len(vc)))
vc.plot(kind='bar', ax=ax, color=colors, edgecolor='black', width=0.7)
ax.set_title('Fertilizer Class Distribution', fontsize=14, fontweight='bold')
ax.set_xlabel('Fertilizer Name'); ax.set_ylabel('Count')
ax.tick_params(axis='x', rotation=30)
for p in ax.patches:
    ax.annotate(str(int(p.get_height())),
                (p.get_x() + p.get_width()/2., p.get_height()),
                ha='center', va='bottom', fontsize=10, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(MODELS_DIR, 'fertilizer_class_dist.png'), dpi=100)
plt.close()

# Numeric distributions
if NUM_COLS:
    cols_per_row = 3
    rows = (len(NUM_COLS) + cols_per_row - 1) // cols_per_row
    fig, axes = plt.subplots(rows, cols_per_row, figsize=(15, 4 * rows))
    axes = np.array(axes).flatten()
    for i, col in enumerate(NUM_COLS):
        axes[i].hist(df[col].astype(float), bins=20,
                     color='steelblue', edgecolor='white', alpha=0.85)
        axes[i].set_title(f'{col}', fontweight='bold')
    for j in range(len(NUM_COLS), len(axes)):
        axes[j].set_visible(False)
    plt.suptitle('Numeric Feature Distributions', fontsize=13, fontweight='bold')
    plt.tight_layout()
    plt.savefig(os.path.join(MODELS_DIR, 'fertilizer_numeric_dist.png'), dpi=100)
    plt.close()

# Correlation heatmap
if len(NUM_COLS) >= 2:
    corr = df[NUM_COLS].astype(float).corr()
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm', ax=ax,
                linewidths=0.5, square=True)
    ax.set_title('Feature Correlation Matrix', fontsize=13, fontweight='bold')
    plt.tight_layout()
    plt.savefig(os.path.join(MODELS_DIR, 'fertilizer_correlation.png'), dpi=100)
    plt.close()

print('   EDA plots saved to models/')

# ── STEP 4: Preprocessing ─────────────────────────────────────────────────
print('\n⚙️  Preprocessing...')
df_proc = df.copy()

label_encoders = {}
for col in CAT_COLS:
    le = LabelEncoder()
    df_proc[col] = le.fit_transform(df_proc[col].astype(str).str.strip())
    label_encoders[col] = le
    print(f'   ✔ "{col}" encoded  →  {list(le.classes_)}')

target_encoder = LabelEncoder()
df_proc[TARGET_COL] = target_encoder.fit_transform(
    df_proc[TARGET_COL].astype(str).str.strip()
)
print(f'   ✔ Target "{TARGET_COL}" encoded  →  {list(target_encoder.classes_)}')

# Convert to plain numpy float64 — avoids ALL dtype issues with sklearn
X_raw  = df_proc[FEATURE_COLS].astype(float).to_numpy(dtype=np.float64)
y      = df_proc[TARGET_COL].to_numpy(dtype=np.int64)

scaler   = StandardScaler()
X_scaled = scaler.fit_transform(X_raw)
print(f'   ✔ StandardScaler applied — X_scaled shape: {X_scaled.shape}')

# ── STEP 5: Train/Test Split ───────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)
print(f'\n✂️  Train: {X_train.shape[0]} | Test: {X_test.shape[0]}')

# ── STEP 6: Baseline + Cross-Validation ───────────────────────────────────
print('\n🌲 Training baseline RandomForest...')
baseline_rf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
baseline_rf.fit(X_train, y_train)
baseline_acc = accuracy_score(y_test, baseline_rf.predict(X_test))
print(f'   Baseline Accuracy: {baseline_acc * 100:.2f}%')

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(baseline_rf, X_scaled, y, cv=cv, scoring='accuracy', n_jobs=-1)
print(f'   5-Fold CV: {cv_scores.mean() * 100:.2f}% ± {cv_scores.std() * 100:.2f}%')

# ── STEP 7: GridSearchCV ───────────────────────────────────────────────────
print('\n🔍 Running GridSearchCV...')
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
print(f'✅ Best Params  : {best_params}')
print(f'   Best CV Score: {grid_search.best_score_ * 100:.2f}%')

# ── STEP 8: Final Model (100% data) ───────────────────────────────────────
final_model = RandomForestClassifier(**best_params, random_state=42, n_jobs=-1)
final_model.fit(X_scaled, y)
print('✅ Final model retrained on 100% data')

# ── STEP 9: Evaluation ─────────────────────────────────────────────────────
y_pred   = grid_search.best_estimator_.predict(X_test)
test_acc = accuracy_score(y_test, y_pred)

print(f'\n{"="*55}')
print(f'  TEST SET ACCURACY : {test_acc * 100:.2f}%')
print(f'{"="*55}')
print('\n📋 Classification Report:')
print(classification_report(y_test, y_pred, target_names=target_encoder.classes_))

# Confusion matrix plot
fig, ax = plt.subplots(figsize=(10, 8))
cm   = confusion_matrix(y_test, y_pred)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=target_encoder.classes_)
disp.plot(ax=ax, cmap='Blues', colorbar=True, xticks_rotation=30)
ax.set_title('Confusion Matrix — Fertilizer Prediction', fontsize=13, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(MODELS_DIR, 'fertilizer_confusion_matrix.png'), dpi=100)
plt.close()

# Feature importance plot
importances = grid_search.best_estimator_.feature_importances_
feat_imp    = pd.Series(importances, index=FEATURE_COLS).sort_values(ascending=True)
fig, ax = plt.subplots(figsize=(9, 5))
colors  = plt.cm.RdYlGn(np.linspace(0.2, 0.9, len(feat_imp)))
feat_imp.plot(kind='barh', ax=ax, color=colors, edgecolor='black')
ax.set_title('Feature Importance — RandomForest Fertilizer Model', fontweight='bold')
ax.set_xlabel('Gini Importance Score')
plt.tight_layout()
plt.savefig(os.path.join(MODELS_DIR, 'fertilizer_feature_importance.png'), dpi=100)
plt.close()

# ── STEP 10: Save Artifacts ────────────────────────────────────────────────
print('\n💾 Saving model artifacts...')

joblib.dump(final_model,    os.path.join(MODELS_DIR, 'fertilizer_model.pkl'))
joblib.dump(scaler,         os.path.join(MODELS_DIR, 'fertilizer_scaler.pkl'))
joblib.dump(label_encoders, os.path.join(MODELS_DIR, 'fertilizer_label_encoders.pkl'))
joblib.dump(target_encoder, os.path.join(MODELS_DIR, 'fertilizer_target_encoder.pkl'))
joblib.dump({
    'feature_columns'    : FEATURE_COLS,
    'numeric_columns'    : NUM_COLS,
    'categorical_columns': CAT_COLS,
    'target_column'      : TARGET_COL,
    'target_classes'     : list(target_encoder.classes_),
    'best_params'        : best_params,
    'test_accuracy_pct'  : round(test_acc * 100, 2),
    'cv_mean_accuracy_pct': round(cv_scores.mean() * 100, 2),
}, os.path.join(MODELS_DIR, 'fertilizer_model_metadata.pkl'))

print('\n📁 Files in models/:')
for f in sorted(os.listdir(MODELS_DIR)):
    size_kb = os.path.getsize(os.path.join(MODELS_DIR, f)) / 1024
    print(f'   {f:<45} {size_kb:>7.1f} KB')

print(f'\n{"="*55}')
print(f'  🌿 TRAINING COMPLETE')
print(f'{"="*55}')
print(f'  Algorithm    : RandomForestClassifier')
print(f'  Best Params  : {best_params}')
print(f'  CV Accuracy  : {cv_scores.mean() * 100:.2f}% ± {cv_scores.std() * 100:.2f}%')
print(f'  Test Accuracy: {test_acc * 100:.2f}%')
print(f'  Output       : fertilizer_model.pkl')
print(f'{"="*55}\n')
