const express = require('express');
const router = express.Router();
const Referral = require('../models/Referral');
const User = require('../models/User');
const Monetization = require('../models/Monetization');
const crypto = require('crypto');

// Generate referral code
function generateReferralCode() {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
}

// Get user's referral code and stats
router.get('/referral/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get or create referral record
    let referral = await Referral.findOne({ referrerId: userId });
    
    if (!referral) {
      const code = generateReferralCode();
      referral = new Referral({
        referrerId: userId,
        referralCode: code,
        referredUserId: null
      });
      await referral.save();
    }

    // Get referral stats
    const stats = await Referral.aggregate([
      { $match: { referrerId: userId } },
      { $group: {
        _id: null,
        totalReferrals: { $sum: 1 },
        totalEarnings: { $sum: '$earningsFromReferral' }
      }}
    ]);

    res.json({
      referralCode: referral.referralCode,
      referralLink: `https://quinland.io?ref=${referral.referralCode}`,
      stats: stats[0] || { totalReferrals: 0, totalEarnings: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle referral signup
router.post('/referral/signup', async (req, res) => {
  try {
    const { referralCode, newUserId } = req.body;

    // Find referrer
    const referral = await Referral.findOne({ referralCode });
    
    if (!referral) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    // Update referral
    referral.referredUserId = newUserId;
    referral.status = 'converted';
    referral.convertedAt = new Date();
    referral.earningsFromReferral = referral.referralBonus;
    await referral.save();

    // Update referrer's earnings
    await Monetization.findOneAndUpdate(
      { userId: referral.referrerId },
      {
        $inc: {
          totalEarnings: referral.referralBonus,
          'referrals.count': 1,
          'referrals.earnings': referral.referralBonus
        }
      },
      { upsert: true }
    );

    res.json({ success: true, bonusAmount: referral.referralBonus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard by earnings
router.get('/top-earners', async (req, res) => {
  try {
    const topEarners = await Monetization.aggregate([
      { $sort: { totalEarnings: -1 } },
      { $limit: 50 },
      { $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }},
      { $project: {
        username: { $arrayElemAt: ['$user.username', 0] },
        totalEarnings: 1,
        referrals: 1
      }}
    ]);

    res.json(topEarners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;