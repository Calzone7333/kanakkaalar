import React, { useEffect, useState } from "react";
import { authAPI } from "../lib/api";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const verify = async (e) => {
    e?.preventDefault?.();
    if (!email || !code) return setMessage("Enter email and code");
    setLoading(true);
    try {
      await authAPI.verifyEmail({ email, code });
      setMessage("Email verified. You can now login.");
      setTimeout(() => nav("/login", { state: location.state }), 1200);
    } catch (err) {
      setMessage(err?.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!email) return setMessage("Enter your email to resend OTP");
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      const res = await authAPI.requestEmailOtp({ email });
      setMessage("Verification code sent to your email.");
      setResendCooldown(30); // 30 seconds cooldown
    } catch (err) {
      setMessage(err?.response?.data?.error || "Could not send OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 relative p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative">
        <h2 className="mb-2 text-2xl font-bold text-center text-[#003366]">Verify Email 📧</h2>
        <p className="mb-6 text-sm text-center text-slate-500">
          We've sent a code to <span className="font-semibold text-slate-700">{email}</span>.
          Enter it below to verify your account.
        </p>

        <form onSubmit={verify} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all bg-slate-50"
              placeholder="you@domain.com"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Verification Code (OTP)
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all text-center text-2xl tracking-[0.5em] font-bold text-[#003366]"
              placeholder="• • • • • •"
              maxLength={6}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#003366] text-white py-3 rounded-xl font-semibold shadow-md hover:bg-[#002244] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={resendOtp}
              disabled={loading || resendCooldown > 0}
              className={`w-full py-2 text-sm font-medium transition-colors ${resendCooldown > 0
                ? "text-slate-400 cursor-not-allowed"
                : "text-[#003366] hover:text-[#002244] hover:underline"
                }`}
            >
              {resendCooldown > 0
                ? `Resend code in 00:${resendCooldown.toString().padStart(2, "0")}`
                : "Didn't receive code? Resend"}
            </button>

            <button
              type="button"
              onClick={() => nav("/login", { state: location.state })}
              className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`mt-6 p-3 rounded-lg text-sm text-center font-medium animate-pulse ${message.toLowerCase().includes("success") || message.toLowerCase().includes("verified")
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-red-50 text-red-700 border border-red-100"
              }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
