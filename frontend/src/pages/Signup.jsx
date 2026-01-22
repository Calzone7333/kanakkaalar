import React, { useState, useEffect } from "react";
import { authAPI } from "../lib/api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AppBackButton from "../components/AppBackButton";
import { Camera, Loader2, Play, Layout } from "lucide-react";
import { toast } from "react-hot-toast";
import { setAuth } from "../lib/auth";
import { useGoogleLogin } from "@react-oauth/google";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const location = useLocation();

  const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);
  const isValidPhone = (v) => /^[0-9+\-() ]{7,20}$/.test(v);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); };
  }, [imagePreview]);

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
        toast.error(err?.response?.data?.message || "Google Signup Failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error("Google Signup Failed"),
  });

  const submit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !password) return toast.error("All fields are required");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      if (profileImage) formData.append("profileImage", profileImage);

      await authAPI.signup(formData);
      toast.success("Signup successful! Verify your email.");
      nav(`/verify-otp?email=${encodeURIComponent(email)}`, { state: location.state });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative font-sans text-slate-800 bg-[#f8fafc]">
      <AppBackButton />

      {/* Centered Popup Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 relative z-10 mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#003366] tracking-tight">Create Account</h1>
          <p className="text-slate-500 text-xs mt-2">Join our network for free.</p>
        </div>

        <form onSubmit={submit} className="space-y-3 mb-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 ml-1">Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] transition-all font-medium placeholder:text-slate-300"
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] transition-all font-medium placeholder:text-slate-300"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] transition-all font-medium placeholder:text-slate-300"
              placeholder="Create a password"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 ml-1">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] transition-all font-medium placeholder:text-slate-300"
                placeholder="Phone"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 ml-1">Photo</label>
              <div className="relative">
                <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="w-full border border-slate-300 rounded-lg px-3 py-2 text-[10px] flex items-center justify-center gap-2 text-slate-500 font-medium hover:bg-slate-50 transition-colors">
                  <Camera size={14} />
                  <span className="truncate">{profileImage ? "Selected" : "Upload"}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#156664] text-white font-bold py-2.5 rounded-lg hover:bg-[#11504f] transition-all active:scale-[0.98] text-xs mt-3 shadow-md shadow-[#156664]/20"
          >
            {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Sign up"}
          </button>
        </form>

        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <span className="relative bg-white px-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">or</span>
        </div>

        {/* Social Login */}
        <button onClick={() => googleLogin()} type="button" className="w-full flex items-center justify-center gap-2 border border-slate-200 py-2 rounded-lg hover:bg-slate-50 transition-all text-xs font-bold text-slate-700 mb-2">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-4 h-4" />
          Sign up with Google
        </button>

        <p className="mt-6 text-center text-slate-500 text-xs">
          Existing User? <Link to="/login" state={location.state} className="text-[#156664] font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

// Helper components intentionally removed as they are no longer used in the centered card design
function XIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
    </svg>
  );
}
