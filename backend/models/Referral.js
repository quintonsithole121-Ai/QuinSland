const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema({
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referredUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referralCode: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'converted'],
    default: 'pending'
  },
  referralBonus: {
    type: Number,
    default: 5 // $5 per referral
  },
  earningsFromReferral: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  convertedAt: Date
});

module.exports = mongoose.model('Referral', ReferralSchema);