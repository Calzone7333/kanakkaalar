import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

export default function AppBackButton({ className = "", absolute = true }) {
    const navigate = useNavigate();
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        // Check if running in a native app environment
        const isNative = Capacitor.isNativePlatform();
        const isElectron = navigator.userAgent.toLowerCase().includes('electron');

        // Show ONLY if Native (Android/iOS) or Electron (Desktop App)
        if (isNative || isElectron) {
            setShowButton(true);
        }
    }, []);

    if (!showButton) return null;

    return (
        <button
            onClick={() => navigate(-1)}
            className={`z-50 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md text-slate-700 hover:bg-white hover:text-[#003366] transition-all ${absolute ? 'absolute top-4 left-4' : ''} ${className}`}
            aria-label="Go Back"
        >
            <ArrowLeft size={24} />
        </button>
    );
}
