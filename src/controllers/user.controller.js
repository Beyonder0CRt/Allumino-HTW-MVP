const userService = require('../services/user.service');

class UserController {
  async getMe(req, res, next) {
    try {
      const userId = req.user.userId;
      const profile = await userService.getUserProfile(userId);

      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req, res, next) {
    try {
      const userId = req.user.userId;
      const updatedProfile = await userService.updateUserProfile(userId, req.body);

      res.json(updatedProfile);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
