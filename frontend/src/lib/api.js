import axios from "axios";

// Define candidate URLs to test
const CANDIDATE_URLS = [
    "http://localhost:8081",      // Localhost (Developer System) - PRIORITY 1
    "http://192.168.1.2:8081",    // Network IP - PRIORITY 2
    "http://115.97.59.230:8081"   // Public Static IP - PRIORITY 3
].filter(Boolean);

// Remove duplicates
const UNIQUE_URLS = [...new Set(CANDIDATE_URLS)];

// Default to the first one initially (Localhost)
let activeBaseUrl = UNIQUE_URLS[0];

// Create the custom Axios instance
const api = axios.create({
    baseURL: activeBaseUrl,
    timeout: 10000,
});

// --- SMART URL DETECTION ---
// This runs in the background to find the fastest/working URL
(async () => {
    // Check if we already have a working URL from previous session
    const storedUrl = localStorage.getItem("api_url");
    if (storedUrl) {
        // Verify it's still up
        try {
            await axios.get(`${storedUrl}/actuator/health`, { timeout: 1500 });
            console.log(`✅ Using cached server: ${storedUrl}`);
            api.defaults.baseURL = storedUrl;
            activeBaseUrl = storedUrl;
            return;
        } catch (e) {
            console.log("Cached URL failed, re-detecting...");
        }
    }

    console.log("🔄 Auto-detecting best server URL...");

    const checkUrl = async (url) => {
        try {
            // Try to reach the server (timeout 2s)
            // We use /actuator/health which returns 200 OK if server is UP.
            // Using a simple GET request
            await axios.get(`${url}/actuator/health`, { timeout: 3000 });
            return url;
        } catch (e) {
            // If we get ANY response (404, 401, 500) that confirms connectivity, return success
            if (e.response && e.response.status) return url;
            throw e; // Network error -> unreachable
        }
    };

    try {
        // Race to find the first working URL
        const winner = await Promise.any(UNIQUE_URLS.map(u => checkUrl(u)));

        console.log(`✅ Connected to: ${winner}`);

        // Update the axios instance to use the winner
        api.defaults.baseURL = winner;
        activeBaseUrl = winner;

        // Save to localStorage for faster next boot
        localStorage.setItem("api_url", winner);
    } catch (err) {
        console.warn("⚠️ Could not auto-detect server. Fallback to Primary Public IP.");
        const fallback = "http://115.97.59.230:8081";
        api.defaults.baseURL = fallback;
        activeBaseUrl = fallback;
    }
})();
// ---------------------------

import { getAuth, clearAuth } from "./auth";

// Attach auth token to requests using the Interceptor (CORRECT)
api.interceptors.request.use((config) => {
    // Read token from the unified auth object
    const token = getAuth()?.token;

    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        // Clear any stale session and notify if token is invalid
        clearAuth();
        try { window.dispatchEvent(new Event('auth:update')); } catch (e) { }
        // Helpful dev warning when making API requests without a token
        if (import.meta.env.DEV && String(config.url || "").startsWith('/api')) {
            // console.warn('No valid auth token available for API request:', config.method, config.url);
        }
    }
    return config;
});

// Global response interceptor to handle auth errors (401/403)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        try {
            const status = error?.response?.status;
            if (status === 401 || status === 403) {
                // Clear local session and notify other parts of the app
                clearAuth();
                try { window.dispatchEvent(new Event('auth:update')); } catch (e) { }

                // Redirect the user to login (best-effort)
                try { window.location.href = '/login'; } catch (e) { }
            }
        } catch (err) {
            // ignore
        }
        return Promise.reject(error);
    }
);

// --- API Endpoints ---

// Auth APIs
export const authAPI = {
    signup: (payload) => api.post("/api/auth/signup", payload),
    login: (payload) => api.post("/api/auth/login", payload),
    loginPhone: (payload) => api.post("/api/auth/login-phone", payload),
    verifyPhone: (payload) => api.post("/api/auth/verify-phone", payload),
    requestEmailOtp: (payload) => api.post("/api/auth/request-email-otp", payload),
    verifyEmail: (payload) => api.post("/api/auth/verify-email", payload),
    resetPassword: (payload) => api.post("/api/auth/reset-password", payload),
};

