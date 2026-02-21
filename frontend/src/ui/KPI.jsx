import React from 'react'

export default function KPI({title, value, type, percent, color, note}){
  return (
    <div className="card">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="flex items-center justify-between mt-3">
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        {note && <div className="text-sm text-green-600">{note}</div>}
      </div>
      {type==='progress' && (
        <div className="mt-3">
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div style={{width: `${percent}%`, background:'#0B63FF'}} className="h-full"></div>
          </div>
          <div className="text-xs text-gray-500 mt-2">{percent}% Utilization</div>
        </div>
      )}
    </div>
  )
}
