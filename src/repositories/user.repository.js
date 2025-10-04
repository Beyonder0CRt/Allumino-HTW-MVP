const { prisma } = require('../config/database');
const UserProfile = require('../models/userProfile.model');

class UserRepository {
  async findByAuth0Id(auth0Id) {
    return prisma.user.findUnique({
      where: { auth0Id },
    });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data) {
    return prisma.user.create({
      data,
    });
  }

  async update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async createOrUpdate(auth0Id, data) {
    return prisma.user.upsert({
      where: { auth0Id },
      update: data,
      create: { ...data, auth0Id },
    });
  }

  async getProfile(userId) {
    return UserProfile.findOne({ userId });
  }

  async createProfile(userId, data) {
    return UserProfile.create({ userId, ...data });
  }

  async updateProfile(userId, data) {
    return UserProfile.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true }
    );
  }
}

module.exports = new UserRepository();
