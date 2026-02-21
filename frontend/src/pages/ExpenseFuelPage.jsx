import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import { isRole } from '../lib/auth'

export default function ExpenseFuelPage(){
  const [records, setRecords] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ vehicleId:'', date:'', liters:0, cost:0, odometer:0, supplier:'' })

  const load = async ()=>{
    setLoading(true)
    try{
      const [fuelRes, vehiclesRes] = await Promise.all([
        api.get('/api/fuel'),
        api.get('/api/vehicles')
      ])
      setRecords(fuelRes.data)
      setVehicles(vehiclesRes.data)
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
    setForm({ vehicleId:'', date:new Date().toISOString().split('T')[0], liters:0, cost:0, odometer:0, supplier:'' })
    setShowModal(true)
  }

  const openEdit = (r)=>{ 
    setEditing(r)
    setForm({
      vehicleId: r.vehicleId?._id || r.vehicleId || '',
      date: r.date ? r.date.split('T')[0] : '',
      liters: r.liters || 0,
      cost: r.cost || 0,
      odometer: r.odometer || 0,
      supplier: r.supplier || ''
    })
    setShowModal(true)
  }

  const save = async (e)=>{
    e.preventDefault()
    if(!form.vehicleId){
      alert('Please select vehicle')
      return
    }
    try{
      if(editing){
        await api.put(`/api/fuel/${editing._id}`, form)
      } else {
        await api.post('/api/fuel', form)
      }
      setShowModal(false)
      load()
    }catch(err){
      alert(err.response?.data?.message || 'Save failed')
    }
  }

  const remove = async (id)=>{
    if(!confirm('Delete this fuel record?')) return
    try{
      await api.delete(`/api/fuel/${id}`)
      load()
    }catch(err){
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  const totalCost = records.reduce((sum, r) => sum + (r.cost || 0), 0)
  const totalLiters = records.reduce((sum, r) => sum + (r.liters || 0), 0)
  const avgCostPerLiter = totalLiters > 0 ? (totalCost / totalLiters).toFixed(2) : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Fuel Expenses</h2>
          <div className="text-sm text-gray-500">Track fuel consumption and costs</div>
        </div>
        <div className="flex items-center gap-2">
          <input className="p-2 border rounded-md" placeholder="Search" onChange={(e)=>{/* TODO: implement search */}} />
          {canCreate && <button onClick={openNew} className="px-4 py-2 rounded-md text-white" style={{background:'#0B63FF'}}>Add Fuel Entry</button>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <div className="text-xs text-gray-600">Total Liters</div>
          <div className="text-2xl font-bold mt-2">{totalLiters.toFixed(1)}</div>
          <div className="text-xs text-gray-500 mt-1">{records.length} entries</div>
        </div>
        <div className="card">
          <div className="text-xs text-gray-600">Total Cost</div>
          <div className="text-2xl font-bold mt-2">${totalCost.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-1">All fuel expenses</div>
        </div>
        <div className="card">
          <div className="text-xs text-gray-600">Avg Cost/Liter</div>
          <div className="text-2xl font-bold mt-2">${avgCostPerLiter}</div>
          <div className="text-xs text-gray-500 mt-1">Unit cost</div>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-500">
              <tr>
                <th>Vehicle</th>
                <th>Date</th>
                <th>Liters</th>
                <th>Cost</th>
                <th>Odometer</th>
                <th>Supplier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="p-6 text-center">Loading...</td></tr>}
              {!loading && records.length===0 && <tr><td colSpan={7} className="p-6 text-center">No fuel records yet</td></tr>}
              {!loading && records.map(r=> (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td>{typeof r.vehicleId === 'object' ? r.vehicleId?.name : 'N/A'}</td>
                  <td>{r.date ? new Date(r.date).toLocaleDateString() : '-'}</td>
                  <td>{r.liters || 0}</td>
                  <td>${r.cost || 0}</td>
                  <td>{r.odometer || 0}</td>
                  <td>{r.supplier}</td>
                  <td className="space-x-2">
                    {canEdit ? (
                      <button onClick={()=>openEdit(r)} className="px-3 py-1 rounded-md border">Edit</button>
                    ) : (
                      <button disabled className="px-3 py-1 rounded-md border text-gray-400">Edit</button>
                    )}
                    {canDelete ? (
                      <button onClick={()=>remove(r._id)} className="px-3 py-1 rounded-md bg-red-600 text-white">Delete</button>
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
            <h3 className="text-lg font-semibold mb-4">{editing? 'Edit Fuel Entry' : 'Add Fuel Entry'}</h3>
            <form onSubmit={save} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Vehicle</label>
                <select value={form.vehicleId} onChange={e=>setForm({...form, vehicleId: e.target.value})} className="w-full mt-1 p-3 border rounded-lg">
                  <option value="">-- Select Vehicle --</option>
                  {vehicles.map(v=><option key={v._id} value={v._id}>{v.name} ({v.licensePlate})</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Date</label>
                <input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="w-full mt-1 p-3 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Liters</label>
                  <input type="number" step="0.01" value={form.liters} onChange={e=>setForm({...form, liters: Number(e.target.value)})} className="w-full mt-1 p-3 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Cost</label>
                  <input type="number" step="0.01" value={form.cost} onChange={e=>setForm({...form, cost: Number(e.target.value)})} className="w-full mt-1 p-3 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Odometer</label>
                <input type="number" value={form.odometer} onChange={e=>setForm({...form, odometer: Number(e.target.value)})} className="w-full mt-1 p-3 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Supplier</label>
                <input value={form.supplier} onChange={e=>setForm({...form, supplier: e.target.value})} className="w-full mt-1 p-3 border rounded-lg" placeholder="e.g., Shell, Exxon" />
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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Expenses & Fuel Logging</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 card">
          <h3 className="text-sm font-medium mb-2">Fuel Entry</h3>
          <form onSubmit={handleAddRecord} className="space-y-3">
            <input value={formData.vehicleId} onChange={e=>setFormData({...formData, vehicleId: e.target.value})} className="w-full p-2 border rounded" placeholder="Vehicle ID" required />
            <input value={formData.liters} onChange={e=>setFormData({...formData, liters: Number(e.target.value)})} className="w-full p-2 border rounded" placeholder="Liters" type="number" required />
            <input value={formData.cost} onChange={e=>setFormData({...formData, cost: Number(e.target.value)})} className="w-full p-2 border rounded" placeholder="Cost" type="number" required />
            <input value={formData.odometer} onChange={e=>setFormData({...formData, odometer: Number(e.target.value)})} className="w-full p-2 border rounded" placeholder="Odometer" type="number" />
            <input value={formData.supplier} onChange={e=>setFormData({...formData, supplier: e.target.value})} className="w-full p-2 border rounded" placeholder="Supplier" />
            <input value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} className="w-full p-2 border rounded" type="date" />
            <div className="text-sm text-gray-500">Total Cost: ${totalCost.toFixed(2)}</div>
            <button className="w-full py-2 rounded text-white" style={{background:'#0B63FF'}}>Add Fuel Record</button>
          </form>
        </div>
        <div className="col-span-2 card">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded"><div className="text-xs text-gray-500">Total Liters</div><div className="text-lg font-semibold">{totalLiters.toFixed(1)} L</div></div>
            <div className="bg-gray-50 p-3 rounded"><div className="text-xs text-gray-500">Total Cost</div><div className="text-lg font-semibold">${totalCost.toFixed(2)}</div></div>
            <div className="bg-gray-50 p-3 rounded"><div className="text-xs text-gray-500">Avg Cost/L</div><div className="text-lg font-semibold">${(totalCost/totalLiters || 0).toFixed(2)}</div></div>
          </div>
          <h3 className="text-sm font-medium mb-2">Fuel Records ({records.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {records.length === 0 ? (
              <div className="text-gray-400">No fuel records yet.</div>
            ) : (
              records.map(r => (
                <div key={r._id} className="p-3 border rounded text-sm">
                  <div className="font-medium">{r.vehicleId} — {r.liters}L @ ${r.cost}</div>
                  <div className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString()} | {r.supplier || 'Unknown'} | Odo: {r.odometer}km</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
