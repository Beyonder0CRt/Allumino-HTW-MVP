const mongoose = require('mongoose');

const learningContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    body: {
      type: String,
      required: true,
    },
    attachments: [
      {
        url: String,
        type: String,
        name: String,
      },
    ],
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    createdBy: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

learningContentSchema.index({ title: 'text', body: 'text' });

module.exports = mongoose.model('LearningContent', learningContentSchema);
