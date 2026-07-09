import React, { useState, useEffect } from 'react'
import axios from 'axios'

function EarningsPanel() {
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    adRevenue: 0,
    purchaseRevenue: 0,
    referralRevenue: 0,
    subscriptionRevenue: 0
  })
  const [topEarners, setTopEarners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEarnings()
    fetchTopEarners()
  }, [])

  const fetchEarnings = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const response = await axios.get(`/api/monetization/earnings/${userId}`)
      setEarnings(response.data)
    } catch (error) {
      console.error('Error fetching earnings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTopEarners = async () => {
    try {
      const response = await axios.get('/api/referrals/top-earners')
      setTopEarners(response.data)
    } catch (error) {
      console.error('Error fetching top earners:', error)
    }
  }

  if (loading) return <div className="text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">💵 Earnings Dashboard</h1>

        {/* Main Earnings Card */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg p-8 mb-8 shadow-xl">
          <p className="text-white/80 text-lg">Total Earnings</p>
          <p className="text-6xl font-bold text-white">${earnings.totalEarnings.toFixed(2)}</p>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-green-500">
            <p className="text-gray-400 text-sm mb-2">Ad Revenue</p>
            <p className="text-2xl font-bold text-green-400">${earnings.adRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-blue-500">
            <p className="text-gray-400 text-sm mb-2">In-App Purchases</p>
            <p className="text-2xl font-bold text-blue-400">${earnings.purchaseRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-purple-500">
            <p className="text-gray-400 text-sm mb-2">Referrals</p>
            <p className="text-2xl font-bold text-purple-400">${earnings.referralRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-pink-500">
            <p className="text-gray-400 text-sm mb-2">Subscriptions</p>
            <p className="text-2xl font-bold text-pink-400">${earnings.subscriptionRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-cyan-500">
            <p className="text-gray-400 text-sm mb-2">Pending</p>
            <p className="text-2xl font-bold text-cyan-400">$0.00</p>
          </div>
        </div>

        {/* Top Earners */}
        <div className="bg-gray-900 rounded-lg p-8 border border-purple-500">
          <h2 className="text-2xl font-bold text-white mb-6">🏆 Top Earners</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">Rank</th>
                  <th className="text-left py-3 px-4">Username</th>
                  <th className="text-right py-3 px-4">Total Earnings</th>
                  <th className="text-right py-3 px-4">Referrals</th>
                </tr>
              </thead>
              <tbody>
                {topEarners.map((earner, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <span className="text-xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">{earner.username}</td>
                    <td className="text-right py-3 px-4 text-green-400">${earner.totalEarnings.toFixed(2)}</td>
                    <td className="text-right py-3 px-4">{earner.referrals?.count || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdrawal Button */}
        <div className="mt-8 flex justify-center">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition">
            💰 Withdraw Earnings
          </button>
        </div>
      </div>
    </div>
  )
}

export default EarningsPanel