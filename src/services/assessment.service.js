const assessmentRepository = require('../repositories/assessment.repository');

class AssessmentService {
  async createAssessment(userId, assessmentData) {
    const { rawData, ...metadata } = assessmentData;

    // Create assessment metadata in PostgreSQL
    const assessment = await assessmentRepository.create({
      userId,
      ...metadata,
    });

    // Save raw assessment data in MongoDB if provided
    if (rawData) {
      await assessmentRepository.saveResult(assessment.id, userId, rawData);
    }

    return assessment;
  }

  async getAssessment(id) {
    const assessment = await assessmentRepository.findById(id);

    if (!assessment) {
      return null;
    }

    // Load raw results from MongoDB
    const result = await assessmentRepository.getResult(id);

    return {
      ...assessment,
      result,
    };
  }

  async getUserAssessments(userId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    return assessmentRepository.findByUserId(userId, {
      skip,
      take: limit,
    });
  }

  async updateAssessment(id, userId, data) {
    const assessment = await assessmentRepository.findById(id);

    if (!assessment || assessment.userId !== userId) {
      throw new Error('Assessment not found or unauthorized');
    }

    return assessmentRepository.update(id, data);
  }
}

module.exports = new AssessmentService();
