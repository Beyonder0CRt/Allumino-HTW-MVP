const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
      sessionId: String,
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ userId: 1, eventType: 1 });
activityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
