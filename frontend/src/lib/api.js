import axios from "axios";
import { getAuth, clearAuth } from "./auth";

// --- API Configuration ---

const FAILOVER_URLS = [
    "/api"
];

// Default to the first URL
let currentBaseUrl = FAILOVER_URLS[0];

// Create the Axios instance
const api = axios.create({
    baseURL: currentBaseUrl,
    timeout: 15000, // 15 seconds timeout
});

console.log(`🚀 API Initialized with Base URL: ${currentBaseUrl}`);

// --- Caching Utilities ---
const CACHE_PREFIX = 'api_cache_';
const CACHE_DURATION = 1000 * 60 * 15; // 15 Minutes

const getCachedData = (key) => {
    try {
        const item = localStorage.getItem(CACHE_PREFIX + key);
        if (!item) return null;
        const { value, timestamp } = JSON.parse(item);
        if (Date.now() - timestamp > CACHE_DURATION) {
            localStorage.removeItem(CACHE_PREFIX + key);
            return null; // Expired
        }
        return value;
    } catch (e) {
        return null;
    }
};

const setCachedData = (key, value) => {
    try {
        const item = { value, timestamp: Date.now() };
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
    } catch (e) {
        // Quota exceeded
    }
};

// --- Interceptors ---

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const auth = getAuth();
        const token = auth?.token;

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Auth Errors & Failovers
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;

        // Handle Network Errors (Failover Logic)
        if (!config._retry && (error.code === "ERR_NETWORK" || error.message === "Network Error")) {
            const currentUrl = api.defaults.baseURL;
            const currentIndex = FAILOVER_URLS.indexOf(currentUrl);

            if (currentIndex !== -1 && currentIndex < FAILOVER_URLS.length - 1) {
                config._retry = true; // Prevent infinite loops for the same request
                const nextUrl = FAILOVER_URLS[currentIndex + 1];

                console.warn(`⚠️ API Connection to ${currentUrl} failed. Switching to failover: ${nextUrl}`);

                // Update the global instance default for future requests
                api.defaults.baseURL = nextUrl;

                // Update the config for this specific retry
                config.baseURL = nextUrl;

                // Reset the URL on the config to ensure axios uses the new baseURL
                // (Axios merges baseURL and url, so we need to be careful)
                // However, since we set baseURL on instance, simple retrying with new config should work 
                // IF the url was relative.

                return api(config);
            }
        }

        const status = error?.response?.status;

        // Handle Unauthorized / Forbidden
        if (status === 401 || status === 403) {
            // Only redirect if not already on public pages to avoid loops
            const path = window.location.pathname;
            if (!path.includes('/login') && !path.includes('/signup')) {
                clearAuth();
                window.dispatchEvent(new Event('auth:update'));
                // Optional: window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);

// --- API Endpoints ---

// Auth APIs
export const authAPI = {
    signup: (payload) => api.post("/auth/signup", payload),
    login: (payload) => api.post("/auth/login", payload),
    loginGoogle: (token) => api.post("/auth/google", { token }),
    loginPhone: (payload) => api.post("/auth/login-phone", payload),
    verifyPhone: (payload) => api.post("/auth/verify-phone", payload),
    requestEmailOtp: (payload) => api.post("/auth/request-email-otp", payload),
    verifyEmail: (payload) => api.post("/auth/verify-email", payload),
    resetPassword: (payload) => api.post("/auth/reset-password", payload),
};

// User APIs
export const userAPI = {
    me: () => api.get("/user/me"),
    all: () => api.get("/user/all"),
    getAll: () => api.get("/user/all"),
    update: (formData) => api.put("/user/me", formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    profileImage: async () => {
        const cacheKey = 'user_profile_image';
        // Try to get from cache first (Base64 string for images)
        const cached = getCachedData(cacheKey);
        if (cached) {
            // Convert base64 back to Blob for compatibility if needed, 
            // BUT our components expect a Blob to createURL. 
            // Efficient way: Store generated ObjectURL? No, that expires on reload.
            // Better: Store Base64 and convert to Blob.
            const res = await fetch(cached);
            const blob = await res.blob();
            return { data: blob };
        }

        // If not in cache, fetch from API
        const response = await api.get("/user/me/profile-image", { responseType: 'blob' });

        // Save to cache (Convert Blob to Base64)
        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = () => {
            const base64data = reader.result;
            setCachedData(cacheKey, base64data);
        }

        return response;
    },
    getById: (id) => api.get(`/user/${id}`),
};

// Workflow APIs
export const workflowAPI = {
    getTimeline: (orderId) => api.get(`/workflow/orders/${orderId}/timeline`),
    getProgress: (orderId) => api.get(`/workflow/orders/${orderId}/progress`),
    getCurrentStage: (orderId) => api.get(`/workflow/orders/${orderId}/current-stage`),
    createEvent: (orderId, payload) => api.post(`/workflow/orders/${orderId}/event`, payload),
    advanceStage: (orderId, payload) => api.post(`/workflow/orders/${orderId}/advance`, payload),
    completeStage: (orderId, payload) => api.post(`/workflow/orders/${orderId}/complete`, payload),
    failStage: (orderId, payload) => api.post(`/workflow/orders/${orderId}/fail`, payload),
    addException: (orderId, payload) => api.post(`/workflow/orders/${orderId}/exception`, payload),
    getActiveExceptions: (orderId) => api.get(`/workflow/orders/${orderId}/exceptions`),
    getAvailableStages: () => api.get(`/workflow/stages`),
};

// Workflow alerts & statistics
export const workflowAlertAPI = {
    getOrderAlerts: (orderId) => api.get(`/workflow/alerts/orders/${orderId}`),
    getUnresolvedForOrder: (orderId) => api.get(`/workflow/alerts/orders/${orderId}/unresolved`),
    getAllUnresolved: () => api.get(`/workflow/alerts/unresolved`),
    createAlert: (payload) => api.post(`/workflow/alerts`, payload),
    resolveAlert: (id, payload) => api.put(`/workflow/alerts/${id}/resolve`, payload),
    getUnresolvedCount: (orderId) => api.get(`/workflow/alerts/count/${orderId}`),
};

export const workflowStatsAPI = {
    dashboardStats: () => api.get(`/workflow/analytics/dashboard-stats`),
    stageStats: () => api.get(`/workflow/analytics/stage-stats`),
    exceptionStats: () => api.get(`/workflow/analytics/exception-stats`),
};

// Orders
export const orderAPI = {
    getAll: (options) => api.get("/orders", options || {}),
    myOrders: () => api.get("/orders/my-orders"),
    getById: (id) => api.get(`/orders/${id}`),
    create: (payload) => api.post("/orders", payload),
    update: (id, payload) => api.put(`/orders/${id}`, payload),
    delete: (id) => api.delete(`/orders/${id}`),
    addDocument: (orderId, file) => {
        const fd = new FormData();
        fd.append('file', file);
        return api.post(`/orders/${orderId}/documents`, fd);
    },
    listDocuments: (orderId) => api.get(`/orders/${orderId}/documents`),
    verifyDocument: (orderId, docId) => api.post(`/orders/${orderId}/documents/${docId}/verify`),
    downloadDocument: (orderId, docId) => api.get(`/orders/${orderId}/documents/${docId}/download`, { responseType: 'blob' }),
    pay: (orderId, payload) => api.post(`/orders/${orderId}/pay`, payload),
    assign: (orderId, payload) => api.post(`/orders/${orderId}/assign`, payload),
    listAssigned: (assigneeEmail) => api.get(`/orders/assigned?assigneeEmail=${encodeURIComponent(assigneeEmail || '')}`),
};

// Cases
export const caseAPI = {
    getAll: () => api.get("/cases"),
    getById: (id) => api.get(`/cases/${id}`),
    create: (payload) => api.post("/cases", payload),
    update: (id, payload) => api.put(`/cases/${id}`, payload),
    delete: (id) => api.delete(`/cases/${id}`),
};

// Notifications
export const notificationAPI = {
    getAll: () => api.get("/notifications"),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

// Documents / S3
export const docsAPI = {
    upload: (formData) => api.post(`/docs/upload`, formData),
    downloadDocument: (documentId) => api.get(`/docs/${documentId}/download`, { responseType: 'blob' }),
    listMyDocs: () => api.get(`/docs/my-docs`),
    deleteDocument: (documentId) => api.delete(`/docs/${documentId}`),
    replace: (documentId, formData) => api.put(`/docs/${documentId}`, formData),
};

// Payments
export const paymentsAPI = {
    createOrder: (payload) => api.post(`/payments/order`, payload),
    confirm: (payload) => api.post(`/payments/confirm`, payload),
    myPayments: () => api.get(`/payments/mine`),
    getKey: () => api.get(`/payments/key`),
    webhook: (payload, signature) => api.post(`/payments/webhook`, payload, { headers: { "X-Razorpay-Signature": signature } }),
};

// Admin
export const adminAPI = {
    createEmployee: (data) => {
        const fd = new FormData();
        fd.append('fullName', data.fullName);
        fd.append('email', data.email);
        fd.append('password', data.password);
        fd.append('role', data.role);
        return api.post(`/admin/employees`, fd);
    },
    listEmployees: () => api.get(`/admin/employees`),
    getEmployee: (id) => api.get(`/admin/employees/${id}`),
    updateEmployee: (id, data) => {
        const fd = new FormData();
        fd.append('fullName', data.fullName);
        fd.append('email', data.email);
        fd.append('role', data.role);
        return api.put(`/admin/employees/${id}`, fd);
    },
    deleteEmployee: (id) => api.delete(`/admin/employees/${id}`),

    // CRM
    listLeads: () => api.get(`/admin/leads`),
    getDashboardStats: () => api.get(`/admin/dashboard-stats`),
    listCrmLeads: () => api.get(`/admin/crm-leads`),
    getCustomerLifecycleData: () => api.get("/admin/customer-lifecycle"),

    // Agent Management
    listAgents: () => api.get(`/admin/agents`),
    createAgent: (data) => api.post(`/admin/agents`, data),
    updateAgent: (id, data) => api.post(`/admin/agents/${id}`, data),
    deleteAgent: (id) => api.delete(`/admin/agents/${id}`),
    toggleAgentStatus: (id, status) => api.put(`/admin/agents/${id}/status`, { status }),
};

// Lead APIs
export const leadAPI = {
    getAll: () => api.get("/leads"),
    getById: (id) => api.get(`/leads/${id}`),
    create: (payload) => api.post("/leads", payload),
    update: (id, payload) => api.put(`/leads/${id}`, payload),
    delete: (id) => api.delete(`/leads/${id}`),
};

// Service hub
export const serviceHubAPI = {
    status: (role, email) => api.get(`/servicehub/status?role=${encodeURIComponent(role)}${email ? `&email=${encodeURIComponent(email)}` : ''}`),
    myOrders: (service) => api.get(`/servicehub/my-orders${service ? `?service=${encodeURIComponent(service)}` : ''}`),
    orders: (service) => api.get(`/servicehub/orders${service ? `?service=${encodeURIComponent(service)}` : ''}`),
};

// Services API
export const serviceAPI = {
    createGSTOrder: (payload) => api.post(`/services/gst/register`, payload),
};

// Process
export const processAPI = {
    getOrderProcess: (orderId) => api.get(`/process/orders/${orderId}`),
    addStage: (orderId, payload) => api.post(`/process/orders/${orderId}/stage`, payload),
};

// Execution
export const executionAPI = {
    executeCompanyReg: (payload) => api.post(`/execute/company-reg`, payload),
};

// Email verification
export const emailAPI = {
    sendVerification: (payload) => api.post(`/verify-email/send`, payload),
};

// AI endpoints
export const aiAPI = {
    chat: (payload) => api.post(`/ai/chat`, payload),
    ocrValidate: (payload) => api.post(`/ai/ocr/validate`, payload),
    draftDocument: (payload) => api.post(`/ai/docs/draft`, payload),
    kbSearch: (payload) => api.post(`/ai/kb/search`, payload),
    predictEta: (payload) => api.post(`/ai/predict/eta`, payload),
    triageObjection: (payload) => api.post(`/ai/triage/objection`, payload),
};

// CRM APIs
export const crmAPI = {
    createProfile: (data) => api.post("/crm/customer-profile", data),
    getMyProfile: () => api.get("/crm/customer-profile/me"),
    getAllProfiles: () => api.get("/crm/customer-profiles"),
    updateProfile: (id, data) => api.put(`/crm/customer-profile/${id}`, data),

    createServiceRequest: (data) => api.post("/crm/service-request", data),
    getServiceRequestsByCustomer: (customerProfileId) => api.get(`/crm/service-requests/customer/${customerProfileId}`),
    getAllServiceRequests: () => api.get("/crm/service-requests"),
    updateServiceRequest: (id, data) => api.put(`/crm/service-request/${id}`, data),

    uploadDocument: (data) => api.post("/crm/document", data),
    getDocumentsByCustomer: (customerProfileId) => api.get(`/crm/documents/customer/${customerProfileId}`),
    deleteDocument: (id) => api.delete(`/crm/document/${id}`),

    createTicket: (data) => api.post("/crm/support-ticket", data),
    getTicketsByCustomer: (customerProfileId) => api.get(`/crm/support-tickets/customer/${customerProfileId}`),
    getAllTickets: () => api.get("/crm/support-tickets"),
    updateTicketStatus: (id, status) => api.put(`/crm/support-ticket/${id}/status`, { status }),

    getWallet: (customerProfileId) => api.get(`/crm/wallet/customer/${customerProfileId}`),
    addMoney: (data) => api.post("/crm/wallet/add-money", data),
    deductMoney: (data) => api.post("/crm/wallet/deduct", data),
    getWalletTransactions: (walletId) => api.get(`/crm/wallet/${walletId}/transactions`),

    getDashboardStats: () => api.get("/crm/dashboard-stats"),
};

// Wallet
export const walletAPI = {
    getWallet: () => api.get("/wallet"),
    getTransactions: () => api.get("/wallet/transactions"),
};

// Tasks
export const taskAPI = {
    getAll: () => api.get("/tasks"),
    getMyTasks: () => api.get("/tasks/my-tasks"),
    create: (payload) => api.post("/tasks", payload),
    update: (id, payload) => api.put(`/tasks/${id}`, payload),
    delete: (id) => api.delete(`/tasks/${id}`),
};

// Company
export const companyAPI = {
    setup: (formData) => api.post("/company/setup", formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    getProfile: () => api.get("/company/profile"),
    getAllProfiles: () => api.get("/company/all"),
};

// Deals
export const dealAPI = {
    getAll: () => api.get("/deals"),
    getById: (id) => api.get(`/deals/${id}`),
    create: (payload) => api.post("/deals", payload),
    update: (id, payload) => api.put(`/deals/${id}`, payload),
    delete: (id) => api.delete(`/deals/${id}`),
};

// Attendance
export const attendanceAPI = {
    checkIn: (location) => api.post("/attendance/check-in", { location }),
    checkOut: () => api.post("/attendance/check-out"),
    getMyHistory: () => api.get("/attendance/my-history"),
    getToday: () => api.get("/attendance/today"),
    getAll: () => api.get("/attendance/all"),
    getStats: () => api.get("/attendance/stats"),
    getTrend: () => api.get("/attendance/trend"),
};

// Experts
export const expertAPI = {
    getAll: () => api.get("/experts"),
    getById: (id) => api.get(`/experts/${id}`),
    create: (data) => api.post("/experts", data),
    update: (id, data) => api.put(`/experts/${id}`, data),
    delete: (id) => api.delete(`/experts/${id}`),
};

// Chat
export const chatAPI = {
    send: (payload) => {
        const fd = new FormData();
        fd.append("sender", payload.sender);
        if (payload.recipient) fd.append("recipient", payload.recipient);
        if (payload.groupId) fd.append("groupId", payload.groupId);
        fd.append("content", payload.content || "");
        if (payload.file) {
            fd.append("file", payload.file);
        }
        return api.post("/chat/send", fd, { headers: { "Content-Type": "multipart/form-data" } });
    },
    history: (user1, user2) => api.get(`/chat/history?user1=${encodeURIComponent(user1)}&user2=${encodeURIComponent(user2)}`),
    createGroup: (payload) => api.post("/chat/groups", payload),
    myGroups: (email) => api.get(`/chat/my-groups?email=${encodeURIComponent(email)}`),
    groupHistory: (groupId) => api.get(`/chat/group-history?groupId=${groupId}`),
};


// Service Items Management (Dynamic Service Hub)
export const serviceItemAPI = {
    getActiveGrouped: () => api.get("/service-items/active-grouped"),
    getAll: () => api.get("/service-items/all"),
    create: (payload) => api.post("/service-items", payload),
    update: (id, payload) => api.put(`/service-items/${id}`, payload),
    delete: (id) => api.delete(`/service-items/${id}`),
};

export default api;
