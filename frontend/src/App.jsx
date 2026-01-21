import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

/* ---------------------- Pages ---------------------- */
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const VerifyOtp = React.lazy(() => import("./pages/VerifyOtp"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const TalkToCA = React.lazy(() => import("./pages/ConsultanExpert/talkToCA"));
const TalkToIP = React.lazy(() => import("./pages/ConsultanExpert/talkToIP"));
const ServiceOrder = React.lazy(() => import("./pages/Dashboard/userDSB/ServiceOrder"));
const CompanySetup = React.lazy(() => import("./pages/CompanySetup"));
const MyAccount = React.lazy(() => import("./pages/MyAccount"));

/* ---------------------- Dashboard Pages ---------------------- */
const DashboardIndex = React.lazy(() => import("./pages/DashboardIndex"));
const CompliancesPage = React.lazy(() => import("./pages/Dashboard/userDSB/CompliancesPage"));
const CrmPage = React.lazy(() => import("./pages/Dashboard/CrmPage"));
const CalendarPage = React.lazy(() => import("./pages/Dashboard/userDSB/CalendarPage"));
const DocumentsPage = React.lazy(() => import("./pages/Dashboard/userDSB/DocumentsPage"));
const ReportsPage = React.lazy(() => import("./pages/Dashboard/userDSB/ReportsPage"));
const ConsultPage = React.lazy(() => import("./pages/Dashboard/userDSB/ConsultPage"));
const ServicesHub = React.lazy(() => import("./pages/Dashboard/userDSB/ServiceHub"));
const ServiceDetails = React.lazy(() => import("./pages/Dashboard/userDSB/ServiceDetails"));
const UserHome = React.lazy(() => import("./pages/Dashboard/userDSB/HomePage"));
const EmployeeHomePage = React.lazy(() => import("./pages/Dashboard/EmployeeDSB/EmployeeHomePage"));
const AdminHome = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminHome"));

/* ---------------------- Dashboards ---------------------- */
const AdminDashboard = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminDashboard"));
const EmployeeDashboard = React.lazy(() => import("./pages/Dashboard/EmployeeDSB/EmployeeDashboard"));
const UserDashboard = React.lazy(() => import("./pages/Dashboard/userDSB/UserDashboard"));
const MyOrdersPage = React.lazy(() => import("./pages/Dashboard/userDSB/MyOrdersPage"));
const OrderDetailPage = React.lazy(() => import("./pages/Dashboard/userDSB/OrderDetailPage"));
const CompanyDetailsPage = React.lazy(() => import("./pages/Dashboard/userDSB/CompanyDetailsPage"));
const AdminReports = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminReports"));
const AdminExpertList = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminExpertList"));
const AdminOrdersPage = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminOrdersPage"));
const EmployeeTasksPage = React.lazy(() => import("./pages/Dashboard/EmployeeDSB/EmployeeTasksPage"));

// --- Import the new Employee Dashboard pages ---
const EmployeeAttendancePage = React.lazy(() => import("./pages/Dashboard/EmployeeDSB/EmployeeAttendancePage"));
const EmployeeSalesPage = React.lazy(() => import("./pages/Dashboard/EmployeeDSB/EmployeeSalesPage"));
const EmployeeReportsPage = React.lazy(() => import("./pages/Dashboard/EmployeeDSB/EmployeeReportsPage"));
const EmployeeContactPage = React.lazy(() => import("./pages/Dashboard/EmployeeDSB/EmployeeContactPage"));
const EmployeeCompanyPage = React.lazy(() => import("./pages/Dashboard/EmployeeDSB/EmployeeCompanyPage"));
const EmployeeCalendarPage = React.lazy(() => import("./pages/Dashboard/EmployeeDSB/EmployeeCalendarPage"));
const EmployeeLeads = React.lazy(() => import("./pages/Dashboard/EmployeeDSB/EmployeeLeads"));
const EmployeeChat = React.lazy(() => import("./pages/Dashboard/EmployeeDSB/EmployeeChat"));

const AdminAgents = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminAgents"));

/* ---------------------- Admin Modules ---------------------- */
const AdminEmployees = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminEmployees"));
const AdminAttendance = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminAttendance"));
const AdminPerformance = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminPerformance"));
const AdminCustomerLifecycle = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminCustomerLifecycle"));
const AdminSalesReports = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminSalesReports"));
const AdminSettings = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminSettings"));
const AdminLeadReport = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminLeadReport"));
const AdminDealReport = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminDealReport"));
const AdminNotifications = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminNotifications"));
const AdminEmployeeAttendanceReport = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminEmployeeAttendanceReport"));
const AdminLeads = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminLeads"));
const AdminDeals = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminDeals"));
const AdminCrmDashboard = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminCrm/AdminCrmDashboard"));
const AdminCustomerList = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminCrm/AdminCustomerList"));
const AdminCustomerDetail = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminCrm/AdminCustomerDetail"));
const AdminCompanyList = React.lazy(() => import("./pages/Dashboard/AdminDSB/AdminCrm/AdminCompanyList"));

/* ---------------------- Agent Modules ---------------------- */
const AgentDashboard = React.lazy(() => import("./pages/Dashboard/AgentDSB/AgentDashboard"));
const AgentHome = React.lazy(() => import("./pages/Dashboard/AgentDSB/AgentHome"));
const AgentWallet = React.lazy(() => import("./pages/Dashboard/AgentDSB/AgentWallet"));
const AgentOrders = React.lazy(() => import("./pages/Dashboard/AgentDSB/AgentOrders"));

/* ---------------------- Components ---------------------- */
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageLoader from "./components/PageLoader";
import ServiceLoader from "./pages/ServiceLoader";
import CheckoutModal from "./components/CheckoutModal";

import ChatBot from "./components/ChatBot";
import ScrollToTop from "./components/ScrollToTop";

/* ---------------------- Auth ---------------------- */
import { getAuth, clearAuth } from "./lib/auth";
import { importMap } from "./lib/serviceRoutes";

/* ===============================
 🔹 MAIN APP COMPONENT
 =============================== */
export default function App() {
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // ✅ React Router navigation

  /* ---------------------- Auth Initialization ---------------------- */
  useEffect(() => {
    const authData = getAuth();
    setUser(authData?.user || null);

    const handler = () => {
      const updatedAuthData = getAuth();
      setUser(updatedAuthData?.user || null);
    };
    window.addEventListener("auth:update", handler);
    return () => window.removeEventListener("auth:update", handler);
  }, []);

  /* ---------------------- Location & Notification on Load ---------------------- */
  useEffect(() => {
    // 1. Geolocation Request (Removed as requested)

    // 2. Notification Request
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          new Notification('Welcome to Kanakkaalar!', {
            body: 'We are glad to have you here. We can now send you important updates.',
          });
        }
      });
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

  /* ---------------------- Logout Function ---------------------- */
  const logout = () => {
    clearAuth();
    setUser(null);
    window.dispatchEvent(new Event("auth:update"));
    navigate("/", { replace: true }); // ✅ Smooth redirect without reload
  };

  /* ---------------------- Page Loading Animation ---------------------- */
  useEffect(() => {
    // Always show loader briefly on route change to indicate activity
    setPageLoading(true);

    // Ensure loader is hidden after a short delay
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500); // Increased slightly to 500ms to be noticeable but not annoying

    return () => clearTimeout(timer);
  }, [location.pathname]); // Only trigger on pathname change

  /* ---------------------- Layout Visibility ---------------------- */
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname.startsWith("/verify-otp") ||
    location.pathname === "/company-setup" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname === "/ConsultanExpert/talkToIP" ||
    location.pathname.startsWith("/dashboard");

  /* ---------------------- Full Width Logic ---------------------- */
  const isHome = location.pathname === "/";
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden w-full max-w-full">
      <PageLoader show={pageLoading} />
      <ScrollToTop />


      {/* Header should not show on Dashboard or Auth pages */}
      {!hideLayout && <Header user={user} logout={logout} />}

      {/* MAIN CONTENT AREA */}
      <main
        className="flex-1 w-full"
      >
        <React.Suspense fallback={<PageLoader show={true} />}>
          <Routes>
            {/* ---------------------- Public Pages ---------------------- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/ConsultanExpert/talkToCA" element={<TalkToCA />} />
            <Route path="/ConsultanExpert/talkToIP" element={<TalkToIP />} />
            <Route
              path="/company-setup"
              element={
                <ProtectedRoute>
                  <CompanySetup />
                </ProtectedRoute>
              }
            />

            {/* ---------------------- Dashboard Router ---------------------- */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouter user={user} />
                </ProtectedRoute>
              }
            />

            {/* ---------------------- USER DASHBOARD ---------------------- */}
            <Route
              path="/dashboard/user"
              element={
                <ProtectedRoute allowedRoles={["USER"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserHome />} />
              <Route path="home" element={<UserHome />} />
              <Route path="compliances" element={<CompliancesPage />} />
              <Route path="servicehub" element={<ServicesHub />} />
              <Route path="my-orders" element={<MyOrdersPage />} />
              <Route path="service-order" element={<ServiceOrder />} />
              <Route path="crm" element={<CrmPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="consult" element={<ConsultPage />} />
              <Route path="profile" element={<MyAccount />} />
              <Route path="order/:orderId" element={<OrderDetailPage />} />
              <Route path="company" element={<CompanyDetailsPage />} />
            </Route>

            {/* ---------------------- ADMIN DASHBOARD ---------------------- */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminHome />} />
              <Route path="home" element={<AdminHome />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="profile" element={<MyAccount />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="employees" element={<AdminEmployees />} />
              <Route path="agents" element={<AdminAgents />} />
              <Route path="experts" element={<AdminExpertList />} />
              <Route path="deals" element={<AdminDeals />} />
              <Route path="attendance" element={<AdminAttendance />} />
              <Route path="chat" element={<EmployeeChat />} />
              <Route path="performance" element={<AdminPerformance />} />
              <Route path="sales-reports" element={<AdminSalesReports />} />
              <Route path="reports" element={<AdminReports />} />

              {/* CRM Module Routes */}
              <Route path="crm" element={<AdminCrmDashboard />} />
              <Route path="crm/customers" element={<AdminCustomerList />} />
              <Route path="crm/companies" element={<AdminCompanyList />} />
              <Route path="crm/customer/:id" element={<AdminCustomerDetail />} />
            </Route>

            {/* ---------------------- EMPLOYEE DASHBOARD ---------------------- */}
            <Route
              path="/dashboard/employee"
              element={
                <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                  <EmployeeDashboard user={user} />
                </ProtectedRoute>
              }
            >
              <Route index element={<EmployeeHomePage />} />
              {/* Changed 'assigned' to 'tasks' to match the sidebar link */}
              <Route path="tasks" element={<EmployeeTasksPage />} />
              {/* Added route for a single task with :taskId as requested */}
              <Route path="task/:taskId" element={<OrderDetailPage />} />
              <Route path="profile" element={<MyAccount />} />
              {/* --- Add routes for the new pages --- */}
              <Route path="attendance" element={<EmployeeAttendancePage />} />
              <Route path="sales" element={<EmployeeSalesPage />} />
              <Route path="reports" element={<EmployeeReportsPage />} />
              <Route path="contact" element={<EmployeeContactPage />} />
              <Route path="company" element={<EmployeeCompanyPage />} />
              <Route path="calendar" element={<EmployeeCalendarPage />} />
              <Route path="chat" element={<EmployeeChat />} />
              {/* CRM Routes */}
              <Route path="crm/leads" element={<EmployeeLeads />} />
              <Route path="crm/deals" element={<AdminDeals />} />
              <Route path="crm/customers" element={<AdminCustomerList />} />
              <Route path="crm/companies" element={<AdminCompanyList />} />
            </Route>

            {/* ---------------------- AGENT DASHBOARD ---------------------- */}
            <Route
              path="/dashboard/agent"
              element={
                <ProtectedRoute allowedRoles={["AGENT"]}>
                  <AgentDashboard user={user} />
                </ProtectedRoute>
              }
            >
              <Route index element={<AgentHome />} />
              <Route path="wallet" element={<AgentWallet />} />
              <Route path="orders" element={<AgentOrders />} />
              <Route path="profile" element={<MyAccount />} />
            </Route>

            {/* ---------------------- Public Order Detail ---------------------- */}
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />

            {/* ---------------------- Fallback ---------------------- */}
            <Route path="*" element={<ServiceLoader />} />
          </Routes>
        </React.Suspense>
      </main>

      {/* Footer hidden on dashboard/auth pages */}
      {!hideLayout && (
        <>
          <Footer />
          <ChatBot />
        </>
      )}

      <CheckoutModal />
    </div>
  );
}

/* ===============================
 🔹 ROLE-BASED DASHBOARD ROUTER
 =============================== */
function DashboardRouter({ user }) {
  if (!user) return <UserDashboard />;

  switch (user.role) {
    case "ADMIN":
      return <AdminDashboard />;
    case "EMPLOYEE":
      return <EmployeeDashboard user={user} />;
    case "AGENT":
      return <React.Suspense fallback={<PageLoader show={true} />}><AgentDashboard user={user} /></React.Suspense>;
    case "USER":
      return <UserDashboard />;
    default:
      return <PageLoader show={true} />;
  }
}
