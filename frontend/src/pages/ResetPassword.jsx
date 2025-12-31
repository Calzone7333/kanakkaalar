import React, { useEffect, useState } from "react";
import { authAPI } from "../lib/api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const e = searchParams.get("email");
    if (e) setEmail(e);
  }, [searchParams]);

  const submit = async (ev) => {
    ev?.preventDefault?.();
    if (!email || !code || !password) return setMessage("Enter all fields");
    if (password !== confirm) return setMessage("Passwords do not match");
    setLoading(true);
    try {
      await authAPI.resetPassword({ email, code, newPassword: password });
      setMessage("Password changed. Redirecting to login...");
      setTimeout(() => nav("/login"), 1000);
    } catch (err) {
      setMessage(err?.response?.data?.error || err?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-center">Reset Password</h2>
        <form onSubmit={submit}>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 mt-2 border rounded" />

          <label className="block mt-4 text-sm font-medium text-slate-700">OTP Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2 mt-2 border rounded" />

          <label className="block mt-4 text-sm font-medium text-slate-700">New Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 mt-2 border rounded" />

          <label className="block mt-4 text-sm font-medium text-slate-700">Confirm Password</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full px-3 py-2 mt-2 border rounded" />

          <button disabled={loading} className="mt-6 w-full bg-[#003366] text-white py-2 rounded">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {message && <div className="mt-3 text-sm text-slate-700">{message}</div>}
      </div>
    </div>
  );
}
