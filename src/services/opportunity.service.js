const opportunityRepository = require('../repositories/opportunity.repository');

class OpportunityService {
  async createOpportunity(createdById, opportunityData) {
    return opportunityRepository.create({
      ...opportunityData,
      createdById,
    });
  }

  async getOpportunity(id) {
    return opportunityRepository.findById(id);
  }

  async listOpportunities(options = {}) {
    const { page = 1, limit = 20, tags, location, search } = options;
    const skip = (page - 1) * limit;

    const opportunities = await opportunityRepository.list({
      skip,
      take: limit,
      tags,
      location,
      search,
    });

    const total = await opportunityRepository.count();

    return {
      data: opportunities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateOpportunity(id, data) {
    return opportunityRepository.update(id, data);
  }

  async deleteOpportunity(id) {
    return opportunityRepository.delete(id);
  }
}

module.exports = new OpportunityService();
