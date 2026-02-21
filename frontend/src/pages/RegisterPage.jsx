import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function RegisterPage(){
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('dispatcher')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try{
      const res = await api.post('/api/auth/register', { name, email, password, role })
      const { token, user } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setLoading(false)
      navigate('/')
    }catch(err){
      setLoading(false)
      const msg = err.response?.data?.message || (err.response?.data?.errors?.[0]?.msg) || 'Registration failed'
      setError(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md card relative overflow-hidden p-6">
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-primary">Create account</div>
          <p className="text-sm text-gray-500">Register to manage fleet data</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div>
            <label className="text-sm text-gray-600">Full name</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full mt-1 p-3 border rounded-lg" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full mt-1 p-3 border rounded-lg" placeholder="you@company.com" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full mt-1 p-3 border rounded-lg" placeholder="••••••••" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Role</label>
            <select value={role} onChange={e=>setRole(e.target.value)} className="w-full mt-1 p-3 border rounded-lg">
              <option value="admin">Admin</option>
              <option value="dispatcher">Dispatcher</option>
              <option value="driver">Driver</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <div className="pt-4">
            <button disabled={loading} className="w-full py-3 rounded-lg text-white" style={{background:'#0B63FF'}}>{loading? 'Creating...' : 'Create account'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
