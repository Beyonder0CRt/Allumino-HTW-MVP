from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load model and encoder
MODEL_PATH = "stem_talent_model.pkl"
ENCODER_PATH = "label_encoder.pkl"

model = None
label_encoder = None

def load_model():
    global model, label_encoder
    if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
        model = joblib.load(MODEL_PATH)
        label_encoder = joblib.load(ENCODER_PATH)
        print("Model loaded successfully!")
    else:
        print("Model not found. Please train the model first.")

def adaptive_questioning(proba, threshold=0.6):
    """Provide adaptive recommendations based on STEM potential probability"""
    if 0.4 < proba < threshold:
        return {
            "recommendation": "intermediate",
            "message": "Ask more about recent projects or favorite STEM subjects.",
            "next_steps": [
                "Explore recent STEM projects",
                "Identify favorite STEM subjects",
                "Assess hands-on experience"
            ]
        }
    elif proba >= threshold:
        return {
            "recommendation": "advanced",
            "message": "Recommend advanced STEM pathway and mentorship.",
            "next_steps": [
                "Connect with STEM mentors",
                "Enroll in advanced courses",
                "Participate in competitions",
                "Join research programs"
            ]
        }
    else:
        return {
            "recommendation": "beginner",
            "message": "Suggest exposure to beginner STEM experiences.",
            "next_steps": [
                "Introduce foundational STEM concepts",
                "Provide hands-on activities",
                "Build interest through games",
                "Connect with supportive community"
            ]
        }

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.get_json()

        # Extract features
        math_score = data.get('math_score')
        science_score = data.get('science_score')
        project_score = data.get('project_score')
        gender = data.get('gender')
        socioeconomic_index = data.get('socioeconomic_index')

        # Validate inputs
        if None in [math_score, science_score, project_score, gender, socioeconomic_index]:
            return jsonify({"error": "Missing required fields"}), 400

        # Encode gender
        try:
            gender_encoded = label_encoder.transform([gender])[0]
        except:
            return jsonify({"error": f"Invalid gender value. Must be one of: {list(label_encoder.classes_)}"}), 400

        # Prepare input
        student_input = np.array([[
            math_score,
            science_score,
            project_score,
            gender_encoded,
            socioeconomic_index
        ]])

        # Make prediction
        prediction = model.predict(student_input)[0]
        proba = model.predict_proba(student_input)[0][1]

        # Get adaptive recommendations
        recommendation = adaptive_questioning(proba)

        return jsonify({
            "stem_potential": int(prediction),
            "confidence": float(proba),
            "recommendation": recommendation
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.get_json()
        students = data.get('students', [])

        if not students:
            return jsonify({"error": "No students provided"}), 400

        results = []
        for student in students:
            math_score = student.get('math_score')
            science_score = student.get('science_score')
            project_score = student.get('project_score')
            gender = student.get('gender')
            socioeconomic_index = student.get('socioeconomic_index')

            try:
                gender_encoded = label_encoder.transform([gender])[0]
                student_input = np.array([[
                    math_score,
                    science_score,
                    project_score,
                    gender_encoded,
                    socioeconomic_index
                ]])

                prediction = model.predict(student_input)[0]
                proba = model.predict_proba(student_input)[0][1]
                recommendation = adaptive_questioning(proba)

                results.append({
                    "student_id": student.get('id'),
                    "stem_potential": int(prediction),
                    "confidence": float(proba),
                    "recommendation": recommendation
                })
            except Exception as e:
                results.append({
                    "student_id": student.get('id'),
                    "error": str(e)
                })

        return jsonify({"predictions": results})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    load_model()
    app.run(host='0.0.0.0', port=5001, debug=True)
