const mongoose = require('mongoose');

const MonetizationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  referrals: {
    count: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 }
  },
  inAppPurchases: {
    totalSpent: { type: Number, default: 0 },
    itemsBought: [{ itemId: String, price: Number, boughtAt: Date }]
  },
  adRevenue: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 }
  },
  premiumSubscription: {
    isActive: { type: Boolean, default: false },
    tier: { type: String, enum: ['free', 'basic', 'pro', 'elite'], default: 'free' },
    startDate: Date,
    endDate: Date,
    monthlyFee: { type: Number, default: 0 }
  },
  withdrawals: [{
    amount: Number,
    method: String, // PayPal, Bank, Crypto
    status: { type: String, enum: ['pending', 'completed', 'failed'] },
    requestedAt: Date,
    completedAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Monetization', MonetizationSchema);