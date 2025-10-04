const LearningContent = require('../models/learningContent.model');

class ContentRepository {
  async findById(id) {
    return LearningContent.findById(id).lean();
  }

  async list(options = {}) {
    const { skip = 0, limit = 20, tags, createdBy, search } = options;

    const filter = {};

    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    if (createdBy) {
      filter.createdBy = createdBy;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    return LearningContent.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
  }

  async create(data) {
    return LearningContent.create(data);
  }

  async update(id, data) {
    return LearningContent.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return LearningContent.findByIdAndDelete(id);
  }
}

module.exports = new ContentRepository();
