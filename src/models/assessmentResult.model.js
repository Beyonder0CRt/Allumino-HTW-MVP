const mongoose = require('mongoose');

const assessmentResultSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    rawData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    responses: [
      {
        questionId: String,
        answer: mongoose.Schema.Types.Mixed,
        score: Number,
      },
    ],
    aiAnalysis: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

assessmentResultSchema.index({ userId: 1, assessmentId: 1 });

module.exports = mongoose.model('AssessmentResult', assessmentResultSchema);
