import React, { useEffect, useState } from "react";
import { authAPI } from "../lib/api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchParams] = useSearchParams();
  const nav = useNavigate();

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
      setTimeout(() => nav("/login"), 1200);
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
      if (res.data?.code) {
        setMessage(`Verification code sent (Dev: ${res.data.code})`);
      } else {
        setMessage("Verification code sent to your email.");
      }
      setResendCooldown(30); // 30 seconds cooldown
    } catch (err) {
      setMessage(err?.response?.data?.error || "Could not send OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded shadow">
      <h2 className="mb-4 text-xl font-semibold">Verify Email</h2>
      <form onSubmit={verify}>
        <label className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 mt-2 border rounded"
          placeholder="you@domain.com"
        />
        <label className="block mt-4 text-sm font-medium text-slate-700">
          OTP Code
        </label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-3 py-2 mt-2 border rounded"
          placeholder="6-digit code"
        />
        <button
          disabled={loading}
          className="mt-4 w-full bg-[#003366] text-white py-2 rounded"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <div className="flex items-center justify-between gap-4 mt-3">
          <button
            type="button"
            onClick={resendOtp}
            disabled={loading || resendCooldown > 0}
            className={`flex-1 py-2 rounded border text-sm ${resendCooldown > 0 ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-white text-[#003366] border-[#003366] hover:bg-blue-50'}`}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
          </button>

          <button
            type="button"
            onClick={() => nav('/login')}
            className="flex-1 py-2 text-sm bg-white border border-gray-200 rounded"
          >
            Back to Login
          </button>
        </div>
      </form>
      {message && <div className="mt-3 text-sm text-slate-600">{message}</div>}
    </div>
  );
}
