const mongoose = require('mongoose');

const syncQueueSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    operation: {
      type: String,
      enum: ['create', 'update', 'delete'],
      required: true,
    },
    entity: {
      type: String,
      enum: ['sale', 'product', 'inventory'],
      required: true,
    },
    entityId: {
      type: String, // local UUID from the mobile device
      required: true,
    },
    serverEntityId: {
      type: mongoose.Schema.Types.ObjectId, // set after successfully synced
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'synced', 'failed'],
      default: 'pending',
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5,
    },
    errorMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

syncQueueSchema.index({ user: 1, status: 1 });
syncQueueSchema.index({ status: 1, createdAt: 1 });

// Auto-expire synced items after 7 days
syncQueueSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 7 * 24 * 60 * 60, partialFilterExpression: { status: 'synced' } }
);

module.exports = mongoose.model('SyncQueue', syncQueueSchema);
