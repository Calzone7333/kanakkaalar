package com.bizzfilling.app.api;

import com.bizzfilling.app.api.models.LoginRequest;
import com.bizzfilling.app.api.models.LoginResponse;
import com.bizzfilling.app.api.models.SignupRequest;
import com.bizzfilling.app.api.models.SignupResponse;
import com.bizzfilling.app.api.models.DashboardStatsResponse;
import com.bizzfilling.app.api.models.Order;
import com.bizzfilling.app.api.models.EmployeeListResponse;
import com.bizzfilling.app.api.models.AgentListResponse;
import com.bizzfilling.app.api.models.Lead;
import com.bizzfilling.app.api.models.Deal;
import com.bizzfilling.app.api.models.Expert;
import com.bizzfilling.app.api.models.AttendanceRecord;
import com.bizzfilling.app.api.models.CustomerProfile;
import com.bizzfilling.app.api.models.EmployeeDashboardStats;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;

import java.util.List;

public interface ApiService {

        @POST("api/auth/login")
        Call<LoginResponse> login(@Body LoginRequest request);

        @POST("api/auth/signup")
        Call<SignupResponse> signup(@Body SignupRequest request);

        @POST("api/auth/request-email-otp")
        Call<java.util.Map<String, String>> requestEmailOtp(@Body java.util.Map<String, String> body);

        @POST("api/auth/reset-password")
        Call<java.util.Map<String, String>> resetPassword(@Body java.util.Map<String, String> body);

        @GET("api/admin/dashboard-stats")
        Call<DashboardStatsResponse> getAdminDashboardStats();

        @GET("api/orders")
        Call<List<Order>> getAllOrders();

        @GET("api/admin/employees")
        Call<EmployeeListResponse> listEmployees();

        @GET("api/admin/agents")
        Call<AgentListResponse> listAgents();

        @GET("api/leads")
        Call<List<Lead>> getAllLeads();

        @GET("api/deals")
        Call<List<Deal>> getAllDeals();

        @GET("api/experts")
        Call<List<Expert>> getExperts();

        @GET("api/user/me/profile-image")
        Call<okhttp3.ResponseBody> getProfileImage();

        @retrofit2.http.DELETE("api/admin/employees/{id}")
        Call<Void> deleteEmployee(@retrofit2.http.Path("id") String id);

        @GET("api/user/me")
        Call<com.bizzfilling.app.api.models.User> getUserProfile();

        @retrofit2.http.Multipart
        @retrofit2.http.PUT("api/user/me")
        Call<com.bizzfilling.app.api.models.UpdateProfileResponse> updateProfile(
                        @retrofit2.http.Part("fullName") okhttp3.RequestBody fullName,
                        @retrofit2.http.Part("phone") okhttp3.RequestBody phone,
                        @retrofit2.http.Part("password") okhttp3.RequestBody password,
                        @retrofit2.http.Part okhttp3.MultipartBody.Part profileImage);

        @POST("api/orders")
        Call<Order> createOrder(@Body com.bizzfilling.app.api.models.CreateOrderRequest request);

        @retrofit2.http.Multipart
        @POST("api/orders/{id}/documents")
        Call<Void> uploadDocument(
                        @retrofit2.http.Path("id") String orderId,
                        @retrofit2.http.Part okhttp3.MultipartBody.Part file);

        @GET("api/payments/key")
        Call<okhttp3.ResponseBody> getRazorpayKey();

        @POST("api/payments/order")
        Call<com.bizzfilling.app.api.models.RazorpayOrderResponse> createRazorpayOrder(
                        @Body com.bizzfilling.app.api.models.RazorpayOrderRequest body);

        @POST("api/orders/{id}/pay")
        Call<Void> confirmPayment(@retrofit2.http.Path("id") String orderId, @Body java.util.Map<String, String> body);

        // --- Leads ---
        @POST("api/leads")
        Call<Lead> createLead(@Body Lead lead);

