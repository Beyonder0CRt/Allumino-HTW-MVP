import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.utils import resample
import xgboost as xgb
from sklearn.metrics import accuracy_score
import joblib

# Set random seed for reproducibility
np.random.seed(42)
n = 2000  # number of synthetic students

# Create synthetic dataset
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

# Balance dataset by gender
female = data[data.gender == 'Female']
male = data[data.gender == 'Male']
non_binary = data[data.gender == 'Non-Binary']

max_n = max(len(female), len(male), len(non_binary))
balanced_data = pd.concat([
    resample(female, replace=True, n_samples=max_n, random_state=42),
    resample(male, replace=True, n_samples=max_n, random_state=42),
    resample(non_binary, replace=True, n_samples=max_n, random_state=42)
])

# Encode gender
le = LabelEncoder()
balanced_data['gender_encoded'] = le.fit_transform(balanced_data['gender'])

# Prepare features and target
X = balanced_data[['math_score', 'science_score', 'project_score', 'gender_encoded', 'socioeconomic_index']]
y = balanced_data['stem_potential_label']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train XGBoost model
model = xgb.XGBClassifier(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=4,
    random_state=42
)
model.fit(X_train, y_train)

# Evaluate model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy:.4f}")

# Save model and label encoder
joblib.dump(model, "stem_talent_model.pkl")
joblib.dump(le, "label_encoder.pkl")
print("Model and encoder saved successfully!")
