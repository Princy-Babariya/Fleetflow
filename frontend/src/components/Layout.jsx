import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout({children}){
  const navigate = useNavigate()

  useEffect(()=>{
    try {
      const token = localStorage.getItem('token')
      if (!token) navigate('/login')
    } catch (e) {
      navigate('/login')
    }
  }, [])

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-6 bg-neutral-100 min-h-[calc(100vh-72px)]">
          {children}
        </main>
      </div>
    </div>
  )
}
