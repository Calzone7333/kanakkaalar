import React, { Suspense, lazy, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import NAV from '@/data/navigation'

import { importMap } from '@/lib/serviceRoutes'
import PageLoader from '@/components/PageLoader'

export default function ServiceLoader() {
  const loc = useLocation()
  const path = loc.pathname
  const entry = importMap[path]
  const info = NAV[path]

  const LazyComp = useMemo(() => {
    if (!entry) return null
    return lazy(entry)
  }, [path])

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold">{info ? info.title : 'Page not found'}</h1>
        <p className="text-sm text-slate-600 mt-2">This page is not available as a dedicated module yet. Use the navigation to select a service.</p>
      </div>
    )
  }

  return (
    <Suspense fallback={<PageLoader show={true} />}>
      <LazyComp />
    </Suspense>
  )
}
