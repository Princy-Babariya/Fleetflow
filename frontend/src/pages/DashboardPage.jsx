import React, {useEffect, useState} from 'react'
import KPI from '../ui/KPI'
import StatusCard from '../ui/StatusCard'
import api from '../lib/api'
import { getUser } from '../lib/auth'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

export default function DashboardPage(){
  const [overview, setOverview] = useState(null)
  const [trips, setTrips] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [maintenance, setMaintenance] = useState([])
  const [fuel, setFuel] = useState([])
  const user = getUser()

  useEffect(()=>{
    fetchDashboardData()
  },[])

  async function fetchDashboardData(){
    try {
      const [overviewRes, tripsRes, vehiclesRes, driversRes, maintenanceRes, fuelRes] = await Promise.all([
        api.get('/api/analytics/overview').catch(()=>({data:{}})),
        api.get('/api/trips').catch(()=>({data:[]})),
        api.get('/api/vehicles').catch(()=>({data:[]})),
        api.get('/api/drivers').catch(()=>({data:[]})),
        api.get('/api/maintenance').catch(()=>({data:[]})),
        api.get('/api/fuel').catch(()=>({data:[]}))
      ])
      setOverview(overviewRes.data)
      setTrips(tripsRes.data)
      setVehicles(vehiclesRes.data)
      setDrivers(driversRes.data)
      setMaintenance(maintenanceRes.data)
      setFuel(fuelRes.data)
    } catch(err){
      console.error('Failed to load dashboard data:', err)
    }
  }

  if(!user) return <div className="text-center p-8">Loading...</div>

  // Role-based dashboard views
  const isAdmin = user.role === 'admin'
  const isDispatcher = user.role === 'dispatcher'
  const isDriver = user.role === 'driver'
  const isManager = user.role === 'manager'

  const activeVehicles = vehicles.filter(v => v.status === 'Available').length
  const onTripVehicles = vehicles.filter(v => v.status === 'OnTrip').length
  const activeTrips = trips.filter(t => t.status === 'Dispatched').length
  const completedTrips = trips.filter(t => t.status === 'Completed').length
  const totalFuelCost = fuel.reduce((sum, f) => sum + (f.cost || 0), 0)
  const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + (m.cost || 0), 0)

  // Charts data
  const pieData = [
    { name: 'Available', value: activeVehicles },
    { name: 'On Trip', value: onTripVehicles },
    { name: 'Maintenance', value: vehicles.filter(v => v.status === 'Maintenance').length }
  ]

  const barData = trips.length > 0 ? trips.slice(-7).map((t, i) => ({ 
    name: `Trip ${i+1}`, 
    revenue: t.revenue || 0,
    cost: t.cargoWeight ? (t.cargoWeight * 0.5) : 0
  })) : []

  return (
    <div className="space-y-6">
      {/* ADMIN & MANAGER: Full Fleet Overview */}
      {(isAdmin || isManager) && (
        <>
          <h1 className="text-2xl font-bold">Fleet Management Dashboard</h1>
          <div className="grid grid-cols-4 gap-6">
            <KPI title="Total Vehicles" value={vehicles.length} color="accentGreen" />
            <StatusCard title="Active Fleet" value={activeVehicles} color="accentGreen" />
            <KPI title="On Trip" value={onTripVehicles} color="maintenanceOrange" />
            <StatusCard title="Maintenance Due" value={maintenance.filter(m => new Date(m.nextDueDate) < new Date()).length} color="alertRed" />
          </div>

          <div className="grid grid-cols-4 gap-6">
            <KPI title="Active Trips" value={activeTrips} color="accentGreen" />
            <StatusCard title="Completed Today" value={completedTrips} color="accentGreen" />
            <KPI title="Fuel Cost (YTD)" value={`$${totalFuelCost.toFixed(0)}`} color="maintenanceOrange" />
            <StatusCard title="Maintenance Cost (YTD)" value={`$${totalMaintenanceCost.toFixed(0)}`} color="alertRed" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="card">
              <h3 className="text-sm font-semibold mb-4">Fleet Status</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index===0? '#16A34A' : index===1? '#F97316' : '#0B63FF'} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-2 card">
              <h3 className="text-sm font-semibold mb-4">Trip Revenue vs Cost</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#16A34A" />
                    <Bar dataKey="cost" fill="#F97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* DISPATCHER: Operations Dashboard */}
      {isDispatcher && (
        <>
          <h1 className="text-2xl font-bold">Dispatch Operations</h1>
          <div className="grid grid-cols-4 gap-6">
            <StatusCard title="Available Vehicles" value={activeVehicles} color="accentGreen" />
            <KPI title="Active Trips" value={activeTrips} color="maintenanceOrange" />
            <StatusCard title="Ready Drivers" value={drivers.filter(d => d.status === 'OnDuty').length} color="accentGreen" />
            <KPI title="Pending Trips" value={trips.filter(t => t.status === 'Pending').length} color="alertRed" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-sm font-semibold mb-4">Available Vehicles</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {vehicles.filter(v => v.status === 'Available').length === 0 ? (
                  <div className="text-gray-400 text-sm">No available vehicles</div>
                ) : (
                  vehicles.filter(v => v.status === 'Available').map(v => (
                    <div key={v._id} className="p-2 border rounded text-sm">
                      <div className="font-medium">{v.registration} • {v.type}</div>
                      <div className="text-xs text-gray-500">Capacity: {v.maxCapacity}kg | Odo: {v.odometer}km</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="text-sm font-semibold mb-4">Recent Trips</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {trips.length === 0 ? (
                  <div className="text-gray-400 text-sm">No trips</div>
                ) : (
                  trips.slice(0, 10).map(t => (
                    <div key={t._id} className="p-2 border rounded text-sm">
                      <div className="font-medium">{t.origin} → {t.destination}</div>
                      <div className="text-xs text-gray-500">Status: {t.status} | Vehicle: {t.vehicleId?.registration}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* DRIVER: Personal Dashboard */}
      {isDriver && (
        <>
          <h1 className="text-2xl font-bold">My Trips</h1>
          <div className="grid grid-cols-3 gap-6">
            <StatusCard title="My Assigned Trips" value={trips.filter(t => t.driverId?.name === user.name).length} color="accentGreen" />
            <KPI title="Completed This Month" value={completedTrips} color="accentGreen" />
            <StatusCard title="Active Now" value={activeTrips} color="maintenanceOrange" />
          </div>

          <div className="card">
            <h3 className="text-sm font-semibold mb-4">My Active Trips</h3>
            <div className="space-y-3">
              {trips.filter(t => t.driverId?.name === user.name && t.status !== 'Completed').length === 0 ? (
                <div className="text-gray-400">No active trips assigned</div>
              ) : (
                trips.filter(t => t.driverId?.name === user.name && t.status !== 'Completed').map(t => (
                  <div key={t._id} className="p-3 border rounded">
                    <div className="font-medium">{t.origin} → {t.destination}</div>
                    <div className="text-xs text-gray-500 mt-1">Vehicle: {t.vehicleId?.registration} | Cargo: {t.cargoWeight}kg | Status: {t.status}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* ALL ROLES: Recent Activities */}
      <div className="card">
        <h3 className="text-sm font-semibold mb-4">Summary</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-xs text-gray-600">Total Vehicles</div>
            <div className="text-xl font-bold">{vehicles.length}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-xs text-gray-600">Total Drivers</div>
            <div className="text-xl font-bold">{drivers.length}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-xs text-gray-600">Total Trips</div>
            <div className="text-xl font-bold">{trips.length}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-xs text-gray-600">You are logged in as</div>
            <div className="text-lg font-bold capitalize">{user.role}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
