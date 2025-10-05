from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
from multimodal_model import MultiModalTalentModel

app = Flask(__name__)
CORS(app)

# Load model and encoder
MULTIMODAL_MODEL_PATH = "multimodal_stem_model.pkl"
ENCODER_PATH = "label_encoder.pkl"
CONFIG_PATH = "model_config.pkl"

multimodal_model = None
label_encoder = None
model_config = None


def load_model():
    global multimodal_model, label_encoder, model_config
    if os.path.exists(MULTIMODAL_MODEL_PATH) and os.path.exists(ENCODER_PATH):
        # Load multimodal model
        multimodal_model = MultiModalTalentModel()
        xgb_model = joblib.load(MULTIMODAL_MODEL_PATH)
        multimodal_model.set_xgb_model(xgb_model)

        # Load encoder and config
        label_encoder = joblib.load(ENCODER_PATH)
        model_config = joblib.load(CONFIG_PATH) if os.path.exists(CONFIG_PATH) else {}

        print("✅ Multimodal model loaded successfully!")
        print(f"   Model accuracy: {model_config.get('accuracy', 'N/A')}")
        print(f"   Fused embedding dimension: {model_config.get('fused_dim', 'N/A')}")
    else:
        print("❌ Model not found. Please train the model first.")


def generate_text_description(math_score, science_score, project_score):
    """Generate a text description based on student scores"""
    desc_parts = []

    # Math ability
    if math_score > 80:
        desc_parts.append("strong mathematical skills")
    elif math_score > 60:
        desc_parts.append("moderate math proficiency")
    else:
        desc_parts.append("developing math abilities")

    # Science interest
    if science_score > 80:
        desc_parts.append("excellent scientific understanding")
    elif science_score > 60:
        desc_parts.append("good science foundation")
    else:
        desc_parts.append("emerging science interest")

    # Project work
    if project_score > 80:
        desc_parts.append("outstanding project execution")
    elif project_score > 60:
        desc_parts.append("solid hands-on experience")
    else:
        desc_parts.append("growing practical skills")

    return f"Student with {', '.join(desc_parts)}"


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
        "model_loaded": multimodal_model is not None,
        "model_type": "multimodal",
        "accuracy": model_config.get('accuracy') if model_config else None,
        "embedding_dim": model_config.get('fused_dim') if model_config else None
    })


@app.route('/predict', methods=['POST'])
def predict():
    if multimodal_model is None:
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

        # Prepare numeric input
        numeric_input = np.array([[
            math_score,
            science_score,
            project_score,
            gender_encoded,
            socioeconomic_index
        ]])

        # Generate text description
        text_input = [generate_text_description(math_score, science_score, project_score)]

        # Make prediction using multimodal model
        predictions, probabilities = multimodal_model.predict(text_input, numeric_input)

        prediction = int(predictions[0])
        proba = float(probabilities[0][1])

        # Get adaptive recommendations
        recommendation = adaptive_questioning(proba)

        return jsonify({
            "stem_potential": prediction,
            "confidence": proba,
            "recommendation": recommendation,
            "model_type": "multimodal"
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    if multimodal_model is None:
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
                numeric_input = np.array([[
                    math_score,
                    science_score,
                    project_score,
                    gender_encoded,
                    socioeconomic_index
                ]])

                text_input = [generate_text_description(math_score, science_score, project_score)]

                predictions, probabilities = multimodal_model.predict(text_input, numeric_input)
                prediction = int(predictions[0])
                proba = float(probabilities[0][1])
                recommendation = adaptive_questioning(proba)

                results.append({
                    "student_id": student.get('id'),
                    "stem_potential": prediction,
                    "confidence": proba,
                    "recommendation": recommendation
                })
            except Exception as e:
                results.append({
                    "student_id": student.get('id'),
                    "error": str(e)
                })

        return jsonify({"predictions": results, "model_type": "multimodal"})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    load_model()
    app.run(host='0.0.0.0', port=5001, debug=True)
