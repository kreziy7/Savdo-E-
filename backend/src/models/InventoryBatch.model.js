const mongoose = require('mongoose');

const inventoryBatchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: { type: String, required: true },
    quantity: {
      type: Number,
      required: true,
      min: [0.001, 'Quantity must be positive'],
    },
    unit: { type: String, default: 'pcs' },
    buyPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalCost: { type: Number },
    note: { type: String, default: '' },
    syncId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

inventoryBatchSchema.pre('save', function () {
  this.totalCost = this.quantity * this.buyPrice;
});

inventoryBatchSchema.index({ user: 1, createdAt: -1 });
inventoryBatchSchema.index({ product: 1 });

module.exports = mongoose.model('InventoryBatch', inventoryBatchSchema);
