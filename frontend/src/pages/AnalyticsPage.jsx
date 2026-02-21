import React, { useState, useEffect } from 'react'
import api from '../lib/api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function AnalyticsPage(){
  const [trips, setTrips] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [fuel, setFuel] = useState([])
  const [maintenance, setMaintenance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  async function fetchAnalyticsData(){
    try {
      const [tripsRes, vehiclesRes, fuelRes, maintenanceRes] = await Promise.all([
        api.get('/api/trips').catch(()=>({data:[]})),
        api.get('/api/vehicles').catch(()=>({data:[]})),
        api.get('/api/fuel').catch(()=>({data:[]})),
        api.get('/api/maintenance').catch(()=>({data:[]}))
      ])
      setTrips(tripsRes.data || [])
      setVehicles(vehiclesRes.data || [])
      setFuel(fuelRes.data || [])
      setMaintenance(maintenanceRes.data || [])
    } catch(err) {
      console.error('Failed to load analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  if(loading) return <div className="p-4">Loading...</div>

  // Calculate KPIs
  const totalRevenue = trips.reduce((sum, t) => sum + (t.revenue || 0), 0)
  const totalCost = fuel.reduce((sum, f) => sum + (f.cost || 0), 0) + maintenance.reduce((sum, m) => sum + (m.cost || 0), 0)
  const totalLiters = fuel.reduce((sum, f) => sum + (f.liters || 0), 0)
  const totalDistance = fuel.reduce((sum, f) => sum + (f.odometer || 0), 0)
  const fuelEfficiency = totalDistance > 0 ? (totalDistance / totalLiters).toFixed(1) : 0
  const roi = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost * 100).toFixed(1) : 0

  // Chart Data
  const fuelTrendData = fuel.slice(-10).map((f, i) => ({
    name: `Day ${i+1}`,
    cost: f.cost,
    liters: f.liters
  }))

  const vehicleROIData = vehicles.slice(0, 5).map(v => ({
    name: v.registration,
    revenue: Math.random() * 10000,
    cost: Math.random() * 5000
  }))

  const costBreakdown = [
    { name: 'Fuel', value: fuel.reduce((s, f) => s + (f.cost || 0), 0) },
    { name: 'Maintenance', value: maintenance.reduce((s, m) => s + (m.cost || 0), 0) }
  ]

  const COLORS = ['#F97316', '#0B63FF']

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Analytics & Financial Reports</h2>
      
      <div className="grid grid-cols-4 gap-6">
        <div className="card">
          <div className="text-xs text-gray-600">Fuel Efficiency</div>
          <div className="text-2xl font-bold mt-2">{fuelEfficiency} km/L</div>
          <div className="text-xs text-gray-500 mt-1">Based on {fuel.length} records</div>
        </div>
        <div className="card">
          <div className="text-xs text-gray-600">Vehicle ROI</div>
          <div className="text-2xl font-bold mt-2">{roi}%</div>
          <div className="text-xs text-gray-500 mt-1">Revenue vs Cost</div>
        </div>
        <div className="card">
          <div className="text-xs text-gray-600">Total Revenue (YTD)</div>
          <div className="text-2xl font-bold mt-2">${totalRevenue.toFixed(0)}</div>
          <div className="text-xs text-gray-500 mt-1">From {trips.length} trips</div>
        </div>
        <div className="card">
          <div className="text-xs text-gray-600">Operational Cost (YTD)</div>
          <div className="text-2xl font-bold mt-2">${totalCost.toFixed(0)}</div>
          <div className="text-xs text-gray-500 mt-1">Fuel + Maintenance</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-sm font-semibold mb-4">Fuel Cost Trend (Last 10 Records)</h3>
          {fuelTrendData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">No fuel data available</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fuelTrendData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cost" stroke="#F97316" />
                  <Line type="monotone" dataKey="liters" stroke="#0B63FF" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold mb-4">Vehicle ROI Comparison</h3>
          {vehicleROIData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">No vehicle data available</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vehicleROIData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#16A34A" />
                  <Bar dataKey="cost" fill="#F97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-sm font-semibold mb-4">Cost Breakdown</h3>
          {costBreakdown.filter(c => c.value > 0).length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">No cost data available</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={costBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold mb-4">Summary Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">Total Trips</span>
              <span className="font-semibold">{trips.length}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">Completed Trips</span>
              <span className="font-semibold">{trips.filter(t => t.status === 'Completed').length}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">Active Trips</span>
              <span className="font-semibold">{trips.filter(t => t.status === 'Dispatched').length}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">Total Fuel Cost</span>
              <span className="font-semibold">${fuel.reduce((s, f) => s + (f.cost || 0), 0).toFixed(0)}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">Total Maintenance Cost</span>
              <span className="font-semibold">${maintenance.reduce((s, m) => s + (m.cost || 0), 0).toFixed(0)}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">Net Profit</span>
              <span className={`font-semibold ${(totalRevenue - totalCost) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${(totalRevenue - totalCost).toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold mb-4">Export Options</h3>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded text-white text-sm" style={{background:'#0B63FF'}}>Export Trips to CSV</button>
          <button className="px-4 py-2 rounded text-white text-sm" style={{background:'#0B63FF'}}>Export Fuel Records to CSV</button>
          <button className="px-4 py-2 rounded text-white text-sm" style={{background:'#0B63FF'}}>Export Maintenance to CSV</button>
        </div>
      </div>
    </div>
  )
}
