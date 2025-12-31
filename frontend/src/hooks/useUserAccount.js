import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, setAuth, clearAuth } from "../lib/auth";
import { userAPI } from "../lib/api";

export function useUserAccount() {
  const navigate = useNavigate();
  const initialAuth = getAuth();
  const [user, setUser] = useState(initialAuth?.user || null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  let currentImageObjectUrl = null;

  // If backend stores images as blobs, fetch the image via authenticated endpoint
  useEffect(() => {
    let mounted = true;
    // cleanup previous object URL when user changes
    if (currentImageObjectUrl) {
      try { URL.revokeObjectURL(currentImageObjectUrl); } catch (e) { }
      currentImageObjectUrl = null;
    }

    if (user?.hasProfileImage) {
      (async () => {
        try {
          const resp = await userAPI.profileImage();
          if (!mounted) return;
          const blob = resp.data;
          const url = URL.createObjectURL(blob);
          currentImageObjectUrl = url;
          setProfileImageUrl(url);
        } catch (err) {
          console.error('Failed to load profile image blob', err);
          setProfileImageUrl(null);
        }
      })();
    } else {
      setProfileImageUrl(null);
    }

    return () => {
      mounted = false;
      if (currentImageObjectUrl) {
        try { URL.revokeObjectURL(currentImageObjectUrl); } catch (e) { }
        currentImageObjectUrl = null;
      }
    };
  }, [user]);

  // Fetch latest user data from server on mount (if token present)
  useEffect(() => {
    let mounted = true;
    const token = getAuth()?.token;
    if (!token) {
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const r = await userAPI.me();
        if (!mounted) return;
        const u = r.data;
        const userObj = {
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          phone: u.phone,
          role: u.role || getAuth()?.user?.role,
          hasProfileImage: u.hasProfileImage || false,
        };
        setUser(userObj);
        setAuth({ ...getAuth(), user: userObj });
        try { window.dispatchEvent(new Event('auth:update')); } catch (e) { }
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          clearAuth();
          try { window.location.href = "/login"; } catch (e) { }
        } else {
          console.error("Failed to fetch user profile:", err);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const updateProfile = useCallback(async (formData) => {
    setIsUpdating(true);
    setMessage(null);
    try {
      const r = await userAPI.update(formData);
      const updated = r.data.user;
      const userObj = {
        id: updated.id,
        fullName: updated.fullName,
        email: updated.email,
        phone: updated.phone,
        role: updated.role || user?.role,
        hasProfileImage: updated.hasProfileImage || false,
      };
      setUser(userObj);
      setAuth({ ...getAuth(), user: userObj });
      try { window.dispatchEvent(new Event('auth:update')); } catch (e) { }
      // If backend now has a profile image, fetch the image blob and set URL
      let newImageUrl = null;
      if (userObj.hasProfileImage) {
        try {
          const imgResp = await userAPI.profileImage();
          const blob = imgResp.data;
          const url = URL.createObjectURL(blob);
          setProfileImageUrl(url);
          newImageUrl = url;
        } catch (err) {
          console.error('Failed to fetch updated profile image', err);
        }
      } else {
        setProfileImageUrl(null);
      }
      setMessage(r.data?.message || "Profile updated.");
      return { success: true, newImageUrl };
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        clearAuth();
        try { window.location.href = "/login"; } catch (e) { }
        return { success: false };
      }
      const msg = err?.response?.data?.message || err?.message || "Failed to update profile.";
      setMessage(msg);
      return { success: false };
    } finally {
      setIsUpdating(false);
    }
  }, [user]);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    try { window.dispatchEvent(new Event('auth:update')); } catch (e) { }
    navigate("/");
  }, [navigate]);

  return {
    user,
    isLoading,
    isUpdating,
    message,
    profileImageUrl,
    setProfileImageUrl,
    updateProfile,
    logout,
    setMessage,
  };
}
