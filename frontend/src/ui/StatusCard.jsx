import React from 'react'

export default function StatusCard({title, value, color}){
  const bg = color==='alertRed'? 'bg-[#FEF2F2] text-[#991B1B]' : color==='maintenanceOrange'? 'bg-[#FFF7ED] text-[#92400E]':'bg-[#ECFDF3] text-[#065F46]'
  return (
    <div className="card flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${bg}`}>{value}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
