import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from '../lib/auth';
import { ArrowRight } from 'lucide-react';

const StartNowButton = () => {
    const navigate = useNavigate();

    const handleStartNow = () => {
        const user = getAuth()?.user;
        if (user) {
            navigate('/dashboard/user/servicehub');
        } else {
            navigate('/login', { state: { redirectTo: '/dashboard/user/servicehub' } });
        }
    };

    return (
        <button
            onClick={handleStartNow}
            className="mt-6 mb-8 px-8 py-3.5 bg-[#C59B4E] text-white font-bold rounded-full shadow-lg hover:bg-[#a37d35] hover:shadow-xl transition-all flex items-center gap-2 group"
        >
            Start Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
    );
};

export default StartNowButton;
