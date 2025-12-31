import axios from "axios";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function ok(data, status = 200) {
  return {
    data,
    status,
    statusText: "OK",
    headers: {},
    config: {},
    request: {},
  };
}

// --- Notification Helpers (for mock) ---
function getStoredNotifications() {
  try {
    const raw = localStorage.getItem("mock_notifications");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStoredNotifications(notifications) {
  localStorage.setItem("mock_notifications", JSON.stringify(notifications));
}

function addNotification(notification) {
  const notifications = getStoredNotifications();
  const newNotification = { id: Date.now(), ...notification, time: new Date().toISOString(), read: false };
  notifications.unshift(newNotification); // Add to the top
  setStoredNotifications(notifications);
}

function err(status, message) {
  const error = new Error(message || "Request failed");
  error.response = {
    status,
    statusText: message || "Error",
    data: { error: message || "Error" },
    headers: {},
    config: {},
    request: {},
  };
  return Promise.reject(error);
}

function safeParse(data) {
  if (!data) return {};
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  if (typeof data === "object") return data;
  return {};
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem("auth_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user) {
  localStorage.setItem("auth_user", JSON.stringify(user));
}

function setToken(token) {
  localStorage.setItem("auth_token", token);
}

// OTP storage helpers (with TTL)
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

function otpKey(kind, id) {
  return `otp:${kind}:${(id || "").toLowerCase()}`;
}

function setOtp(kind, id, code) {
  const payload = { code: String(code), expiresAt: Date.now() + OTP_TTL_MS };
  localStorage.setItem(otpKey(kind, id), JSON.stringify(payload));
}

function getOtp(kind, id) {
  try {
    const raw = localStorage.getItem(otpKey(kind, id));
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || !obj.code || !obj.expiresAt) return null;
    if (Date.now() > obj.expiresAt) {
      localStorage.removeItem(otpKey(kind, id));
      return null;
    }
    return obj.code;
  } catch {
    return null;
  }
}

function clearOtp(kind, id) {
  localStorage.removeItem(otpKey(kind, id));
}

function generateOtp(length = 6) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

axios.defaults.adapter = async function mockAdapter(config) {
  const url = config.url || "";
  const method = (config.method || "get").toLowerCase();

  if (!url.startsWith("/api/")) {
    return err(404, "API disabled in mock mode");
  }

  await sleep(200);

  // Auth endpoints (password login)
  if (url === "/api/auth/login" && method === "post") {
    const { email, password } = safeParse(config.data);
    if (!email || !password) return err(400, "Email and password required");
    const existing = getStoredUser();
    const user = existing || {
      id: "1",
      email: email.toLowerCase(),
      name: "Demo User",
      phone: "+919999999999",
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    setStoredUser(user);
    setToken("mock-token");
    return ok({ token: "mock-token", user });
  }

  // Signup (store user locally and mark unverified)
  if (url === "/api/auth/signup" && method === "post") {
    const { fullName, name, email, password, phone } = safeParse(config.data);
    if (!email || !password) return err(400, "Email and password required");
    const user = {
      id: "1",
      email: String(email).toLowerCase(),
      name: fullName || name || "",
      phone: phone || "",
      isVerified: false,
      createdAt: new Date().toISOString(),
    };
    setStoredUser(user);

    // Add a notification for the admin
    addNotification({
      message: `New user "${user.name || user.email}" has signed up.`,
    });

    return ok({ message: "Signup successful (mock)." });
  }

  // Email OTP: request/send
  if (url === "/api/auth/request-email-otp" && method === "post") {
    const { email } = safeParse(config.data);
    if (!email || !/\S+@\S+\.\S+/.test(email)) return err(400, "Valid email required");
    const code = generateOtp();
    setOtp("email", email, code);
    // Simulate email send by logging the OTP
    console.info(`[mock-email] OTP to ${email}: ${code}`);
    return ok({ message: "OTP sent to email" });
  }

  // Email OTP: verify
  if (url === "/api/auth/verify-email" && method === "post") {
    const { email, code } = safeParse(config.data);
    if (!email || !code) return err(400, "Email and code required");
    const stored = getOtp("email", email);
    if (!stored) return err(400, "OTP expired or not found");
    if (String(code) !== String(stored)) return err(400, "Invalid code");
    clearOtp("email", email);
    const u = getStoredUser();
    if (u) {
      u.isVerified = true;
      setStoredUser(u);
    }
    return ok({ message: "Email verified" });
  }

  // Password reset via email OTP
  if (url === "/api/auth/reset-password" && method === "post") {
    const { email, code, newPassword } = safeParse(config.data);
    if (!email || !code || !newPassword) return err(400, "Email, code and new password required");
    const stored = getOtp("email", email);
    if (!stored) return err(400, "OTP expired or not found");
    if (String(code) !== String(stored)) return err(400, "Invalid code");
    clearOtp("email", email);
    const u = getStoredUser() || {
      id: "1",
      email: String(email).toLowerCase(),
      name: "",
      phone: "",
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    // Store a new password field for demo purposes
    u.password = String(newPassword);
    setStoredUser(u);
    return ok({ message: "Password reset" });
  }

  // Phone OTP: request
  if (url === "/api/auth/login-phone" && method === "post") {
    const { phone } = safeParse(config.data);
    if (!phone || !/^[0-9]{7,15}$/.test(String(phone))) return err(400, "Valid phone required");
    const code = generateOtp();
    setOtp("phone", phone, code);
    console.info(`[mock-sms] OTP to ${phone}: ${code}`);
    return ok({ message: "OTP sent" });
  }

  // Phone OTP: verify
  if (url === "/api/auth/verify-phone" && method === "post") {
    const { phone, code } = safeParse(config.data);
    if (!phone || !code) return err(400, "Phone and code required");
    const stored = getOtp("phone", phone);
    if (!stored) return err(400, "OTP expired or not found");
    if (String(code) !== String(stored)) return err(400, "Invalid code");
    clearOtp("phone", phone);
    const existing = getStoredUser();
    const user = existing || {
      id: "1",
      email: "user@example.com",
      name: "Demo User",
      phone: String(phone),
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    setStoredUser(user);
    setToken("mock-token");
    return ok({ token: "mock-token", user });
  }

  // User
  if (url === "/api/user/me" && method === "get") {
    const auth =
      config.headers &&
      (config.headers.Authorization || config.headers.authorization);
    if (!auth) return err(401, "Missing token");
    const user = getStoredUser();
    if (!user) return err(404, "User not found");
    return ok(user);
  }

  // Leads (demo)
  if (url === "/api/leads" && method === "get") {
    const leads = [
      { id: 1, name: "Alice", service: "GST Registration", status: "New" },
      { id: 2, name: "Bob", service: "Trademark", status: "In Progress" },
      { id: 3, name: "Charlie", service: "MSME", status: "Closed" },
    ];
    return ok({ leads });
  }

  // Notifications (demo)
  if (url === "/api/notifications" && method === "get") {
    const notifications = getStoredNotifications();
    return ok({ notifications });
  }

  return err(404, "Endpoint not mocked");
};
