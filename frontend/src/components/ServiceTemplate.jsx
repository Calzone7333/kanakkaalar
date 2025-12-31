import React from 'react';

export default function ServiceTemplate({ title, subtitle, heroImage, children }) {
  return (
    <div className="service-template bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Optional header area for pages that want to pass title/subtitle */}
        {(title || subtitle) && (
          <header className="pt-6 pb-6">
            {title && <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{title}</h1>}
            {subtitle && <p className="text-sm text-gray-600 mt-2">{subtitle}</p>}
          </header>
        )}

        {/* Main slot for the page's content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
