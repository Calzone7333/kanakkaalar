import React, { useEffect, useState } from "react";
import { authAPI } from "../lib/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Key, Eye, EyeOff, Mail, ShieldCheck } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    <div className="flex items-center justify-center min-h-screen bg-slate-50 relative p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-50 rounded-full">
            <ShieldCheck size={32} className="text-[#003366]" />
          </div>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-center text-[#003366]">Reset Password</h2>
        <p className="mb-8 text-sm text-center text-slate-500">
          Create a strong password for your account.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed outline-none"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              OTP Code
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all tracking-widest font-mono text-[#003366] font-bold"
                placeholder="• • • • • •"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all"
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all"
                placeholder="Re-enter password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#003366] text-white py-3 rounded-xl font-semibold shadow-md hover:bg-[#002244] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
          >
            {loading ? "Resetting..." : "Set New Password"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 p-3 rounded-lg text-sm text-center font-medium animate-pulse border ${message.toLowerCase().includes("success") || message.toLowerCase().includes("changed")
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
              }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
