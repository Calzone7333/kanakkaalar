import React, { useState, useEffect } from "react";
import { authAPI } from "../lib/api";
import { useNavigate, Link } from "react-router-dom";
import AppBackButton from "../components/AppBackButton";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [signupComplete, setSignupComplete] = useState(false);
  const nav = useNavigate();

  // Validation helpers
  const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);
  const isValidPhone = (v) => /^[0-9+\-() ]{7,20}$/.test(v); // Match backend validation

  const handleImageChange = (e) => {
    setMessage(null); // Clear previous messages
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
      if (!allowedTypes.includes(file.type)) {
        setMessage("Invalid file type. Please select a PNG, JPG, or SVG image.");
        setProfileImage(null);
        setImagePreview(null);
        return;
      }

      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Effect to clean up the object URL to prevent memory leaks
  useEffect(() => {
    // This function will be called when the component unmounts or the preview changes
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Frontend validation
    if (!fullName || !email || !phone || !password) {
      return setMessage("All fields are required");
    }
    if (fullName.length < 2 || fullName.length > 100) {
      return setMessage("Full name must be between 2 and 100 characters");
    }
    if (!isValidEmail(email)) return setMessage("Enter a valid email");
    if (!isValidPhone(phone)) return setMessage("Enter a valid phone number");
    if (password.length < 8)
      return setMessage("Password must be at least 8 characters");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      // Create account on backend
      await authAPI.signup(formData);

      // Request OTP for email verification (sent via email only)
      try {
        await authAPI.requestEmailOtp({ email });
      } catch (e) {
        console.warn("Could not send OTP email:", e?.message || e);
      }

      setMessage("Signup successful! We've sent a verification code to your email.");
      setSignupComplete(true);

      // Clear password field
      setPassword("");

      // Redirect user to verification page with email pre-filled
      nav(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setMessage(
        err?.response?.data?.error || err?.response?.data?.message || "Signup failed. Try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      <AppBackButton />
      <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
        <h2 className="mb-6 text-xl font-semibold text-center">
          Create New Account
        </h2>

        <form onSubmit={submit}>
          <div className="flex flex-col items-center mb-4">
            <label
              htmlFor="profile-image-upload"
              className="cursor-pointer"
            >
              <img
                src={
                  imagePreview ||
                  "https://via.placeholder.com/100?text=Avatar"
                }
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-slate-300"
              />
            </label>
            <input
              id="profile-image-upload"
              type="file"
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={handleImageChange}
              className="hidden"
              disabled={loading}
            />
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
            className="mt-2 w-full border border-slate-300 px-3 py-2 rounded focus:ring-[#003366] focus:border-[#003366] outline-none disabled:bg-slate-100"
            placeholder="John Doe"
          />

          <label className="block mt-4 text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="mt-2 w-full border border-slate-300 px-3 py-2 rounded focus:ring-[#003366] focus:border-[#003366] outline-none disabled:bg-slate-100"
            placeholder="you@example.com"
          />

          <label className="block mt-4 text-sm font-medium text-slate-700">
            Phone
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            className="mt-2 w-full border border-slate-300 px-3 py-2 rounded focus:ring-[#003366] focus:border-[#003366] outline-none disabled:bg-slate-100"
            placeholder="9876543210"
          />

          <label className="block mt-4 text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="mt-2 w-full border border-slate-300 px-3 py-2 rounded focus:ring-[#003366] focus:border-[#003366] outline-none disabled:bg-slate-100"
            placeholder="Min 8 chars"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#003366] text-white py-2 rounded hover:bg-[#002244] disabled:bg-slate-400 transition-colors"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-2 text-center text-sm rounded ${message.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}
          >
            {message}
          </div>
        )}

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-[#003366] font-medium hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
