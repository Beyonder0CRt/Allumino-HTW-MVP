const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

class MLService {
  /**
   * Predict STEM potential for a single student
   * @param {Object} studentData - Student data
   * @returns {Promise<Object>} Prediction result
   */
  async predictSTEMPotential(studentData) {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
        math_score: studentData.mathScore,
        science_score: studentData.scienceScore,
        project_score: studentData.projectScore,
        gender: studentData.gender,
        socioeconomic_index: studentData.socioeconomicIndex,
      });

      return response.data;
    } catch (error) {
      console.error('Error calling ML service:', error.message);
      throw new Error(
        `ML service prediction failed: ${error.response?.data?.error || error.message}`
      );
    }
  }

  /**
   * Batch predict STEM potential for multiple students
   * @param {Array<Object>} students - Array of student data
   * @returns {Promise<Object>} Batch prediction results
   */
  async batchPredictSTEMPotential(students) {
    try {
      const formattedStudents = students.map((student) => ({
        id: student.id,
        math_score: student.mathScore,
        science_score: student.scienceScore,
        project_score: student.projectScore,
        gender: student.gender,
        socioeconomic_index: student.socioeconomicIndex,
      }));

      const response = await axios.post(`${ML_SERVICE_URL}/batch-predict`, {
        students: formattedStudents,
      });

      return response.data;
    } catch (error) {
      console.error('Error calling ML service for batch prediction:', error.message);
      throw new Error(
        `ML service batch prediction failed: ${error.response?.data?.error || error.message}`
      );
    }
  }

  /**
   * Check ML service health
   * @returns {Promise<Object>} Health status
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('ML service health check failed:', error.message);
      return {
        status: 'unhealthy',
        error: error.message,
      };
    }
  }
}

module.exports = new MLService();
