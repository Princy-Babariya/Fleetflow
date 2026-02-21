import React from 'react'
import { NavLink } from 'react-router-dom'
import { getRole } from '../lib/auth'

export default function Sidebar(){
  const role = getRole()

  const base = [
    {to:'/', label:'Dashboard'},
    {to:'/vehicles', label:'Vehicles'},
    {to:'/trips', label:'Trips'},
    {to:'/maintenance', label:'Maintenance'},
    {to:'/drivers', label:'Drivers'},
    {to:'/expenses', label:'Expenses'},
    {to:'/analytics', label:'Analytics'}
  ]

  // Drivers see a simplified menu
  const items = role === 'driver' ? base.filter(i=> ['/', '/trips', '/analytics'].includes(i.to)) : base

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen p-4">
      <div className="mb-6 px-2">
        <div className="text-2xl font-semibold text-primary">FleetFlow</div>
        <div className="text-sm text-gray-500">Operations</div>
      </div>
      <nav className="space-y-1">
        {items.map(i=> (
          <NavLink key={i.to} to={i.to} className={({isActive})=> `flex items-center px-3 py-2 rounded-md text-sm ${isActive? 'bg-primary/10 text-primary':'text-gray-700 hover:bg-gray-50'}`}>
            <span className="ml-2">{i.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}


