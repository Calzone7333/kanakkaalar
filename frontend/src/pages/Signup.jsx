import React, { useState, useEffect } from "react";
import { authAPI } from "../lib/api";
import { useNavigate, Link } from "react-router-dom";
import AppBackButton from "../components/AppBackButton";
import { Camera, Loader2, Play, Layout } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

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
      await authAPI.requestEmailOtp({ email });
      toast.success("Signup successful! Verify your email.");
      nav(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 font-sans text-slate-800">
      <AppBackButton />

      {/* MAIN CARD CONTAINER */}
      <div className="w-full max-w-[1100px] rounded-[40px]  overflow-hidden flex ">

        {/* LEFT SECTION (FORM) */}
        <div className="w-full lg:w-[45%] p-8 lg:p-10 flex flex-col justify-center">
          <div className="max-w-[400px] w-full mx-auto">
            <h1 className="text-3xl font-extrabold mb-1 tracking-tight">Create account</h1>
            <p className="text-slate-400 text-sm mb-4">Join our 100% free creative network.</p>

            {/* Social Buttons Stacked */}
            <div className="space-y-2 mb-4">
              <button type="button" className="w-full flex items-center justify-center gap-2 border border-slate-200 py-2.5 rounded-lg hover:bg-slate-50 transition-all text-xs font-bold text-slate-700">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-4 h-4" />
                Sign up with Google
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">or</span>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-800 ml-1">Name*</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-800 focus:ring-0 transition-all font-medium placeholder:text-slate-300" placeholder="Enter your name" />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-800 ml-1">Email*</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-800 focus:ring-0 transition-all font-medium placeholder:text-slate-300" placeholder="Enter your email" />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-800 ml-1">Password*</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-800 focus:ring-0 transition-all font-medium placeholder:text-slate-300" placeholder="Create a password" />
              </div>

              {/* Hidden/Compact Fields (Phone/Photo) to match design but keep logic */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 ml-1">Phone*</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-800 focus:ring-0 transition-all font-medium placeholder:text-slate-300" placeholder="Phone" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 ml-1">Profile Photo*</label>
                  <div className="relative">
                    <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs flex items-center gap-2 text-slate-400 font-medium">
                      <Camera size={14} />
                      <span className="truncate">{profileImage ? "Selected" : "Upload"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#1a1a1a] text-white font-bold py-3.5 rounded-lg hover:bg-black transition-all active:scale-[0.98] text-sm mt-3 shadow-lg shadow-black/10">
                {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Sign up"}
              </button>
            </form>

            <p className="mt-4 text-center text-slate-400 text-xs text-[11px]">
              Already have an account? <Link to="/login" className="text-slate-900 font-bold hover:underline underline-offset-2 decoration-2">Log in</Link>
            </p>

            <p className="mt-6 text-center text-[10px] text-slate-300 max-w-[250px] mx-auto leading-relaxed">
              By creating an account, you agree to our <a href="#" className="underline">terms of use</a>.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION (HERO IMAGE) - Precisely matched to mockup layout */}
        <div className="hidden lg:block w-[55%] relative">
          <div className="absolute inset-0">
            <div className="w-full h-full rounded-tr-[40px] rounded-br-[40px] overflow-hidden relative shadow-inner">
              <img
                src="/assets/images/signup_lifestyle.png"
                alt="Hero"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Hero Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

              {/* Floating Badges */}
              <div className="absolute top-[28%] right-[15%] animate-float-slow">
                <GlassBadge name="Amelia Lund" handle="@ameliaaaa" location="Sydney, Australia" seed="Amelia" />
              </div>
              <div className="absolute bottom-[40%] left-[10%] animate-float-delayed">
                <GlassBadge name="Alex Herman" handle="@alexdraws" location="Melbourne, Australia" seed="Alex" />
              </div>

              <div className="absolute bottom-12 left-12 right-12 z-10">
                <h2 className="text-[42px] leading-[1.1] font-extrabold text-white mb-8 drop-shadow-md">
                  Join <span className="font-serif italic font-normal">the</span> world's <span className="font-serif italic underline decoration-white/30 font-normal">largest</span> network <span className="font-light opacity-80">of designers and digital creatives</span>
                </h2>

                <div className="flex gap-3">
                  <FeatureCard icon={<Play size={12} className="fill-white" />} text="Join and get inspired by 100k+ designers" />
                  <FeatureCard icon={<Layout size={12} />} text="Share your design work & get hired" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlassBadge({ name, handle, location, seed }) {
  return (
    <div className="bg-white/20 backdrop-blur-md border border-white/20 p-2.5 pr-4 rounded-xl flex items-center gap-3 text-white shadow-lg shadow-black/5 transform transition-transform hover:scale-105 cursor-default">
      <div className="w-8 h-8 rounded-full border-2 border-white/60 overflow-hidden bg-white/10 shrink-0">
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt="Avatar" className="w-full h-full object-cover" />
      </div>
      <div>
        <div className="flex items-center gap-1.5 leading-none mb-0.5">
          <span className="text-[10px] font-bold">{name}</span>
          <span className="text-[8px] opacity-70">{handle}</span>
        </div>
        <div className="flex items-center gap-1 opacity-60">
          <div className="w-1 h-1 rounded-full bg-white"></div>
          <span className="text-[8px]">{location}</span>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, text }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-xl flex items-center gap-3 text-white flex-1 hover:bg-white/15 transition-colors cursor-default group">
      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-[10px] font-bold leading-snug opacity-90">{text}</p>
    </div>
  );
}

function XIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
    </svg>
  );
}
