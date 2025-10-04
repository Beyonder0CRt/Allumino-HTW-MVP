const { checkDatabaseHealth } = require('../config/database');

class HealthController {
  async getHealth(req, res) {
    try {
      const dbHealth = await checkDatabaseHealth();
      const isHealthy = dbHealth.postgres && dbHealth.mongodb;

      res.status(isHealthy ? 200 : 503).json({
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        databases: dbHealth,
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        error: error.message,
      });
    }
  }
}

module.exports = new HealthController();
