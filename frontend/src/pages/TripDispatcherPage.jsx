import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import { isRole } from '../lib/auth'

export default function TripDispatcherPage(){
  const [trips, setTrips] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ vehicleId:'', driverId:'', cargoWeight:0, revenue:0, startOdometer:0, schedule:'', status:'Pending' })

  const load = async ()=>{
    setLoading(true)
    try{
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        api.get('/api/trips'),
        api.get('/api/vehicles'),
        api.get('/api/drivers')
      ])
      setTrips(tripsRes.data)
      setVehicles(vehiclesRes.data)
      setDrivers(driversRes.data)
    }catch(err){
      console.error(err)
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  const canCreate = isRole('admin','dispatcher')
  const canEdit = isRole('admin','dispatcher')
  const canDelete = isRole('admin')

  const openNew = ()=>{ 
    setEditing(null)
    setForm({ vehicleId:'', driverId:'', cargoWeight:0, revenue:0, startOdometer:0, schedule:new Date().toISOString().split('T')[0], status:'Pending' })
    setShowModal(true)
  }

  const openEdit = (t)=>{ 
    setEditing(t)
    setForm({
      vehicleId: t.vehicleId?._id || t.vehicleId || '',
      driverId: t.driverId?._id || t.driverId || '',
      cargoWeight: t.cargoWeight || 0,
      revenue: t.revenue || 0,
      startOdometer: t.startOdometer || 0,
      schedule: t.schedule || '',
      status: t.status || 'Pending'
    })
    setShowModal(true)
  }

  const save = async (e)=>{
    e.preventDefault()
    if(!form.vehicleId || !form.driverId){
      alert('Please select vehicle and driver')
      return
    }
    try{
      if(editing){
        await api.put(`/api/trips/${editing._id}`, form)
      } else {
        await api.post('/api/trips', form)
      }
      setShowModal(false)
      load()
    }catch(err){
      alert(err.response?.data?.message || 'Save failed')
    }
  }

  const remove = async (id)=>{
    if(!confirm('Delete this trip?')) return
    try{
      await api.delete(`/api/trips/${id}`)
      load()
    }catch(err){
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Trips</h2>
          <div className="text-sm text-gray-500">Manage and dispatch trips</div>
        </div>
        <div className="flex items-center gap-2">
          <input className="p-2 border rounded-md" placeholder="Search" onChange={(e)=>{/* TODO: implement search */}} />
          {canCreate && <button onClick={openNew} className="px-4 py-2 rounded-md text-white" style={{background:'#0B63FF'}}>Add Trip</button>}
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-500">
              <tr>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Cargo Weight</th>
                <th>Revenue</th>
                <th>Schedule</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="p-6 text-center">Loading...</td></tr>}
              {!loading && trips.length===0 && <tr><td colSpan={7} className="p-6 text-center">No trips yet</td></tr>}
              {!loading && trips.map(t=> (
                <tr key={t._id} className="hover:bg-gray-50">
                  <td>{typeof t.vehicleId === 'object' ? t.vehicleId?.name : 'N/A'}</td>
                  <td>{typeof t.driverId === 'object' ? t.driverId?.name : 'N/A'}</td>
                  <td>{t.cargoWeight || 0} kg</td>
                  <td>${t.revenue || 0}</td>
                  <td>{t.schedule ? new Date(t.schedule).toLocaleDateString() : '-'}</td>
                  <td><span className={`px-2 py-1 rounded-full ${t.status==='Completed'? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{t.status}</span></td>
                  <td className="space-x-2">
                    {canEdit ? (
                      <button onClick={()=>openEdit(t)} className="px-3 py-1 rounded-md border">Edit</button>
                    ) : (
                      <button disabled className="px-3 py-1 rounded-md border text-gray-400">Edit</button>
                    )}
                    {canDelete ? (
                      <button onClick={()=>remove(t._id)} className="px-3 py-1 rounded-md bg-red-600 text-white">Delete</button>
                    ) : (
                      <button disabled className="px-3 py-1 rounded-md bg-gray-200 text-gray-400">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">{editing? 'Edit Trip' : 'Add Trip'}</h3>
            <form onSubmit={save} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Vehicle</label>
                <select value={form.vehicleId} onChange={e=>setForm({...form, vehicleId: e.target.value})} className="w-full mt-1 p-3 border rounded-lg">
                  <option value="">-- Select Vehicle --</option>
                  {vehicles.map(v=><option key={v._id} value={v._id}>{v.name} ({v.licensePlate})</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Driver</label>
                <select value={form.driverId} onChange={e=>setForm({...form, driverId: e.target.value})} className="w-full mt-1 p-3 border rounded-lg">
                  <option value="">-- Select Driver --</option>
                  {drivers.map(d=><option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Cargo Weight (kg)</label>
                  <input type="number" value={form.cargoWeight} onChange={e=>setForm({...form, cargoWeight: Number(e.target.value)})} className="w-full mt-1 p-3 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Revenue</label>
                  <input type="number" value={form.revenue} onChange={e=>setForm({...form, revenue: Number(e.target.value)})} className="w-full mt-1 p-3 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Start Odometer</label>
                <input type="number" value={form.startOdometer} onChange={e=>setForm({...form, startOdometer: Number(e.target.value)})} className="w-full mt-1 p-3 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Schedule</label>
                <input type="date" value={form.schedule} onChange={e=>setForm({...form, schedule: e.target.value})} className="w-full mt-1 p-3 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full mt-1 p-3 border rounded-lg">
                  <option>Pending</option>
                  <option>Dispatched</option>
                  <option>InProgress</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3">
                <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-2 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md text-white" style={{background:'#0B63FF'}}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
