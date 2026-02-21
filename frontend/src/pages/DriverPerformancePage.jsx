import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import { isRole } from '../lib/auth'

export default function DriverPerformancePage(){
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name:'', licenseType:'', licenseExpiry:'', safetyScore:0, status:'OnDuty' })

  const load = async ()=>{
    setLoading(true)
    try{
      const res = await api.get('/api/drivers')
      setDrivers(res.data)
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
    setForm({ name:'', licenseType:'', licenseExpiry:new Date().toISOString().split('T')[0], safetyScore:0, status:'OnDuty' })
    setShowModal(true)
  }

  const openEdit = (d)=>{ 
    setEditing(d)
    setForm({
      name: d.name || '',
      licenseType: d.licenseType || '',
      licenseExpiry: d.licenseExpiry ? d.licenseExpiry.split('T')[0] : '',
      safetyScore: d.safetyScore || 0,
      status: d.status || 'OnDuty'
    })
    setShowModal(true)
  }

  const save = async (e)=>{
    e.preventDefault()
    if(!form.name){
      alert('Please enter driver name')
      return
    }
    try{
      if(editing){
        await api.put(`/api/drivers/${editing._id}`, form)
      } else {
        await api.post('/api/drivers', form)
      }
      setShowModal(false)
      load()
    }catch(err){
      alert(err.response?.data?.message || 'Save failed')
    }
  }

  const remove = async (id)=>{
    if(!confirm('Delete this driver?')) return
    try{
      await api.delete(`/api/drivers/${id}`)
      load()
    }catch(err){
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Driver Management</h2>
          <div className="text-sm text-gray-500">Manage drivers and performance</div>
        </div>
        <div className="flex items-center gap-2">
          <input className="p-2 border rounded-md" placeholder="Search" onChange={(e)=>{/* TODO: implement search */}} />
          {canCreate && <button onClick={openNew} className="px-4 py-2 rounded-md text-white" style={{background:'#0B63FF'}}>Add Driver</button>}
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-500">
              <tr>
                <th>Name</th>
                <th>License Type</th>
                <th>License Expiry</th>
                <th>Safety Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} className="p-6 text-center">Loading...</td></tr>}
              {!loading && drivers.length===0 && <tr><td colSpan={6} className="p-6 text-center">No drivers yet</td></tr>}
              {!loading && drivers.map(d=> {
                const expiry = new Date(d.licenseExpiry)
                const isExpired = expiry < new Date()
                return (
                  <tr key={d._id} className="hover:bg-gray-50">
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                          {d.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                        </div>
                        {d.name}
                      </div>
                    </td>
                    <td>{d.licenseType}</td>
                    <td><span className={isExpired ? 'text-red-600 font-semibold' : ''}>{expiry.toLocaleDateString()} {isExpired ? '(EXPIRED)' : ''}</span></td>
                    <td><span className="font-semibold">{d.safetyScore || 0}%</span></td>
                    <td><span className={`px-2 py-1 rounded-full ${d.status==='OnDuty'? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{d.status}</span></td>
                    <td className="space-x-2">
                      {canEdit ? (
                        <button onClick={()=>openEdit(d)} className="px-3 py-1 rounded-md border">Edit</button>
                      ) : (
                        <button disabled className="px-3 py-1 rounded-md border text-gray-400">Edit</button>
                      )}
                      {canDelete ? (
                        <button onClick={()=>remove(d._id)} className="px-3 py-1 rounded-md bg-red-600 text-white">Delete</button>
                      ) : (
                        <button disabled className="px-3 py-1 rounded-md bg-gray-200 text-gray-400">Delete</button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">{editing? 'Edit Driver' : 'Add Driver'}</h3>
            <form onSubmit={save} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Driver Name</label>
                <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full mt-1 p-3 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm text-gray-600">License Type</label>
                <input value={form.licenseType} onChange={e=>setForm({...form, licenseType: e.target.value})} className="w-full mt-1 p-3 border rounded-lg" placeholder="e.g., Class A, Class B" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">License Expiry</label>
                  <input type="date" value={form.licenseExpiry} onChange={e=>setForm({...form, licenseExpiry: e.target.value})} className="w-full mt-1 p-3 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Safety Score</label>
                  <input type="number" min="0" max="100" value={form.safetyScore} onChange={e=>setForm({...form, safetyScore: Number(e.target.value)})} className="w-full mt-1 p-3 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full mt-1 p-3 border rounded-lg">
                  <option>OnDuty</option>
                  <option>OffDuty</option>
                  <option>OnLeave</option>
                  <option>Terminated</option>
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
      
      <div className="grid grid-cols-1 gap-4">
        {drivers.length === 0 ? (
          <div className="card text-center text-gray-400">No drivers found</div>
        ) : (
          drivers.map(d => {
            const initials = d.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()
            const licenseExpiryDate = new Date(d.licenseExpiry)
            const isExpired = licenseExpiryDate < new Date()
            
            return (
              <div key={d._id} className="card grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="mx-auto rounded-full w-16 h-16 bg-blue-100 flex items-center justify-center text-lg font-semibold text-blue-700 mb-2">{initials}</div>
                  <h3 className="font-semibold">{d.name}</h3>
                  <div className="text-sm text-gray-500">License: {d.licenseNumber}</div>
                  <div className={`text-xs font-medium mt-1 ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                    Expires: {licenseExpiryDate.toLocaleDateString()} {isExpired ? '(EXPIRED)' : ''}
                  </div>
                  <button className="mt-3 px-3 py-1 rounded text-sm text-white" style={{background:'#0B63FF'}}>View Profile</button>
                </div>
                <div className="col-span-2 space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-xs text-gray-500">Status</div>
                      <div className="font-semibold text-sm">{d.status || 'Idle'}</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-xs text-gray-500">Phone</div>
                      <div className="font-semibold text-sm">{d.phone || '—'}</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-semibold text-sm text-xs">{d.email || '—'}</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-xs text-gray-500">Trips</div>
                      <div className="font-semibold text-sm">{d.trips || 0}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">On-Time %</div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                      <div className="h-2 bg-green-500 rounded" style={{width: (d.onTimePercentage || 85) + '%'}}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{d.onTimePercentage || 85}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Safety Score</div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                      <div className="h-2 bg-blue-500 rounded" style={{width: (d.safetyScore || 92) + '%'}}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{d.safetyScore || 92}/100</div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
