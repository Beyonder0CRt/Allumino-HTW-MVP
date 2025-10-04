const { prisma } = require('../config/database');
const AssessmentResult = require('../models/assessmentResult.model');

class AssessmentRepository {
  async findById(id) {
    return prisma.assessment.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, displayName: true },
        },
        pathway: {
          select: { id: true, title: true },
        },
      },
    });
  }

  async findByUserId(userId, options = {}) {
    const { skip = 0, take = 20, orderBy = { createdAt: 'desc' } } = options;

    return prisma.assessment.findMany({
      where: { userId },
      skip,
      take,
      orderBy,
    });
  }

  async create(data) {
    return prisma.assessment.create({
      data,
    });
  }

  async update(id, data) {
    return prisma.assessment.update({
      where: { id },
      data,
    });
  }

  async saveResult(assessmentId, userId, resultData) {
    return AssessmentResult.create({
      assessmentId,
      userId,
      rawData: resultData,
    });
  }

  async getResult(assessmentId) {
    return AssessmentResult.findOne({ assessmentId }).lean();
  }
}

module.exports = new AssessmentRepository();
