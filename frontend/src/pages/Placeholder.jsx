import React from 'react'
import NAV from '@/data/navigation'
import { useLocation } from 'react-router-dom'

export default function Placeholder(){
  const loc = useLocation()
  const info = NAV[loc.pathname]
  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold">{info? info.title : 'Page'}</h1>
      <p className="text-sm text-slate-600 mt-2">{info? `Category: ${info.category}` : 'This is a placeholder page.'}</p>
      <div className="mt-4 text-slate-500">Path: {loc.pathname}</div>
    </div>
  )
}
