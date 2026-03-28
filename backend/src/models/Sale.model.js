const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    // Denormalized for offline support — product may be deleted later
    productName: { type: String, required: true },
    productId: { type: String }, // local mobile ID for offline sync
    quantity: {
      type: Number,
      required: true,
      min: [0.001, 'Quantity must be positive'],
    },
    unit: { type: String, default: 'pcs' },
    sellPrice: { type: Number, required: true, min: 0 },
    buyPrice: { type: Number, required: true, min: 0 },
    totalRevenue: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    profit: { type: Number, required: true },
    note: { type: String, default: '' },
    // Offline sync fields
    syncId: { type: String, unique: true, sparse: true }, // local UUID from mobile
    isFromOffline: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Auto-compute totals before save
saleSchema.pre('save', function () {
  this.totalRevenue = this.quantity * this.sellPrice;
  this.totalCost = this.quantity * this.buyPrice;
  this.profit = this.totalRevenue - this.totalCost;
});

saleSchema.index({ user: 1, createdAt: -1 });
saleSchema.index({ createdAt: -1 });
saleSchema.index({ syncId: 1 }, { sparse: true });

module.exports = mongoose.model('Sale', saleSchema);
