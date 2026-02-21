import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function LoginPage(){
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', { email, password })
      const { token, user } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setLoading(false)
      navigate('/')
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md card relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')] bg-cover"></div>
        <div className="relative z-10 p-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-primary">FleetFlow</div>
            <p className="text-sm text-gray-500">Modular Fleet & Logistics Management</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full mt-1 p-3 border rounded-lg" placeholder="you@company.com" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full mt-1 p-3 border rounded-lg" placeholder="••••••••" />
              <div className="text-right text-xs mt-1"><a className="text-primary">Forgot password?</a></div>
            </div>
            <div className="pt-4">
              <button disabled={loading} className="w-full py-3 rounded-lg text-white" style={{background:'#0B63FF'}}>{loading? 'Signing in...' : 'Login'}</button>
            </div>
            <div className="text-center text-sm mt-3">
              Don't have an account? <a onClick={()=>navigate('/register')} className="text-primary cursor-pointer">Register</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
