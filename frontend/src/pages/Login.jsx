import React, { useState } from "react";
import { authAPI } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { setAuth } from "../lib/auth";
import AppBackButton from "../components/AppBackButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [mode, setMode] = useState("password");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [showResetLink, setShowResetLink] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const nav = useNavigate();

  const location = useLocation(); // Make sure to import this at top

  // 🔹 Login with email & password
  const loginPassword = async (e) => {
    e.preventDefault();
    if (!email || !password) return setMessage("Enter email and password");
    setLoading(true);
    try {
      const r = await authAPI.login({ email, password });
      setAuth(r.data); // Use setAuth to store the entire auth object
      window.dispatchEvent(new Event("auth:update"));

      // Browser save password prompt (built-in)
      // Works automatically when autocomplete is on and successful login happens

      const role = r.data.user?.role || "USER";

      // 🔄 Redirect logic
      if (location.state?.redirectTo && role === "USER") {
        // Pass forward the state (like serviceTitle)
        return nav(location.state.redirectTo, { replace: true, state: location.state });
      }

      if (role === "ADMIN") nav("/dashboard/admin", { replace: true });
      else if (role === "EMPLOYEE") nav("/dashboard/employee", { replace: true });
      else if (role === "AGENT") nav("/dashboard/agent", { replace: true });
      else nav("/dashboard/user", { replace: true });
    } catch (err) {
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed";
      setMessage(errMsg);
      const status = err?.response?.status;
      const isInvalid =
        status === 401 || /invalid|incorrect|credentials|not found/i.test(errMsg);
      setShowResetLink(isInvalid);
      if (/email not verified/i.test(errMsg)) {
        return nav(`/verify-otp?email=${encodeURIComponent(email)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Phone OTP login
  const sendPhoneOtp = async (e) => {
    e.preventDefault();
    if (!/^[0-9+\-() ]{7,20}$/.test(phone))
      return setMessage("Enter a valid phone number");
    setLoading(true);
    try {
      const res = await authAPI.loginPhone({ phone });
      setGeneratedOtp(res.data.code || "");
      setOtpSent(true);
      setMessage("OTP sent successfully!");
    } catch (err) {
      setMessage(err?.response?.data?.error || err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async (e) => {
    e.preventDefault();
    if (!otp) return setMessage("Enter OTP");
    setLoading(true);
    try {
      const r = await authAPI.verifyPhone({ phone, code: otp });
      setAuth(r.data); // Use setAuth to store the entire auth object
      window.dispatchEvent(new Event("auth:update"));
      const role = r.data.user?.role || "USER";

      // 🔄 Redirect logic
      if (location.state?.redirectTo && role === "USER") {
        return nav(location.state.redirectTo, { replace: true, state: location.state });
      }

      if (role === "ADMIN") nav("/dashboard/admin", { replace: true });
      else if (role === "EMPLOYEE") nav("/dashboard/employee", { replace: true });
      else if (role === "AGENT") nav("/dashboard/agent", { replace: true });
      else nav("/dashboard/user", { replace: true });
    } catch (err) {
      setMessage(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <AppBackButton />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl"
      >
        <h2 className="mb-6 text-3xl font-bold text-center text-[#003366]">
          Welcome Back 👋
        </h2>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            className={`flex-1 py-2 rounded-lg font-medium transition ${mode === "password"
              ? "bg-[#003366] text-white shadow-md"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            onClick={() => {
              setMode("password");
              setOtpSent(false);
              setMessage(null);
            }}
          >
            Email Login
          </button>
          <button
            className={`flex-1 py-2 rounded-lg font-medium transition ${mode === "phone"
              ? "bg-[#003366] text-white shadow-md"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            onClick={() => {
              setMode("phone");
              setMessage(null);
            }}
          >
            Phone OTP
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "password" ? (
            // 🔸 EMAIL LOGIN FORM
            <motion.form
              key="password-login"
              onSubmit={loginPassword}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="space-y-4"
              autoComplete="on"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full border border-slate-300 px-3 py-2 rounded-lg focus:ring-[#003366] focus:border-[#003366] outline-none"
                  placeholder="you@example.com"
                  name="username"
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full border border-slate-300 px-3 py-2 rounded-lg focus:ring-[#003366] focus:border-[#003366] outline-none"
                  placeholder="Your password"
                  name="current-password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#003366] text-white py-2 rounded-lg transition-all hover:bg-[#002244] disabled:bg-slate-400 shadow-md"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </motion.form>
          ) : (
            // 🔸 PHONE LOGIN FORM
            <motion.form
              key="phone-login"
              onSubmit={otpSent ? verifyPhoneOtp : sendPhoneOtp}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={otpSent}
                  className={`mt-1 w-full border border-slate-300 px-3 py-2 rounded-lg focus:ring-[#003366] focus:border-[#003366] outline-none ${otpSent ? "bg-slate-50" : ""
                    }`}
                  placeholder="e.g. 9876543210"
                />
              </div>

              {otpSent && (
                <>
                  <label className="block text-sm font-medium text-slate-700">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:ring-[#003366] focus:border-[#003366] outline-none text-center text-2xl tracking-widest"
                    placeholder="000000"
                  />
                  {generatedOtp && (
                    <div className="p-3 text-sm text-center text-blue-800 border border-blue-200 rounded-lg bg-blue-50">
                      OTP: <span className="font-bold text-[#003366]">{generatedOtp}</span>
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#003366] text-white py-2 rounded-lg transition-all hover:bg-[#002244] disabled:bg-slate-400 shadow-md"
              >
                {loading
                  ? otpSent
                    ? "Verifying..."
                    : "Sending..."
                  : otpSent
                    ? "Verify OTP"
                    : "Send OTP"}
              </button>

              {otpSent && (
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setGeneratedOtp(null);
                    setMessage(null);
                  }}
                  className="w-full border border-[#003366] text-[#003366] py-2 rounded-lg transition-all hover:bg-blue-50"
                >
                  Use Different Phone
                </button>
              )}
            </motion.form>
          )}
        </AnimatePresence>

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-5 p-3 rounded-lg text-sm text-center shadow-sm ${message.includes("success") || message.includes("sent")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
              }`}
          >
            {message}
            {showResetLink && mode === "password" && (
              <div className="mt-3 text-sm">
                <Link
                  to={`/forgot-password?email=${encodeURIComponent(email)}`}
                  className="text-[#003366] font-medium hover:underline"
                >
                  Forgot password? Reset here
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
