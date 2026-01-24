import React, { useState, useEffect } from "react";
import { authAPI } from "../lib/api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AppBackButton from "../components/AppBackButton";
import { Camera, Loader2, Play, Layout } from "lucide-react";
import { toast } from "react-hot-toast";
import { setAuth } from "../lib/auth";
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

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [localCountries, setLocalCountries] = useState(FALLBACK_COUNTRIES);
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

  const sortedCountryCodes = React.useMemo(() =>
    [...localCountries].sort((a, b) => a.name.localeCompare(b.name)), [localCountries]
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !password) return toast.error("All fields are required");
    if (!isValidEmail(email)) return toast.error("Please enter a valid email");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");

    const fullPhone = `${countryCode} ${phone}`;
    if (!isValidPhone(fullPhone)) return toast.error("Please enter a valid phone number");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", fullPhone);
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

  const signupVector = React.useMemo(() => new URL('../assets/signup_vector.png', import.meta.url).href, []);

  return (
    <div className="h-screen w-full flex font-sans overflow-hidden bg-white">
      <div className="absolute top-6 left-6 z-20">
        <AppBackButton />
      </div>

      {/* Left: Vector Image (Visible on Large Screens) - 50% width */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#e0f2fe] to-[#f1f5f9] flex-col items-center justify-center relative overflow-hidden border-r border-slate-100">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#003366_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]"></div>

        <div className="relative z-10 w-full max-w-md p-10 flex flex-col items-center">
          <img
            src={signupVector}
            alt="Signup Illustration"
            className="w-full h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500 max-h-[500px]"
          />
          <div className="mt-10 text-center">
            <h3 className="text-3xl font-extrabold text-[#003366] mb-3">Join Our Community</h3>
            <p className="text-slate-500 text-base max-w-sm mx-auto leading-relaxed">Experience premium legal & accounting services tailored specifically for your business growth.</p>
          </div>
        </div>
      </div>

      {/* Right: Signup Form - 50% width */}
      <div className="w-full lg:w-1/2 flex flex-col items-center p-4 sm:p-10 relative h-full overflow-y-auto scrollbar-hide bg-gradient-to-bl from-white via-[#f8fafc] to-[#e0f2fe]/40">
        <div className="w-full max-w-[350px] py-6 my-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003366] mb-1">Create Account</h1>
            <p className="text-slate-500 text-xs font-medium">Get started with your free account today</p>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider ml-1">Full Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  className="w-full h-10 border border-slate-200 bg-slate-50/50 rounded-lg px-3 text-xs outline-none focus:border-[#156664] focus:ring-4 focus:ring-[#156664]/5 transition-all font-medium placeholder:text-slate-300"
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full h-10 border border-slate-200 bg-slate-50/50 rounded-lg px-3 text-xs outline-none focus:border-[#156664] focus:ring-4 focus:ring-[#156664]/5 transition-all font-medium placeholder:text-slate-300"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full h-10 border border-slate-200 bg-slate-50/50 rounded-lg px-3 text-xs outline-none focus:border-[#156664] focus:ring-4 focus:ring-[#156664]/5 transition-all font-medium placeholder:text-slate-300"
                  placeholder="Min. 8 characters"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider ml-1">Phone Number</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={loading}
                    className="h-10 w-[90px] border border-slate-200 bg-slate-50/50 rounded-lg px-1 text-[10px] outline-none focus:border-[#156664] cursor-pointer hover:bg-white font-bold text-center"
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
                    disabled={loading}
                    className="h-10 flex-1 min-w-0 border border-slate-200 bg-slate-50/50 rounded-lg px-3 text-xs outline-none focus:border-[#156664] focus:ring-4 focus:ring-[#156664]/5 transition-all font-medium placeholder:text-slate-300"
                    placeholder="Mobile number"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider ml-1">Profile Photo</label>
                <div className="relative">
                  <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <div className="w-full h-10 border border-slate-200 border-dashed bg-slate-50/30 rounded-lg flex items-center justify-center gap-2 text-slate-500 hover:bg-slate-50 transition-all cursor-pointer group">
                    <Camera size={16} className="group-hover:text-[#156664] transition-colors" />
                    <span className="text-xs font-semibold group-hover:text-[#156664] transition-colors">{profileImage ? "File Selected" : "Upload Profile Picture"}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-[#156664] text-white font-bold rounded-lg hover:bg-[#0F4C4A] hover:shadow-lg hover:shadow-[#156664]/30 active:scale-[0.98] transition-all duration-200 mt-3 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Create Account"}
            </button>
          </form>

          <div className="my-5 flex items-center justify-center gap-3">
            <div className="h-[1px] w-full bg-slate-100"></div>
            <span className="text-[9px] uppercase font-bold text-slate-400 whitespace-nowrap">Or continue with</span>
            <div className="h-[1px] w-full bg-slate-100"></div>
          </div>

          <button onClick={() => googleLogin()} type="button" className="w-full h-10 border border-slate-200 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-all font-bold text-slate-700 text-xs">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-4 h-4" />
            <span>Google</span>
          </button>

          <p className="mt-6 text-center text-[10px] text-slate-400 font-medium">
            Already have an account? <Link to="/login" state={location.state} className="text-[#156664] font-bold hover:underline">Log In</Link>
          </p>
        </div>
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
