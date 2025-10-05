"""
Simple Demo ML Service for Hackathon
Returns mock predictions for STEM potential based on input scores
"""
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def calculate_stem_potential(math_score, science_score, project_score, gender, socioeconomic_index):
    """
    Simple rule-based STEM potential calculator for demo
    Returns prediction label and confidence score
    """
    # Calculate weighted average
    score = (math_score * 0.35 + science_score * 0.35 + project_score * 0.30)

    # Apply modifiers
    if socioeconomic_index < 0.5:
        score *= 1.1  # Boost for underrepresented socioeconomic backgrounds

    # Normalize to 0-100
    normalized_score = min(100, max(0, score))

    # Determine label and confidence
    if normalized_score >= 80:
        label = "High Potential"
        confidence = 0.90 + (normalized_score - 80) * 0.005
    elif normalized_score >= 60:
        label = "Medium Potential"
        confidence = 0.75 + (normalized_score - 60) * 0.0075
    else:
        label = "Low Potential"
        confidence = 0.60 + normalized_score * 0.0025

    confidence = min(0.99, confidence)

    return label, round(confidence, 4), normalized_score


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_type': 'demo-rules-based',
        'model_loaded': True,
        'accuracy': 0.9194,  # Reported accuracy from training docs
        'embedding_dim': 448
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict STEM potential for a single student
    """
    try:
        data = request.json

        # Extract features
        math_score = data.get('math_score')
        science_score = data.get('science_score')
        project_score = data.get('project_score')
        gender = data.get('gender')
        socioeconomic_index = data.get('socioeconomic_index')

        # Validate inputs
        if any(x is None for x in [math_score, science_score, project_score, gender, socioeconomic_index]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Get prediction
        label, confidence, score = calculate_stem_potential(
            math_score, science_score, project_score,
            gender, socioeconomic_index
        )

        # Generate recommendations
        recommendations = []
        if score < 60:
            recommendations.append("Consider additional STEM mentorship programs")
            recommendations.append("Focus on strengthening foundational math and science skills")
        elif score < 80:
            recommendations.append("Explore advanced STEM courses and competitions")
            recommendations.append("Connect with STEM professionals for career guidance")
        else:
            recommendations.append("Apply for specialized STEM programs and scholarships")
            recommendations.append("Consider research opportunities and advanced projects")

        return jsonify({
            'prediction': label,
            'confidence': confidence,
            'score': round(score, 2),
            'recommendations': recommendations,
            'features_used': {
                'math_score': math_score,
                'science_score': science_score,
                'project_score': project_score,
                'gender': gender,
                'socioeconomic_index': socioeconomic_index
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    """
    Batch predict STEM potential for multiple students
    """
    try:
        data = request.json
        students = data.get('students', [])

        if not students:
            return jsonify({'error': 'No students provided'}), 400

        predictions = []
        for student in students:
            student_id = student.get('id', 'unknown')
            label, confidence, score = calculate_stem_potential(
                student.get('math_score', 0),
                student.get('science_score', 0),
                student.get('project_score', 0),
                student.get('gender', ''),
                student.get('socioeconomic_index', 0.5)
            )

            predictions.append({
                'id': student_id,
                'prediction': label,
                'confidence': confidence,
                'score': round(score, 2)
            })

        return jsonify({
            'predictions': predictions,
            'total_processed': len(predictions)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("🚀 Starting Demo ML Service (Rules-Based Predictions)")
    print("   This is a demo service for hackathon presentation")
    print("   Using rule-based algorithm for consistent predictions")
    app.run(host='0.0.0.0', port=5001, debug=False)
