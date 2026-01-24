import React, { useState, useEffect } from "react";
import { authAPI } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { setAuth } from "../lib/auth";
import AppBackButton from "../components/AppBackButton";
import { useGoogleLogin } from "@react-oauth/google";

const FALLBACK_COUNTRIES = [
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "Malaysia", code: "+60", flag: "🇲🇾" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Sri Lanka", code: "+94", flag: "🇱🇰" },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [localCountries, setLocalCountries] = useState(FALLBACK_COUNTRIES);
  const [otp, setOtp] = useState("");
  const [mode, setMode] = useState("password");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [showResetLink, setShowResetLink] = useState(false);
  const nav = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,idd,flag,cca2");
        if (!response.ok) throw new Error("API Failed");
        const data = await response.json();

        const mapped = data.map(c => {
          const root = c.idd?.root || "";
          const suffix = c.idd?.suffixes?.[0] || "";
          return {
            name: c.name?.common || "Unknown",
            code: root + suffix,
            iso: c.cca2 || "",
            flag: c.flag || "🏳️"
          };
        }).filter(c => c.code && c.code.length > 1);

        if (mapped.length > 0) {
          setLocalCountries(mapped);
        }
      } catch (err) {
        console.error("CORS or API issue, using fallback:", err.message);
      }
    };
    fetchCountries();
  }, []);

  const sortedCountryCodes = React.useMemo(() =>
    [...localCountries].sort((a, b) => a.name.localeCompare(b.name)), [localCountries]
  );

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
    const fullPhone = `${countryCode} ${phone}`;
    if (!/^[0-9+\-() ]{7,20}$/.test(fullPhone))
      return setMessage("Enter a valid phone number");
    setLoading(true);
    try {
      const res = await authAPI.loginPhone({ phone: fullPhone });
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
      const fullPhone = `${countryCode} ${phone}`;
      const r = await authAPI.verifyPhone({ phone: fullPhone, code: otp });
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

  // 🔹 Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const r = await authAPI.loginGoogle(tokenResponse.access_token);
        setAuth(r.data);
        window.dispatchEvent(new Event("auth:update"));
        const role = r.data.user?.role || "USER";

        if (location.state?.redirectTo && role === "USER") {
          return nav(location.state.redirectTo, { replace: true, state: location.state });
        }

        if (role === "ADMIN") nav("/dashboard/admin", { replace: true });
        else if (role === "EMPLOYEE") nav("/dashboard/employee", { replace: true });
        else if (role === "AGENT") nav("/dashboard/agent", { replace: true });
        else nav("/dashboard/user", { replace: true });

      } catch (err) {
        setMessage(err?.response?.data?.message || "Google Login Failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setMessage("Google Login Failed"),
  });

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <AppBackButton />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-sm p-4 sm:p-6 bg-white shadow-2xl rounded-2xl"
      >
        <h2 className="mb-6 text-2xl font-bold text-center text-[#156664]">
          Welcome Back 👋
        </h2>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition ${mode === "password"
              ? "bg-[#156664] text-white shadow-md"
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
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition ${mode === "phone"
              ? "bg-[#156664] text-white shadow-md"
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
              className="space-y-3"
              autoComplete="on"
            >
              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full border border-slate-300 px-3 py-2 text-sm rounded-lg focus:ring-[#156664] focus:border-[#156664] outline-none"
                  placeholder="you@example.com"
                  name="username"
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full border border-slate-300 px-3 py-2 text-sm rounded-lg focus:ring-[#156664] focus:border-[#156664] outline-none"
                  placeholder="Your password"
                  name="current-password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#156664] text-white py-2 rounded-lg transition-all hover:bg-[#11504f] disabled:bg-slate-400 shadow-md"
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
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Phone
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={otpSent || loading}
                    className="mt-1 h-[38px] w-[80px] border border-slate-300 bg-white rounded-lg px-1 text-xs outline-none focus:border-[#156664] transition-all font-bold cursor-pointer hover:bg-slate-50 appearance-none text-center"
                  >
                    {sortedCountryCodes.map((c) => (
                      <option key={c.name + c.iso} value={c.code}>
                        {c.iso} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={otpSent}
                    className={`mt-1 flex-1 min-w-0 border border-slate-300 px-3 py-2 text-sm rounded-lg focus:ring-[#156664] focus:border-[#156664] outline-none ${otpSent ? "bg-slate-50" : ""
                      }`}
                    placeholder="9876543210"
                  />
                </div>
              </div>

              {otpSent && (
                <>
                  <label className="block text-xs font-medium text-slate-700">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:ring-[#156664] focus:border-[#156664] outline-none text-center text-xl tracking-widest"
                    placeholder="000000"
                  />
                  {generatedOtp && (
                    <div className="p-3 text-sm text-center text-blue-800 border border-blue-200 rounded-lg bg-blue-50">
                      OTP: <span className="font-bold text-[#156664]">{generatedOtp}</span>
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#156664] text-white py-2 rounded-lg transition-all hover:bg-[#11504f] disabled:bg-slate-400 shadow-md"
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
                  className="w-full border border-[#156664] text-[#156664] py-2 rounded-lg transition-all hover:bg-blue-50"
                >
                  Use Different Phone
                </button>
              )}
            </motion.form>
          )}
        </AnimatePresence>

        <div className="relative flex items-center justify-center mb-4 mt-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <span className="relative bg-white px-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">or</span>
        </div>

        {/* Social Login */}
        <button onClick={() => googleLogin()} type="button" className="w-full flex items-center justify-center gap-2 border border-slate-200 py-2 rounded-lg hover:bg-slate-50 transition-all text-xs font-bold text-slate-700 mb-2">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-4 h-4 text-purple-600" />
          Sign in with Google
        </button>

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
                  className="text-[#156664] font-medium hover:underline"
                >
                  Forgot password? Reset here
                </Link>
              </div>
            )}
          </motion.div>
        )}

        <p className="mt-6 text-center text-slate-500 text-xs">
          New here? <Link to="/signup" state={location.state} className="text-[#156664] font-bold hover:underline">Create an account</Link>
        </p>
      </motion.div>
    </div>
  );
}
