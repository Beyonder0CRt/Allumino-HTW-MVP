const userRepository = require('../repositories/user.repository');
const ActivityLog = require('../models/activityLog.model');

class UserService {
  async createOrUpdateUser(userData) {
    const user = await userRepository.createOrUpdate(userData.auth0Id, userData);

    // Create MongoDB profile if doesn't exist
    let profile = await userRepository.getProfile(user.id);
    if (!profile) {
      profile = await userRepository.createProfile(user.id, {});
    }

    // Log activity
    await ActivityLog.create({
      userId: user.id,
      eventType: 'user.login',
      payload: { auth0Id: user.auth0Id },
    });

    return user;
  }

  async getUserById(id) {
    return userRepository.findById(id);
  }

  async getUserProfile(userId) {
    const user = await userRepository.findById(userId);
    const profile = await userRepository.getProfile(userId);

    return {
      ...user,
      profile,
    };
  }

  async updateUserProfile(userId, profileData) {
    // Update allowed fields only
    const allowedFields = ['preferences', 'customFields'];
    const filteredData = {};

    for (const key of allowedFields) {
      if (profileData[key]) {
        filteredData[key] = profileData[key];
      }
    }

    return userRepository.updateProfile(userId, filteredData);
  }
}

module.exports = new UserService();
