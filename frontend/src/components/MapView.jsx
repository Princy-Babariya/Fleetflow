import React from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function MapView({ coords = [], height = 300 }){
  const center = coords && coords.length ? coords[Math.floor(coords.length/2)] : [0,0]
  return (
    <div style={{height}} className="rounded overflow-hidden">
      <MapContainer center={center} zoom={13} style={{height:'100%', width:'100%'}} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coords && coords.length>0 && (
          <>
            <Polyline positions={coords} pathOptions={{color:'#0B63FF', weight:4}} />
            <CircleMarker center={coords[0]} radius={6} pathOptions={{color:'#16A34A', fillColor:'#16A34A'}} />
            <CircleMarker center={coords[coords.length-1]} radius={6} pathOptions={{color:'#DC2626', fillColor:'#DC2626'}} />
          </>
        )}
      </MapContainer>
    </div>
  )
}
