import React, { useState, useEffect } from 'react'
import axios from 'axios'

function ReferralProgram() {
  const [referralCode, setReferralCode] = useState('')
  const [referralLink, setReferralLink] = useState('')
  const [earnings, setEarnings] = useState(0)
  const [referralCount, setReferralCount] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const response = await axios.get(`/api/referrals/referral/${userId}`)
      
      setReferralCode(response.data.referralCode)
      setReferralLink(response.data.referralLink)
      setReferralCount(response.data.stats.totalReferrals)
      setEarnings(response.data.stats.totalEarnings)
    } catch (error) {
      console.error('Error fetching referral data:', error)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">💰 Referral Program</h1>

        {/* Earnings Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-8 mb-8 shadow-xl">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-white/80 mb-2">Total Earnings</p>
              <p className="text-5xl font-bold text-white">${earnings.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-white/80 mb-2">Friends Referred</p>
              <p className="text-5xl font-bold text-white">{referralCount}</p>
            </div>
          </div>
        </div>

        {/* Referral Link Card */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8 border border-purple-500">
          <h2 className="text-2xl font-bold text-white mb-4">Your Referral Link</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 bg-gray-800 text-white px-4 py-3 rounded border border-gray-700"
            />
            <button
              onClick={copyToClipboard}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded font-semibold transition"
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-3">Share this link with friends and earn $5 per referral!</p>
        </div>

        {/* How It Works */}
        <div className="bg-gray-900 rounded-lg p-8 border border-purple-500">
          <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-3xl">🔗</div>
              <div>
                <h3 className="text-white font-semibold mb-1">Share Your Link</h3>
                <p className="text-gray-400">Send your referral link to friends via social media, email, or chat</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">📱</div>
              <div>
                <h3 className="text-white font-semibold mb-1">They Install the Game</h3>
                <p className="text-gray-400">Friends install QuinSland using your referral link</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">💳</div>
              <div>
                <h3 className="text-white font-semibold mb-1">You Earn Money</h3>
                <p className="text-gray-400">Get $5 for each friend who installs + 30% commission on their purchases</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="mt-8 flex gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold">
            Share on Facebook
          </button>
          <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded font-semibold">
            Share on Twitter
          </button>
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded font-semibold">
            Share on Instagram
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReferralProgram
