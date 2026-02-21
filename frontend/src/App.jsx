import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import VehicleRegistryPage from './pages/VehicleRegistryPage'
import TripDispatcherPage from './pages/TripDispatcherPage'
import MaintenanceLogsPage from './pages/MaintenanceLogsPage'
import ExpenseFuelPage from './pages/ExpenseFuelPage'
import DriverPerformancePage from './pages/DriverPerformancePage'
import AnalyticsPage from './pages/AnalyticsPage'
import Layout from './components/Layout'

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/" element={<Layout><DashboardPage/></Layout>} />
      <Route path="/vehicles" element={<Layout><VehicleRegistryPage/></Layout>} />
      <Route path="/trips" element={<Layout><TripDispatcherPage/></Layout>} />
      <Route path="/maintenance" element={<Layout><MaintenanceLogsPage/></Layout>} />
      <Route path="/expenses" element={<Layout><ExpenseFuelPage/></Layout>} />
      <Route path="/drivers" element={<Layout><DriverPerformancePage/></Layout>} />
      <Route path="/analytics" element={<Layout><AnalyticsPage/></Layout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
