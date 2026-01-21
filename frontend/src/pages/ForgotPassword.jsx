import React, { useState } from "react";
import { authAPI } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const nav = useNavigate();

  const send = async (e) => {
    e?.preventDefault?.();
    if (!email || !/\S+@\S+\.\S+/.test(email)) return setMessage("Enter a valid email");
    setLoading(true);
    try {
      await authAPI.requestEmailOtp({ email });
      setMessage("OTP sent to your email. Check your inbox.");
      setTimeout(() => nav(`/reset-password?email=${encodeURIComponent(email)}`), 900);
    } catch (err) {
      setMessage(err?.response?.data?.error || err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white relative overflow-hidden font-sans">

      {/* Decorative Wave - Top Right */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px]">
        <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M188.5 0H500V400C500 400 384 345 350 250C316 155 188.5 0 188.5 0Z" fill="#1A7F7D" fillOpacity="0.1" />
          <path d="M300 0H500V200C500 200 450 150 400 100C350 50 300 0 300 0Z" fill="#1A7F7D" fillOpacity="0.8" />
        </svg>
      </div>

      {/* Decorative Wave - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px]">
        <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 400H300C300 400 150 350 100 200C50 50 0 0 0 0V400Z" fill="#1A7F7D" fillOpacity="0.1" />
          <path d="M0 400H200C200 400 100 350 50 250C0 150 0 400 0 400Z" fill="#1A7F7D" fillOpacity="0.8" />
        </svg>
      </div>

      <div className="w-full max-w-5xl h-[600px] flex z-10 mx-4">

        {/* LEFT SECTION: Illustration */}
        <div className="hidden md:flex w-1/2 items-center justify-center relative">
          {/* Connecting dots element (subtle) */}
          <div className="absolute top-20 left-10 text-[#1A7F7D] opacity-20 text-4xl font-bold">?</div>
          <div className="absolute bottom-40 right-20 text-[#1A7F7D] opacity-20 text-3xl font-bold">?</div>

          <div className="w-[80%] h-auto relative">
            <img
              src="https://img.freepik.com/free-vector/law-firm-concept-illustration_114360-4416.jpg"
              alt="Filing and Law Illustration"
              className="w-full h-full object-contain mix-blend-multiply"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1095.jpg"; // Fallback
              }}
            />
          </div>
        </div>

        {/* RIGHT SECTION: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-12">
            <h2 className="text-4xl font-extrabold text-[#2C3E50] mb-3 leading-snug">
              Forgot <br /> Your Password ?
            </h2>
          </div>

          <form onSubmit={send} className="space-y-8 w-full max-w-[380px]">
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 border-b-2 border-slate-200 outline-none focus:border-[#1A7F7D] transition-colors bg-transparent placeholder-transparent text-slate-700 peer text-lg"
                placeholder="Email Address"
                id="emailInput"
                required
              />
              <label
                htmlFor="emailInput"
                className="absolute left-0 top-3 text-slate-400 text-base transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#1A7F7D] cursor-text font-medium"
              >
                Email Address
              </label>
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#1A7F7D] text-white py-4 rounded-full font-bold shadow-lg hover:bg-[#13605E] transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-sm mt-4"
            >
              {loading ? "Sending..." : "Reset Password"}
            </button>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => nav("/login")}
                className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
              >
                Back to signin
              </button>
            </div>
          </form>

          {message && (
            <div
              className={`mt-8 p-4 rounded-lg text-sm text-center font-bold animate-pulse ${message.toLowerCase().includes("sent") || message.toLowerCase().includes("success")
                  ? "bg-[#E0F2F1] text-[#1A7F7D] border border-[#1A7F7D]/20"
                  : "bg-red-50 text-red-700 border border-red-100"
                }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
