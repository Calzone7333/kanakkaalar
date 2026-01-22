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
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        {/* Animated Icon Container */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-2xl transform group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-[#F0FBFA] z-10">
            <span className="text-3xl">😕</span>
          </div>
          {/* Floating Elements */}
          <div className="absolute top-0 right-0 w-8 h-8 bg-[#C59B4E] rounded-full animate-bounce delay-100 opacity-80"></div>
          <div className="absolute bottom-2 left-2 w-5 h-5 bg-[#003366] rounded-full animate-bounce delay-300 opacity-80"></div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-extrabold text-[#003366] mb-2 tracking-tight">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
          {info ? info.title : 'Page Not Found'}
        </h2>
        <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
          Oops! The page you are looking for might have been removed, renamed, or is temporarily unavailable.
        </p>

        {/* Action Button */}
        <a
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#003366] text-white rounded-full font-bold text-sm uppercase tracking-wider shadow-lg hover:bg-[#00254a] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          Back to Home
        </a>
      </div>
    )
  }

  return (
    <Suspense fallback={<PageLoader show={true} />}>
      <LazyComp />
    </Suspense>
  )
}
