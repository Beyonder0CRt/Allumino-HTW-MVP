const pathwayRepository = require('../repositories/pathway.repository');
const contentRepository = require('../repositories/content.repository');

class PathwayService {
  async createPathway(userId, pathwayData) {
    return pathwayRepository.create({
      userId,
      ...pathwayData,
    });
  }

  async getPathway(id) {
    const pathway = await pathwayRepository.findById(id);

    if (!pathway) {
      return null;
    }

    // Load learning content if referenced in metadata
    if (pathway.metadata?.contentIds) {
      const contents = await Promise.all(
        pathway.metadata.contentIds.map((contentId) =>
          contentRepository.findById(contentId)
        )
      );
      pathway.contents = contents.filter(Boolean);
    }

    return pathway;
  }

  async getUserPathways(userId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const pathways = await pathwayRepository.findByUserId(userId, {
      skip,
      take: limit,
    });

    const total = await pathwayRepository.count(userId);

    return {
      data: pathways,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updatePathway(id, userId, data) {
    const pathway = await pathwayRepository.findById(id);

    if (!pathway || pathway.userId !== userId) {
      throw new Error('Pathway not found or unauthorized');
    }

    return pathwayRepository.update(id, data);
  }

  async deletePathway(id, userId) {
    const pathway = await pathwayRepository.findById(id);

    if (!pathway || pathway.userId !== userId) {
      throw new Error('Pathway not found or unauthorized');
    }

    return pathwayRepository.delete(id);
  }

  async listPublicPathways(options = {}) {
    const { page = 1, limit = 20, search } = options;
    const skip = (page - 1) * limit;

    return pathwayRepository.listPublic({ skip, take: limit, search });
  }
}

module.exports = new PathwayService();
