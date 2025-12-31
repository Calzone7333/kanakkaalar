import React from "react";

export default function PageLoader({ show = false }) {
  if (!show) return null;

  return (
    <div className="cs_preloader cs_white_bg fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="cs_preloader_in position-relative">
        <span></span>
      </div>
    </div>
  );
}
