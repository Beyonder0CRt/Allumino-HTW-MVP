const assessmentService = require('../services/assessment.service');

class AssessmentController {
  async getAssessments(req, res, next) {
    try {
      const userId = req.user.userId;
      const { page, limit } = req.query;

      const assessments = await assessmentService.getUserAssessments(userId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
      });

      res.json(assessments);
    } catch (error) {
      next(error);
    }
  }

  async getAssessment(req, res, next) {
    try {
      const { id } = req.params;
      const assessment = await assessmentService.getAssessment(id);

      if (!assessment) {
        return res.status(404).json({ error: 'Assessment not found' });
      }

      res.json(assessment);
    } catch (error) {
      next(error);
    }
  }

  async createAssessment(req, res, next) {
    try {
      const userId = req.user.userId;
      const assessment = await assessmentService.createAssessment(userId, req.body);

      res.status(201).json(assessment);
    } catch (error) {
      next(error);
    }
  }

  async updateAssessment(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const assessment = await assessmentService.updateAssessment(id, userId, req.body);

      res.json(assessment);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AssessmentController();