// User APIs
export const userAPI = {
    me: () => api.get("/api/user/me"),
    all: () => api.get("/api/user/all"),
    getAll: () => api.get("/api/user/all"), // Alias for all
    update: (formData) => api.put("/api/user/me", formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    profileImage: () => api.get("/api/user/me/profile-image", { responseType: 'blob' }),
    getById: (id) => api.get(`/api/user/${id}`),
};

// Workflow APIs
export const workflowAPI = {
    getTimeline: (orderId) => api.get(`/api/workflow/orders/${orderId}/timeline`),
    getProgress: (orderId) => api.get(`/api/workflow/orders/${orderId}/progress`),
    getCurrentStage: (orderId) => api.get(`/api/workflow/orders/${orderId}/current-stage`),
    createEvent: (orderId, payload) => api.post(`/api/workflow/orders/${orderId}/event`, payload),
    advanceStage: (orderId, payload) => api.post(`/api/workflow/orders/${orderId}/advance`, payload),
    completeStage: (orderId, payload) => api.post(`/api/workflow/orders/${orderId}/complete`, payload),
    failStage: (orderId, payload) => api.post(`/api/workflow/orders/${orderId}/fail`, payload),
    addException: (orderId, payload) => api.post(`/api/workflow/orders/${orderId}/exception`, payload),
    getActiveExceptions: (orderId) => api.get(`/api/workflow/orders/${orderId}/exceptions`),
    getAvailableStages: () => api.get(`/api/workflow/stages`),
};

// Workflow alerts & statistics
export const workflowAlertAPI = {
    getOrderAlerts: (orderId) => api.get(`/api/workflow/alerts/orders/${orderId}`),
    getUnresolvedForOrder: (orderId) => api.get(`/api/workflow/alerts/orders/${orderId}/unresolved`),
    getAllUnresolved: () => api.get(`/api/workflow/alerts/unresolved`),
    createAlert: (payload) => api.post(`/api/workflow/alerts`, payload),
    resolveAlert: (id, payload) => api.put(`/api/workflow/alerts/${id}/resolve`, payload),
    getUnresolvedCount: (orderId) => api.get(`/api/workflow/alerts/count/${orderId}`),
};

export const workflowStatsAPI = {
    dashboardStats: () => api.get(`/api/workflow/analytics/dashboard-stats`),
    stageStats: () => api.get(`/api/workflow/analytics/stage-stats`),
    exceptionStats: () => api.get(`/api/workflow/analytics/exception-stats`),
};

// Orders
export const orderAPI = {
    getAll: (options) => api.get("/api/orders", options || {}),
    myOrders: () => api.get("/api/orders/my-orders"),
    getById: (id) => api.get(`/api/orders/${id}`),
    create: (payload) => api.post("/api/orders", payload),
    update: (id, payload) => api.put(`/api/orders/${id}`, payload),
    delete: (id) => api.delete(`/api/orders/${id}`),
    addDocument: (orderId, file) => {
        const fd = new FormData();
        fd.append('file', file);
        return api.post(`/api/orders/${orderId}/documents`, fd);
    },
    listDocuments: (orderId) => api.get(`/api/orders/${orderId}/documents`),
    verifyDocument: (orderId, docId) => api.post(`/api/orders/${orderId}/documents/${docId}/verify`),
    downloadDocument: (orderId, docId) => api.get(`/api/orders/${orderId}/documents/${docId}/download`, { responseType: 'blob' }),
    pay: (orderId, payload) => api.post(`/api/orders/${orderId}/pay`, payload),
    assign: (orderId, payload) => api.post(`/api/orders/${orderId}/assign`, payload),
    listAssigned: (assigneeEmail) => api.get(`/api/orders/assigned?assigneeEmail=${encodeURIComponent(assigneeEmail || '')}`),
};


// Cases
export const caseAPI = {
    getAll: () => api.get("/api/cases"),
    getById: (id) => api.get(`/api/cases/${id}`),
    create: (payload) => api.post("/api/cases", payload),
    update: (id, payload) => api.put(`/api/cases/${id}`, payload),
    delete: (id) => api.delete(`/api/cases/${id}`),
};

// Notifications
export const notificationAPI = {
    getAll: () => api.get("/api/notifications"),
    markAsRead: (id) => api.put(`/api/notifications/${id}/read`),
};

// Documents / S3
export const docsAPI = {
    upload: (formData) => api.post(`/api/docs/upload`, formData),
    downloadDocument: (documentId) => api.get(`/api/docs/${documentId}/download`, { responseType: 'blob' }),
    listMyDocs: () => api.get(`/api/docs/my-docs`),
    deleteDocument: (documentId) => api.delete(`/api/docs/${documentId}`),
    replace: (documentId, formData) => api.put(`/api/docs/${documentId}`, formData),
};

// Payments
export const paymentsAPI = {
    createOrder: (payload) => api.post(`/api/payments/order`, payload),
    confirm: (payload) => api.post(`/api/payments/confirm`, payload),
    myPayments: () => api.get(`/api/payments/mine`),
    getKey: () => api.get(`/api/payments/key`),
    webhook: (payload, signature) => api.post(`/api/payments/webhook`, payload, { headers: { "X-Razorpay-Signature": signature } }),
};

// Admin
export const adminAPI = {
    // Create a new employee using multipart/form-data as expected by the backend
    createEmployee: (data) => {
        const fd = new FormData();
        fd.append('fullName', data.fullName);
        fd.append('email', data.email);
        fd.append('password', data.password);
        fd.append('role', data.role);
        return api.post(`/api/admin/employees`, fd);
    },
    listEmployees: () => api.get(`/api/admin/employees`),
    getEmployee: (id) => api.get(`/api/admin/employees/${id}`),
    updateEmployee: (id, data) => {
        const fd = new FormData();
        fd.append('fullName', data.fullName);
        fd.append('email', data.email);
        fd.append('role', data.role);
        return api.put(`/api/admin/employees/${id}`, fd);
    },
    deleteEmployee: (id) => api.delete(`/api/admin/employees/${id}`),

    // CRM
    listLeads: () => api.get(`/api/admin/leads`),
    getDashboardStats: () => api.get(`/api/admin/dashboard-stats`),
    listCrmLeads: () => api.get(`/api/admin/crm-leads`),
    getCustomerLifecycleData: () => api.get("/api/admin/customer-lifecycle"),

    // Agent Management
    listAgents: () => api.get(`/api/admin/agents`),
    createAgent: (data) => api.post(`/api/admin/agents`, data),
    updateAgent: (id, data) => api.post(`/api/admin/agents/${id}`, data),
    deleteAgent: (id) => api.delete(`/api/admin/agents/${id}`),
    toggleAgentStatus: (id, status) => api.put(`/api/admin/agents/${id}/status`, { status }),
};

// Lead APIs (accessible by employees and admins)
export const leadAPI = {
    getAll: () => api.get("/api/leads"),
    getById: (id) => api.get(`/api/leads/${id}`),
    create: (payload) => api.post("/api/leads", payload),
    update: (id, payload) => api.put(`/api/leads/${id}`, payload),
    delete: (id) => api.delete(`/api/leads/${id}`),
};


// Service hub
export const serviceHubAPI = {
    status: (role, email) => api.get(`/api/servicehub/status?role=${encodeURIComponent(role)}${email ? `&email=${encodeURIComponent(email)}` : ''}`),
    myOrders: (service) => api.get(`/api/servicehub/my-orders${service ? `?service=${encodeURIComponent(service)}` : ''}`),
    orders: (service) => api.get(`/api/servicehub/orders${service ? `?service=${encodeURIComponent(service)}` : ''}`),
};

// Services API
export const serviceAPI = {
    createGSTOrder: (payload) => api.post(`/api/services/gst/register`, payload),
};

// Process
export const processAPI = {
    getOrderProcess: (orderId) => api.get(`/api/process/orders/${orderId}`),
    addStage: (orderId, payload) => api.post(`/api/process/orders/${orderId}/stage`, payload),
};

// Execution
export const executionAPI = {
    executeCompanyReg: (payload) => api.post(`/api/execute/company-reg`, payload),
};

// Email verification
export const emailAPI = {
    sendVerification: (payload) => api.post(`/api/verify-email/send`, payload),
};

// AI endpoints
export const aiAPI = {
    chat: (payload) => api.post(`/api/ai/chat`, payload),
    ocrValidate: (payload) => api.post(`/api/ai/ocr/validate`, payload),
    draftDocument: (payload) => api.post(`/api/ai/docs/draft`, payload),
    kbSearch: (payload) => api.post(`/api/ai/kb/search`, payload),
    predictEta: (payload) => api.post(`/api/ai/predict/eta`, payload),
    triageObjection: (payload) => api.post(`/api/ai/triage/objection`, payload),
};

// CRM APIs
export const crmAPI = {
    // Customer Profile
    createProfile: (data) => api.post("/api/crm/customer-profile", data),
    getMyProfile: () => api.get("/api/crm/customer-profile/me"),
    getAllProfiles: () => api.get("/api/crm/customer-profiles"),
    updateProfile: (id, data) => api.put(`/api/crm/customer-profile/${id}`, data),

    // Service Requests
    createServiceRequest: (data) => api.post("/api/crm/service-request", data),
    getServiceRequestsByCustomer: (customerProfileId) => api.get(`/api/crm/service-requests/customer/${customerProfileId}`),
    getAllServiceRequests: () => api.get("/api/crm/service-requests"),
    updateServiceRequest: (id, data) => api.put(`/api/crm/service-request/${id}`, data),

    // Documents
    uploadDocument: (data) => api.post("/api/crm/document", data),
    getDocumentsByCustomer: (customerProfileId) => api.get(`/api/crm/documents/customer/${customerProfileId}`),
    deleteDocument: (id) => api.delete(`/api/crm/document/${id}`),

    // Support Tickets
    createTicket: (data) => api.post("/api/crm/support-ticket", data),
    getTicketsByCustomer: (customerProfileId) => api.get(`/api/crm/support-tickets/customer/${customerProfileId}`),
    getAllTickets: () => api.get("/api/crm/support-tickets"),
    updateTicketStatus: (id, status) => api.put(`/api/crm/support-ticket/${id}/status`, { status }),

    // Wallet
    getWallet: (customerProfileId) => api.get(`/api/crm/wallet/customer/${customerProfileId}`),
    addMoney: (data) => api.post("/api/crm/wallet/add-money", data),
    deductMoney: (data) => api.post("/api/crm/wallet/deduct", data),
    getWalletTransactions: (walletId) => api.get(`/api/crm/wallet/${walletId}/transactions`),

    // Dashboard
    getDashboardStats: () => api.get("/api/crm/dashboard-stats"),
};

// Wallet
export const walletAPI = {
    getWallet: () => api.get("/api/wallet"),
    getTransactions: () => api.get("/api/wallet/transactions"),
};

// Tasks
export const taskAPI = {
    getAll: () => api.get("/api/tasks"),
    getMyTasks: () => api.get("/api/tasks/my-tasks"),
    create: (payload) => api.post("/api/tasks", payload),
    update: (id, payload) => api.put(`/api/tasks/${id}`, payload),
    delete: (id) => api.delete(`/api/tasks/${id}`),
};

// Company
export const companyAPI = {
    setup: (formData) => api.post("/api/company/setup", formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    getProfile: () => api.get("/api/company/profile"),
    getAllProfiles: () => api.get("/api/company/all"),
};


// Deals
export const dealAPI = {
    getAll: () => api.get("/api/deals"),
    getById: (id) => api.get(`/api/deals/${id}`),
    create: (payload) => api.post("/api/deals", payload),
    update: (id, payload) => api.put(`/api/deals/${id}`, payload),
    delete: (id) => api.delete(`/api/deals/${id}`),
};

// Attendance
export const attendanceAPI = {
    checkIn: (location) => api.post("/api/attendance/check-in", { location }),
    checkOut: () => api.post("/api/attendance/check-out"),
    getMyHistory: () => api.get("/api/attendance/my-history"),
    getToday: () => api.get("/api/attendance/today"),
    getAll: () => api.get("/api/attendance/all"),
    getStats: () => api.get("/api/attendance/stats"),
    getTrend: () => api.get("/api/attendance/trend"),
};

// Experts
export const expertAPI = {
    getAll: () => api.get("/api/experts"),
    getById: (id) => api.get(`/api/experts/${id}`),
    create: (data) => api.post("/api/experts", data),
    update: (id, data) => api.put(`/api/experts/${id}`, data),
    delete: (id) => api.delete(`/api/experts/${id}`),
};

export default api;
