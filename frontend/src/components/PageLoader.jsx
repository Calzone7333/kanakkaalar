import React from "react";

export default function PageLoader({ show = false }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-sm transition-all duration-300">

      {/* 3D Breathing Cube */}
      <div className="loader-3d-container">
        <div className="cube">
          <div className="face face--front"></div>
          <div className="face face--back"></div>
          <div className="face face--right"></div>
          <div className="face face--left"></div>
          <div className="face face--top"></div>
          <div className="face face--bottom"></div>
        </div>
        <div className="shadow-pulse"></div>
      </div>

      <style>{`
        .loader-3d-container {
          position: relative;
          width: 60px;
          height: 60px;
          perspective: 1200px;
        }

        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: spin-and-tilt 8s infinite linear;
        }

        .face {
          position: absolute;
          width: 60px;
          height: 60px;
          opacity: 0.9;
          border: 2px solid #C59B4E; /* Gold Borders */
          background: rgba(26, 127, 125, 0.85); /* Teal Transparent Glass */
          box-shadow: 0 0 20px rgba(26, 127, 125, 0.4) inset; /* Inner Glow */
        }

        /* "More Animation": Faces breathe/explode outward - Slower speed */
        .face--front  { transform: rotateY(0deg) translateZ(30px); animation: breathe-front 4s infinite ease-in-out; }
        .face--back   { transform: rotateY(180deg) translateZ(30px); animation: breathe-back 4s infinite ease-in-out; }
        .face--right  { transform: rotateY(90deg) translateZ(30px); animation: breathe-right 4s infinite ease-in-out; }
        .face--left   { transform: rotateY(-90deg) translateZ(30px); animation: breathe-left 4s infinite ease-in-out; }
        .face--top    { transform: rotateX(90deg) translateZ(30px); animation: breathe-top 4s infinite ease-in-out; }
        .face--bottom { transform: rotateX(-90deg) translateZ(30px); animation: breathe-bottom 4s infinite ease-in-out; }

        .shadow-pulse {
          margin: 50px auto 0;
          width: 60px;
          height: 15px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 50%;
          filter: blur(8px);
          animation: shadow-breathe 4s infinite ease-in-out;
        }

        /* Complex Spin */
        @keyframes spin-and-tilt {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg); }
        }

        /* Breathing Animations for each face to move outward */
        @keyframes breathe-front { 50% { transform: rotateY(0deg) translateZ(45px); } }
        @keyframes breathe-back { 50% { transform: rotateY(180deg) translateZ(45px); } }
        @keyframes breathe-right { 50% { transform: rotateY(90deg) translateZ(45px); } }
        @keyframes breathe-left { 50% { transform: rotateY(-90deg) translateZ(45px); } }
        @keyframes breathe-top { 50% { transform: rotateX(90deg) translateZ(45px); } }
        @keyframes breathe-bottom { 50% { transform: rotateX(-90deg) translateZ(45px); } }

        @keyframes shadow-breathe {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(0.5); opacity: 0.1; }
        }
      `}</style>
    </div>
  );
}
