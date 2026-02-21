import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, logout } from '../lib/auth'

export default function Topbar(){
  const navigate = useNavigate()
  const user = getUser()

  const initials = (() => {
    if (!user?.name) return 'G'
    return user.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()
  })()

  const doLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-18 bg-white flex items-center justify-between px-6 border-b border-gray-100" style={{height:72}}>
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold">FleetFlow</div>
        <div className="hidden md:block">
          <input className="w-96 p-2 rounded-lg border border-gray-200" placeholder="Search vehicles, trips, drivers..." />
        </div>
      </div>
      <div className="flex items-center gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">{initials}</div>
          <div className="text-sm">
            <div className="font-medium">{user?.name || 'Guest'}</div>
            <div className="text-xs text-gray-500">{user?.role || '—'}</div>
          </div>
          <button onClick={doLogout} className="ml-4 text-sm text-red-600">Logout</button>
        </div>
      </div>
    </header>
  )
}
