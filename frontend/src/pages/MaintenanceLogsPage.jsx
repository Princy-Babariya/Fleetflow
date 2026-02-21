import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import { isRole } from '../lib/auth'

export default function MaintenanceLogsPage(){
  const [records, setRecords] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ vehicleId:'', vendor:'', serviceType:'', cost:0, datePerformed:'', odometer:0, nextDueDate:'' })

  const load = async ()=>{
    setLoading(true)
    try{
      const [mainRes, vehiclesRes] = await Promise.all([
        api.get('/api/maintenance'),
        api.get('/api/vehicles')
      ])
      setRecords(mainRes.data)
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
    setForm({ vehicleId:'', vendor:'', serviceType:'', cost:0, datePerformed:new Date().toISOString().split('T')[0], odometer:0, nextDueDate:'' })
    setShowModal(true)
  }

  const openEdit = (r)=>{ 
    setEditing(r)
    setForm({
      vehicleId: r.vehicleId?._id || r.vehicleId || '',
      vendor: r.vendor || '',
      serviceType: r.serviceType || '',
      cost: r.cost || 0,
      datePerformed: r.datePerformed || '',
      odometer: r.odometer || 0,
      nextDueDate: r.nextDueDate || ''
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
        await api.put(`/api/maintenance/${editing._id}`, form)
      } else {
        await api.post('/api/maintenance', form)
      }
      setShowModal(false)
      load()
    }catch(err){
      alert(err.response?.data?.message || 'Save failed')
    }
  }

  const remove = async (id)=>{
    if(!confirm('Delete this record?')) return
    try{
      await api.delete(`/api/maintenance/${id}`)
      load()
    }catch(err){
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Maintenance Logs</h2>
          <div className="text-sm text-gray-500">Track vehicle maintenance</div>
        </div>
        <div className="flex items-center gap-2">
          <input className="p-2 border rounded-md" placeholder="Search" onChange={(e)=>{/* TODO: implement search */}} />
          {canCreate && <button onClick={openNew} className="px-4 py-2 rounded-md text-white" style={{background:'#0B63FF'}}>Add Service Log</button>}
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-500">
              <tr>
                <th>Vehicle</th>
                <th>Service Type</th>
                <th>Vendor</th>
                <th>Cost</th>
                <th>Date Performed</th>
                <th>Odometer</th>
                <th>Next Due</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} className="p-6 text-center">Loading...</td></tr>}
              {!loading && records.length===0 && <tr><td colSpan={8} className="p-6 text-center">No maintenance records yet</td></tr>}
              {!loading && records.map(r=> (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td>{typeof r.vehicleId === 'object' ? r.vehicleId?.name : 'N/A'}</td>
                  <td>{r.serviceType}</td>
                  <td>{r.vendor}</td>
                  <td>${r.cost || 0}</td>
                  <td>{r.datePerformed ? new Date(r.datePerformed).toLocaleDateString() : '-'}</td>
                  <td>{r.odometer || 0}</td>
                  <td>{r.nextDueDate ? new Date(r.nextDueDate).toLocaleDateString() : '-'}</td>
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
            <h3 className="text-lg font-semibold mb-4">{editing? 'Edit Maintenance' : 'Add Service Log'}</h3>
            <form onSubmit={save} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Vehicle</label>
                <select value={form.vehicleId} onChange={e=>setForm({...form, vehicleId: e.target.value})} className="w-full mt-1 p-3 border rounded-lg">
                  <option value="">-- Select Vehicle --</option>
                  {vehicles.map(v=><option key={v._id} value={v._id}>{v.name} ({v.licensePlate})</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Service Type</label>
                <input value={form.serviceType} onChange={e=>setForm({...form, serviceType: e.target.value})} className="w-full mt-1 p-3 border rounded-lg" placeholder="e.g., Oil Change, Brake Inspection" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Vendor/Shop</label>
                <input value={form.vendor} onChange={e=>setForm({...form, vendor: e.target.value})} className="w-full mt-1 p-3 border rounded-lg" placeholder="Service provider name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Cost</label>
                  <input type="number" value={form.cost} onChange={e=>setForm({...form, cost: Number(e.target.value)})} className="w-full mt-1 p-3 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Odometer</label>
                  <input type="number" value={form.odometer} onChange={e=>setForm({...form, odometer: Number(e.target.value)})} className="w-full mt-1 p-3 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Date Performed</label>
                <input type="date" value={form.datePerformed} onChange={e=>setForm({...form, datePerformed: e.target.value})} className="w-full mt-1 p-3 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Next Due Date</label>
                <input type="date" value={form.nextDueDate} onChange={e=>setForm({...form, nextDueDate: e.target.value})} className="w-full mt-1 p-3 border rounded-lg" />
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

      {showForm && (
        <div className="card">
          <form onSubmit={handleAddRecord} className="space-y-3 grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-600">Vehicle ID</label><input value={formData.vehicleId} onChange={e=>setFormData({...formData, vehicleId: e.target.value})} className="w-full mt-1 p-2 border rounded" type="text" required /></div>
            <div><label className="text-sm text-gray-600">Vendor</label><input value={formData.vendor} onChange={e=>setFormData({...formData, vendor: e.target.value})} className="w-full mt-1 p-2 border rounded" type="text" required /></div>
            <div><label className="text-sm text-gray-600">Service Type</label><input value={formData.serviceType} onChange={e=>setFormData({...formData, serviceType: e.target.value})} className="w-full mt-1 p-2 border rounded" type="text" required /></div>
            <div><label className="text-sm text-gray-600">Cost</label><input value={formData.cost} onChange={e=>setFormData({...formData, cost: Number(e.target.value)})} className="w-full mt-1 p-2 border rounded" type="number" required /></div>
            <div><label className="text-sm text-gray-600">Date Performed</label><input value={formData.datePerformed} onChange={e=>setFormData({...formData, datePerformed: e.target.value})} className="w-full mt-1 p-2 border rounded" type="date" required /></div>
            <div><label className="text-sm text-gray-600">Odometer</label><input value={formData.odometer} onChange={e=>setFormData({...formData, odometer: Number(e.target.value)})} className="w-full mt-1 p-2 border rounded" type="number" required /></div>
            <div className="col-span-2"><label className="text-sm text-gray-600">Next Due Date</label><input value={formData.nextDueDate} onChange={e=>setFormData({...formData, nextDueDate: e.target.value})} className="w-full mt-1 p-2 border rounded" type="date" /></div>
            <div className="col-span-2 flex gap-2"><button type="submit" className="flex-1 py-2 rounded text-white" style={{background:'#0B63FF'}}>Save</button><button type="button" onClick={()=>setShowForm(false)} className="flex-1 py-2 rounded bg-gray-300">Cancel</button></div>
          </form>
        </div>
      )}

      <div className="card">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500"><tr><th>Vehicle</th><th>Service Type</th><th>Vendor</th><th>Cost</th><th>Date</th><th>Next Due</th></tr></thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-400">No maintenance records</td></tr>
            ) : (
              records.map(r => (
                <tr key={r._id} className="hover:bg-gray-50 border-b">
                  <td className="p-2">{r.vehicleId || '—'}</td>
                  <td className="p-2">{r.serviceType}</td>
                  <td className="p-2">{r.vendor}</td>
                  <td className="p-2">${r.cost}</td>
                  <td className="p-2">{new Date(r.datePerformed).toLocaleDateString()}</td>
                  <td className="p-2">{r.nextDueDate ? new Date(r.nextDueDate).toLocaleDateString() : '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
