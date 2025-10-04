const opportunityService = require('../services/opportunity.service');

class OpportunityController {
  async listOpportunities(req, res, next) {
    try {
      const { page, limit, tags, location, search } = req.query;

      const result = await opportunityService.listOpportunities({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        tags: tags ? tags.split(',') : undefined,
        location,
        search,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getOpportunity(req, res, next) {
    try {
      const { id } = req.params;
      const opportunity = await opportunityService.getOpportunity(id);

      if (!opportunity) {
        return res.status(404).json({ error: 'Opportunity not found' });
      }

      res.json(opportunity);
    } catch (error) {
      next(error);
    }
  }

  async createOpportunity(req, res, next) {
    try {
      const createdById = req.user.userId;
      const opportunity = await opportunityService.createOpportunity(createdById, req.body);

      res.status(201).json(opportunity);
    } catch (error) {
      next(error);
    }
  }

  async updateOpportunity(req, res, next) {
    try {
      const { id } = req.params;
      const opportunity = await opportunityService.updateOpportunity(id, req.body);

      res.json(opportunity);
    } catch (error) {
      next(error);
    }
  }

  async deleteOpportunity(req, res, next) {
    try {
      const { id } = req.params;
      await opportunityService.deleteOpportunity(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OpportunityController();
