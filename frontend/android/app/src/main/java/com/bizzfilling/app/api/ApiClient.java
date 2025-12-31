package com.bizzfilling.app.api;

import android.util.Log;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiClient {

    // Primary: Public IP
    private static final String BASE_URL = "http://115.97.59.230:8081/";
    // Fallback: Local IP
    private static final String FALLBACK_URL = "http://192.168.1.2:8081/";

    private static Retrofit retrofit = null;
    private static String currentBaseUrl = BASE_URL; // Start with Public

    public static Retrofit getClient(android.content.Context context) {
        if (retrofit == null) {
            if (context == null)
                throw new IllegalArgumentException("Context cannot be null");
            android.content.Context appContext = context.getApplicationContext();

            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);

            // Custom Interceptor for Failover
            Interceptor failoverInterceptor = new Interceptor() {
                @Override
                public Response intercept(Chain chain) throws IOException {
                    Request request = chain.request();

                    // 1. Try with current Base URL
                    try {
                        return chain.proceed(request);
                    } catch (IOException e) {
                        // 2. If failed, swap URLs
                        String newBaseUrl = currentBaseUrl.equals(BASE_URL) ? FALLBACK_URL : BASE_URL;

                        // Prevent infinite loop if both fail (simple toggle for now, ideally track
                        // attempts)
                        // For this request, we just toggle if the PRIMARY failed
                        if (currentBaseUrl.equals(BASE_URL)) {
                            Log.w("ApiClient", "Primary IP failed, switching to Fallback IP: " + newBaseUrl);
                            currentBaseUrl = newBaseUrl;

                            // Rebuild request with new URL
                            okhttp3.HttpUrl parsedUrl = okhttp3.HttpUrl.parse(newBaseUrl);
                            if (parsedUrl != null) {
                                okhttp3.HttpUrl newUrl = request.url().newBuilder()
                                        .host(parsedUrl.host())
                                        .port(parsedUrl.port())
                                        .scheme(parsedUrl.scheme())
                                        .build();

                                Request newRequest = request.newBuilder().url(newUrl).build();
                                return chain.proceed(newRequest);
                            }
                        }
                        throw e; // If already fallback or other error
                    }
                }
            };

            OkHttpClient client = new OkHttpClient.Builder()
                    .connectTimeout(5, TimeUnit.SECONDS) // Short timeout for faster failover
                    .readTimeout(30, TimeUnit.SECONDS)
                    .writeTimeout(30, TimeUnit.SECONDS)
                    .addInterceptor(logging)
                    .addInterceptor(failoverInterceptor) // Add failover logic
                    .addInterceptor(chain -> {
                        Request original = chain.request();
                        com.bizzfilling.app.utils.SessionManager sessionManager = new com.bizzfilling.app.utils.SessionManager(
                                appContext);
                        String token = sessionManager.getToken();

                        Request.Builder requestBuilder = original.newBuilder();
                        if (token != null) {
                            requestBuilder.header("Authorization", "Bearer " + token);
                        }

                        Response response = chain.proceed(requestBuilder.build());

                        if (response.code() == 401) {
                            // Ignore 401 for Login Endpoint (Invalid Credentials)
                            if (original.url().encodedPath().endsWith("/login")) {
                                return response;
                            }

                            // Token Expired or Invalid (Unauthorized)
                            // Note: We do NOT logout on 403 (Forbidden) as that might just mean access to
                            // specific resource is denied.
                            sessionManager.logout();

                            // Redirect to Login (LoginActivity)
                            android.content.Intent intent = new android.content.Intent(appContext,
                                    com.bizzfilling.app.LoginActivity.class);
                            intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK
                                    | android.content.Intent.FLAG_ACTIVITY_CLEAR_TASK);
                            appContext.startActivity(intent);

                            // Optional: Show Toast on UI thread
                            new android.os.Handler(android.os.Looper.getMainLooper())
                                    .post(() -> android.widget.Toast.makeText(appContext,
                                            "Session Expired. Please login again.", android.widget.Toast.LENGTH_LONG)
                                            .show());
                        }

                        return response;
                    })
                    .build();

            retrofit = new Retrofit.Builder()
                    .baseUrl(currentBaseUrl)
                    .client(client)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }

    public static ApiService getService(android.content.Context context) {
        return getClient(context).create(ApiService.class);
    }
}
