const { prisma } = require('../config/database');

class OpportunityRepository {
  async findById(id) {
    return prisma.opportunity.findUnique({
      where: { id },
    });
  }

  async list(options = {}) {
    const { skip = 0, take = 20, tags, location, search } = options;

    const where = {};

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return prisma.opportunity.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data) {
    return prisma.opportunity.create({
      data,
    });
  }

  async update(id, data) {
    return prisma.opportunity.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.opportunity.delete({
      where: { id },
    });
  }

  async count(filters = {}) {
    return prisma.opportunity.count({
      where: filters,
    });
  }
}

module.exports = new OpportunityRepository();
