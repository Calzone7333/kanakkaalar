import React from "react";
import "tailwindcss/tailwind.css";

export default function ComplianceSection() {
    return (
        <section
            className="
    relative left-1/2 right-1/2 
    -mx-[50vw] w-screen 
    min-h-screen 
    flex flex-col items-center justify-center 
    font-sans text-gray-900 overflow-hidden
  "
        >


            {/* 🟡 Subtle yellow gradient overlay */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-[#F8D280]/60 via-[#F8D280]/30 to-transparent mix-blend-multiply"></div> */}

            {/* ⚙️ Central container */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6 py-16 max-w-7xl sm:px-10">

                {/* 🔹 Top Yellow Box (Unified Dashboard) */}
                <GradientBox
                    text="Unified Dashboard"
                    className="mb-6 lg:absolute lg:top-[-10%] lg:left-1/2 lg:-translate-x-1/2"
                />

                {/* 🎥 Central Video Circle */}
                <div
                    className="flex items-center justify-center w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[345px] lg:h-[345px]
          overflow-hidden rounded-full border-4 border-white/70 bg-gray-900/50 shadow-2xl"
                >
                    <video
                        className="object-cover w-full h-full transform scale-105 rounded-full"
                        src="https://cdn.pixabay.com/video/2024/03/16/205820-916295978_large.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                    ></video>
                </div>

                {/* 🔹 Bottom Yellow Box (Automated Compliance) */}
                <GradientBox
                    text="Automated Compliance"
                    className="mt-8 lg:absolute lg:bottom-[-10%] lg:left-1/2 lg:-translate-x-1/2"
                />

                {/* 🔹 Left Yellow Box (Expert Connect) */}
                <GradientBox
                    text="Expert Connect"
                    className="lg:absolute lg:left-[8%] lg:top-1/2 lg:-translate-y-1/2"
                />

                {/* 🔹 Right Yellow Box (Secure Documents Vault) */}
                <GradientBox
                    text="Secure Documents Vault"
                    className="lg:absolute lg:right-[8%] lg:top-1/2 lg:-translate-y-1/2"
                />
            </div>
        </section>
    );
}

/**
 * 🟨 Gradient Label Box
 */
const GradientBox = ({ text, className }) => (
    <div
        className={`flex items-center justify-center text-center w-[260px] sm:w-[300px] md:w-[340px] h-[100px] 
      bg-gradient-to-r from-[#F8D280] to-[#F8D280]/40 
      rounded-[20px] shadow-lg backdrop-blur-sm text-gray-900 
      hover:scale-105 transition-transform duration-300 ${className}`}
    >
        <span className="text-sm font-bold sm:text-sm md:text-base">{text}</span>
    </div>
);
