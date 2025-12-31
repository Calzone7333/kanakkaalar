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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-center">Forgot Password</h2>
        <form onSubmit={send}>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border border-slate-300 px-3 py-2 rounded focus:ring-[#003366] focus:border-[#003366] outline-none"
            placeholder="you@domain.com"
          />

          <button disabled={loading} className="mt-6 w-full bg-[#003366] text-white py-2 rounded transition-colors hover:bg-[#002244] disabled:bg-slate-400">
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
        {message && <div className="p-3 mt-4 text-sm text-blue-800 rounded bg-blue-50">{message}</div>}
      </div>
    </div>
  );
}
