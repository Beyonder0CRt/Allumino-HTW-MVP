const { prisma } = require('../config/database');

class PathwayRepository {
  async findById(id) {
    return prisma.pathway.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, displayName: true },
        },
      },
    });
  }

  async findByUserId(userId, options = {}) {
    const { skip = 0, take = 20, orderBy = { createdAt: 'desc' } } = options;

    return prisma.pathway.findMany({
      where: { userId },
      skip,
      take,
      orderBy,
    });
  }

  async create(data) {
    return prisma.pathway.create({
      data,
    });
  }

  async update(id, data) {
    return prisma.pathway.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.pathway.delete({
      where: { id },
    });
  }

  async count(userId) {
    return prisma.pathway.count({
      where: { userId },
    });
  }

  async listPublic(options = {}) {
    const { skip = 0, take = 20, search } = options;

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return prisma.pathway.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
      },
    });
  }
}

module.exports = new PathwayRepository();
