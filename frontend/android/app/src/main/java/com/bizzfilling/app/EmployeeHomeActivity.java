package com.bizzfilling.app;

import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bizzfilling.app.adapters.EmployeeTaskAdapter;
import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.EmployeeDashboardStats;
import com.bizzfilling.app.api.models.Order;
import com.bizzfilling.app.utils.SessionManager;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EmployeeHomeActivity extends AppCompatActivity {

    private TextView tvEmployeeName;
    private TextView tvTotalAssigned, tvInProgress, tvCompleted;
    private RecyclerView rvRecentTasks;
    private EmployeeTaskAdapter taskAdapter;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_employee_home);

        sessionManager = new SessionManager(this);

        // Initialize Views
        tvEmployeeName = findViewById(R.id.tvEmployeeName);
        tvTotalAssigned = findViewById(R.id.tvTotalAssigned);
        tvInProgress = findViewById(R.id.tvInProgress);
        tvCompleted = findViewById(R.id.tvCompleted);
        rvRecentTasks = findViewById(R.id.rvRecentTasks);

        // Setup Welcome Message
        tvEmployeeName.setText(sessionManager.getUserName());

        // Setup RecyclerView
        rvRecentTasks.setLayoutManager(new LinearLayoutManager(this));

        // Navigation Setup
        BottomNavigationView bottomNav = findViewById(R.id.bottom_navigation);
        bottomNav.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.nav_home) {
                return true;
            } else if (itemId == R.id.nav_projects) {
                // Navigate to Projects Activity
                Toast.makeText(this, "Projects Clicked", Toast.LENGTH_SHORT).show();
                return true;
            } else if (itemId == R.id.nav_calendar) {
                // Navigate to Calendar
                Toast.makeText(this, "Calendar Clicked", Toast.LENGTH_SHORT).show();
                return true;
            } else if (itemId == R.id.nav_profile) {
                // Navigate to Profile
                Toast.makeText(this, "Profile Clicked", Toast.LENGTH_SHORT).show();
                return true;
            }
            return false;
        });

        // Load Data
        fetchDashboardData(sessionManager.getUserEmail());
    }

    private void fetchDashboardData(String email) {
        if (email == null || email.isEmpty()) {
            Toast.makeText(this, "User email not found", Toast.LENGTH_SHORT).show();
            return;
        }

        ApiService apiService = ApiClient.getClient(this).create(ApiService.class);

        // 1. Fetch Stats (Optional - React uses it for Documents, but logic can
        // calculate generic stats from tasks too)
        // However, React calculates InProgress/Completed from the Tasks list mainly,
        // asking backend for "stats" specifically for documents.
        // For now, I will calculate counts from the Tasks List to match React logic
        // exactly.

        // 2. Fetch Assigned Orders
        apiService.getAssignedOrders(email).enqueue(new Callback<List<Order>>() {
            @Override
            public void onResponse(Call<List<Order>> call, Response<List<Order>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Order> tasks = response.body();
                    setupStatsAndList(tasks);
                } else {
                    Log.e("EmployeeHome", "Failed to fetch orders: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<List<Order>> call, Throwable t) {
                Log.e("EmployeeHome", "Network error: " + t.getMessage());
                Toast.makeText(EmployeeHomeActivity.this, "Failed to load data", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void setupStatsAndList(List<Order> tasks) {
        // Calculate Stats
        int total = tasks.size();
        int inProgress = 0;
        int completed = 0;

        for (Order task : tasks) {
            String status = task.getStatus();
            if ("COMPLETED".equalsIgnoreCase(status)) {
                completed++;
            } else if ("IN_PROGRESS".equalsIgnoreCase(status) || "ASSIGNED".equalsIgnoreCase(status)) {
                inProgress++;
            }
        }

        // Update UI
        tvTotalAssigned.setText(String.valueOf(total));
        tvInProgress.setText(String.valueOf(inProgress));
        tvCompleted.setText(String.valueOf(completed));

        // Update List
        taskAdapter = new EmployeeTaskAdapter(tasks);
        rvRecentTasks.setAdapter(taskAdapter);
    }
}