        @retrofit2.http.PATCH("api/leads/{id}")
        Call<Lead> updateLead(@retrofit2.http.Path("id") String id, @Body Lead lead);

        @retrofit2.http.DELETE("api/leads/{id}")
        Call<Void> deleteLead(@retrofit2.http.Path("id") String id);

        // --- Deals ---
        @POST("api/deals")
        Call<Deal> createDeal(@Body Deal deal);

        @retrofit2.http.PATCH("api/deals/{id}")
        Call<Deal> updateDeal(@retrofit2.http.Path("id") String id, @Body Deal deal);

        @retrofit2.http.DELETE("api/deals/{id}")
        Call<Void> deleteDeal(@retrofit2.http.Path("id") String id);

        // --- Employees ---
        @retrofit2.http.Multipart
        @POST("api/admin/employees")
        Call<com.bizzfilling.app.api.models.User> createEmployee(
                        @retrofit2.http.Part("fullName") okhttp3.RequestBody fullName,
                        @retrofit2.http.Part("email") okhttp3.RequestBody email,
                        @retrofit2.http.Part("password") okhttp3.RequestBody password,
                        @retrofit2.http.Part("role") okhttp3.RequestBody role);

        // --- Agents ---
        @retrofit2.http.Multipart
        @POST("api/admin/agents")
        Call<com.bizzfilling.app.api.models.User> createAgent(
                        @retrofit2.http.PartMap java.util.Map<String, okhttp3.RequestBody> params);

        // --- Experts ---
        @retrofit2.http.Multipart
        @POST("api/experts")
        Call<Expert> createExpert(
                        @retrofit2.http.Part("data") okhttp3.RequestBody data);

        // --- Attendance ---
        @GET("api/attendance/today")
        Call<AttendanceRecord> getTodayAttendance();

        @GET("api/attendance/my-history")
        Call<List<AttendanceRecord>> getMyAttendanceHistory();

        @POST("api/attendance/check-in")
        Call<AttendanceRecord> checkIn(@Body java.util.Map<String, String> body); // Expects { "location": "..." }

        @POST("api/attendance/check-out")
        Call<AttendanceRecord> checkOut();

        @GET("api/attendance/all")
        Call<List<AttendanceRecord>> getAllAttendance();

        @GET("api/service-hub/stats")
        Call<EmployeeDashboardStats> getEmployeeStats(@retrofit2.http.Query("role") String role,
                        @retrofit2.http.Query("email") String email);

        @GET("api/orders/assigned")
        Call<List<Order>> getAssignedOrders(@retrofit2.http.Query("email") String email);

        @GET("api/crm/customer-profiles")
        Call<List<CustomerProfile>> getAllCustomerProfiles();

        @GET("api/company/all")
        Call<List<com.bizzfilling.app.api.models.Company>> getAllCompanies();

        // --- Documents ---
        @GET("api/docs/my-docs")
        Call<List<com.bizzfilling.app.api.models.Document>> listMyDocs();

        @retrofit2.http.Multipart
        @POST("api/docs/upload")
        Call<Void> uploadDocument(
                        @retrofit2.http.Part okhttp3.MultipartBody.Part file,
                        @retrofit2.http.Part("ownerUserId") okhttp3.RequestBody ownerUserId);

        @retrofit2.http.DELETE("api/docs/{id}")
        Call<Void> deleteDocument(@retrofit2.http.Path("id") String id);

        @GET("api/agent/wallet")
        Call<com.bizzfilling.app.api.models.AgentWallet> getAgentWallet();

        @GET("api/agent/wallet/transactions")
        Call<List<com.bizzfilling.app.api.models.WalletTransaction>> getWalletTransactions();

        @GET("api/docs/{id}/download")
        Call<okhttp3.ResponseBody> downloadDocument(@retrofit2.http.Path("id") String id);
}
