const pathwayService = require('../services/pathway.service');

class PathwayController {
  async getPathways(req, res, next) {
    try {
      const userId = req.user.userId;
      const { page, limit } = req.query;

      const result = await pathwayService.getUserPathways(userId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPathway(req, res, next) {
    try {
      const { id } = req.params;
      const pathway = await pathwayService.getPathway(id);

      if (!pathway) {
        return res.status(404).json({ error: 'Pathway not found' });
      }

      res.json(pathway);
    } catch (error) {
      next(error);
    }
  }

  async createPathway(req, res, next) {
    try {
      const userId = req.user.userId;
      const pathway = await pathwayService.createPathway(userId, req.body);

      res.status(201).json(pathway);
    } catch (error) {
      next(error);
    }
  }

  async updatePathway(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const pathway = await pathwayService.updatePathway(id, userId, req.body);

      res.json(pathway);
    } catch (error) {
      next(error);
    }
  }

  async deletePathway(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      await pathwayService.deletePathway(id, userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async listPublicPathways(req, res, next) {
    try {
      const { page, limit, search } = req.query;

      const pathways = await pathwayService.listPublicPathways({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        search,
      });

      res.json(pathways);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PathwayController();
