import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import { isRole } from '../lib/auth'

export default function VehicleRegistryPage(){
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name:'', licensePlate:'', maxCapacity:0, odometer:0, acquisitionCost:0, status:'Available' })

  const load = async ()=>{
    setLoading(true)
    try{
      const res = await api.get('/api/vehicles')
      setVehicles(res.data)
    }catch(err){
      console.error(err)
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  const canCreate = isRole('admin','dispatcher')
  const canEdit = isRole('admin','dispatcher')
  const canDelete = isRole('admin')

  const openNew = ()=>{ setEditing(null); setForm({ name:'', licensePlate:'', maxCapacity:0, odometer:0, acquisitionCost:0, status:'Available' }); setShowModal(true) }

  const openEdit = (v)=>{ setEditing(v); setForm({ name:v.name, licensePlate:v.licensePlate, maxCapacity:v.maxCapacity||0, odometer:v.odometer||0, acquisitionCost:v.acquisitionCost||0, status:v.status||'Available' }); setShowModal(true) }

  const save = async (e)=>{
    e.preventDefault()
    try{
      if(editing){
        await api.put(`/api/vehicles/${editing._id}`, form)
      } else {
        await api.post('/api/vehicles', form)
      }
      setShowModal(false)
      load()
    }catch(err){
      alert(err.response?.data?.message || 'Save failed')
    }
  }

  const remove = async (id)=>{
    if(!confirm('Delete this vehicle?')) return
    try{
      await api.delete(`/api/vehicles/${id}`)
      load()
    }catch(err){
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Vehicle Registry</h2>
          <div className="text-sm text-gray-500">Manage fleet vehicles</div>
        </div>
        <div className="flex items-center gap-2">
          <input className="p-2 border rounded-md" placeholder="Search" onChange={(e)=>{/* TODO: implement search */}} />
          {canCreate && <button onClick={openNew} className="px-4 py-2 rounded-md text-white" style={{background:'#0B63FF'}}>Add Vehicle</button>}
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-500">
              <tr>
                <th>Vehicle Name</th>
                <th>License Plate</th>
                <th>Max Load</th>
                <th>Odometer</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} className="p-6 text-center">Loading...</td></tr>}
              {!loading && vehicles.length===0 && <tr><td colSpan={6} className="p-6 text-center">No vehicles yet</td></tr>}
              {!loading && vehicles.map(v=> (
                <tr key={v._id} className="hover:bg-gray-50">
                  <td>{v.name}</td>
                  <td>{v.licensePlate}</td>
                  <td>{v.maxCapacity || '-'}</td>
                  <td>{v.odometer || 0}</td>
                  <td><span className={`px-2 py-1 rounded-full ${v.status==='Available'? 'bg-[#ECFDF3] text-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E]'}`}>{v.status}</span></td>
                  <td className="space-x-2">
                    {canEdit ? (
                      <button onClick={()=>openEdit(v)} className="px-3 py-1 rounded-md border">Edit</button>
                    ) : (
                      <button disabled className="px-3 py-1 rounded-md border text-gray-400">Edit</button>
                    )}

                    {canDelete ? (
                      <button onClick={()=>remove(v._id)} className="px-3 py-1 rounded-md bg-red-600 text-white">Delete</button>
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
            <h3 className="text-lg font-semibold mb-4">{editing? 'Edit Vehicle' : 'Add Vehicle'}</h3>
            <form onSubmit={save} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Vehicle Name</label>
                <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full mt-1 p-3 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm text-gray-600">License Plate</label>
                <input value={form.licensePlate} onChange={e=>setForm({...form, licensePlate: e.target.value})} className="w-full mt-1 p-3 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Capacity</label>
                  <input type="number" value={form.maxCapacity} onChange={e=>setForm({...form, maxCapacity: Number(e.target.value)})} className="w-full mt-1 p-3 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Odometer</label>
                  <input type="number" value={form.odometer} onChange={e=>setForm({...form, odometer: Number(e.target.value)})} className="w-full mt-1 p-3 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Acquisition Cost</label>
                <input type="number" value={form.acquisitionCost} onChange={e=>setForm({...form, acquisitionCost: Number(e.target.value)})} className="w-full mt-1 p-3 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full mt-1 p-3 border rounded-lg">
                  <option>Available</option>
                  <option>OnTrip</option>
                  <option>Maintenance</option>
                  <option>Retired</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3">
                <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-2 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md text-white" style={{background:'#0B63FF'}}>{editing? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
