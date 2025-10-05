import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.utils import resample
import xgboost as xgb
from sklearn.metrics import accuracy_score, classification_report
import joblib
import torch
from multimodal_model import MultiModalTalentModel

# Set random seed for reproducibility
np.random.seed(42)
torch.manual_seed(42)

print("="*60)
print("MULTIMODAL STEM TALENT DETECTION MODEL TRAINING")
print("="*60)

# --- CREATE SYNTHETIC DATASET ---
print("\n[1/6] Generating synthetic data...")
n = 2000  # number of synthetic students

data = pd.DataFrame({
    'math_score': np.random.normal(75, 10, n),
    'science_score': np.random.normal(72, 12, n),
    'project_score': np.random.normal(70, 15, n),
    'gender': np.random.choice(['Male', 'Female', 'Non-Binary'], n, p=[0.45, 0.45, 0.10]),
    'socioeconomic_index': np.random.uniform(0, 1, n),
})

# Create synthetic STEM potential labels
data['stem_potential'] = (
    0.4 * data['math_score'] +
    0.4 * data['science_score'] +
    0.2 * data['project_score'] +
    np.random.normal(0, 5, n)
)
data['stem_potential_label'] = (data['stem_potential'] > data['stem_potential'].median()).astype(int)

# Generate text descriptions for each student
text_descriptions = []
for _, row in data.iterrows():
    desc_parts = []

    # Math ability
    if row['math_score'] > 80:
        desc_parts.append("strong mathematical skills")
    elif row['math_score'] > 60:
        desc_parts.append("moderate math proficiency")
    else:
        desc_parts.append("developing math abilities")

    # Science interest
    if row['science_score'] > 80:
        desc_parts.append("excellent scientific understanding")
    elif row['science_score'] > 60:
        desc_parts.append("good science foundation")
    else:
        desc_parts.append("emerging science interest")

    # Project work
    if row['project_score'] > 80:
        desc_parts.append("outstanding project execution")
    elif row['project_score'] > 60:
        desc_parts.append("solid hands-on experience")
    else:
        desc_parts.append("growing practical skills")

    text_descriptions.append(f"Student with {', '.join(desc_parts)}")

data['text_description'] = text_descriptions

print(f"✓ Generated {n} student records")
print(f"✓ Label distribution: {data['stem_potential_label'].value_counts().to_dict()}")

# --- BALANCE DATASET ---
print("\n[2/6] Balancing dataset by gender...")
female = data[data.gender == 'Female']
male = data[data.gender == 'Male']
non_binary = data[data.gender == 'Non-Binary']

max_n = max(len(female), len(male), len(non_binary))
balanced_data = pd.concat([
    resample(female, replace=True, n_samples=max_n, random_state=42),
    resample(male, replace=True, n_samples=max_n, random_state=42),
    resample(non_binary, replace=True, n_samples=max_n, random_state=42)
])

print(f"✓ Balanced dataset size: {len(balanced_data)}")
print(f"✓ Gender distribution: {balanced_data['gender'].value_counts().to_dict()}")

# --- ENCODE FEATURES ---
print("\n[3/6] Encoding features...")
le = LabelEncoder()
balanced_data['gender_encoded'] = le.fit_transform(balanced_data['gender'])

# Prepare numeric features
numeric_features = balanced_data[['math_score', 'science_score', 'project_score', 'gender_encoded', 'socioeconomic_index']].values

# Prepare text features
text_features = balanced_data['text_description'].tolist()

# Labels
y = balanced_data['stem_potential_label'].values

print(f"✓ Numeric features shape: {numeric_features.shape}")
print(f"✓ Text features count: {len(text_features)}")

# --- SPLIT DATA ---
print("\n[4/6] Splitting data...")
X_num_train, X_num_test, X_text_train, X_text_test, y_train, y_test = train_test_split(
    numeric_features, text_features, y, test_size=0.2, random_state=42, stratify=y
)

print(f"✓ Train samples: {len(X_num_train)}")
print(f"✓ Test samples: {len(X_num_test)}")

# --- TRAIN MULTIMODAL MODEL ---
print("\n[5/6] Training multimodal model...")
print("  → Initializing encoders...")
model = MultiModalTalentModel()

print("  → Encoding training data...")
train_embeddings = model.encode_features(X_text_train, X_num_train)

print("  → Encoding test data...")
test_embeddings = model.encode_features(X_text_test, X_num_test)

print(f"  → Fused embedding dimension: {train_embeddings.shape[1]}")

print("  → Training XGBoost classifier...")
xgb_model = xgb.XGBClassifier(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=4,
    random_state=42,
    eval_metric='logloss'
)

xgb_model.fit(train_embeddings, y_train)
model.set_xgb_model(xgb_model)

print("  ✓ Training complete!")

# --- EVALUATE MODEL ---
print("\n[6/6] Evaluating model...")
y_pred = xgb_model.predict(test_embeddings)
y_prob = xgb_model.predict_proba(test_embeddings)

accuracy = accuracy_score(y_test, y_pred)
print(f"\n{'='*60}")
print(f"MODEL PERFORMANCE")
print(f"{'='*60}")
print(f"Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
print(f"\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['Low Potential', 'High Potential']))

# Feature importance
booster = xgb_model.get_booster()
importance = booster.get_score(importance_type='gain')
if importance:
    topk = sorted(importance.items(), key=lambda x: x[1], reverse=True)[:10]
    print(f"\nTop 10 Features by Gain:")
    for feat, score in topk:
        print(f"  {feat}: {score:.2f}")

# --- SAVE MODEL ---
print(f"\n{'='*60}")
print("SAVING MODEL ARTIFACTS")
print(f"{'='*60}")

joblib.dump(xgb_model, "multimodal_stem_model.pkl")
print("✓ Saved: multimodal_stem_model.pkl")

joblib.dump(le, "label_encoder.pkl")
print("✓ Saved: label_encoder.pkl")

# Save model configuration
config = {
    'text_embed_dim': 384,
    'num_proj_dim': 64,
    'numeric_input_dim': 5,
    'fused_dim': train_embeddings.shape[1],
    'accuracy': float(accuracy),
    'n_features': train_embeddings.shape[1]
}
joblib.dump(config, "model_config.pkl")
print("✓ Saved: model_config.pkl")

print(f"\n{'='*60}")
print("✅ TRAINING COMPLETE!")
print(f"{'='*60}")
print(f"Model accuracy: {accuracy*100:.2f}%")
print(f"Fused embedding size: {train_embeddings.shape[1]}")
print(f"Ready for deployment!")
