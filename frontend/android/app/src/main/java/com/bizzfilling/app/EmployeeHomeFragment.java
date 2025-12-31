package com.bizzfilling.app;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bizzfilling.app.adapters.EmployeeTaskAdapter;
import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.EmployeeDashboardStats;
import com.bizzfilling.app.api.models.Order;
import com.bizzfilling.app.utils.SessionManager;

import java.text.DateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EmployeeHomeFragment extends Fragment {

    private boolean showMenu = true;
    private TextView tvEmployeeName;
    private TextView tvDate;
    private TextView tvActiveTasksSubtitle;
    private TextView tvTotalAssigned, tvInProgress, tvCompleted, tvDocuments;
    private RecyclerView rvRecentTasks;
    private TextView btnViewAllTasks;
    private EmployeeTaskAdapter taskAdapter;
    private SessionManager sessionManager;
    private ImageView ivProfile;

    public static EmployeeHomeFragment newInstance(boolean showMenu) {
        EmployeeHomeFragment fragment = new EmployeeHomeFragment();
        Bundle args = new Bundle();
        args.putBoolean("SHOW_MENU", showMenu);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            showMenu = getArguments().getBoolean("SHOW_MENU", true);
        }
        sessionManager = new SessionManager(requireContext());
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_employee_home, container, false);

        // Initialize Views
        tvEmployeeName = view.findViewById(R.id.tvEmployeeName);
        tvDate = view.findViewById(R.id.tvDate);
        tvActiveTasksSubtitle = view.findViewById(R.id.tvActiveTasksSubtitle);
        tvTotalAssigned = view.findViewById(R.id.tvTotalAssigned);
        tvInProgress = view.findViewById(R.id.tvInProgress);
        tvCompleted = view.findViewById(R.id.tvCompleted);
        tvDocuments = view.findViewById(R.id.tvDocuments);
        rvRecentTasks = view.findViewById(R.id.rvRecentTasks);
        btnViewAllTasks = view.findViewById(R.id.btnViewAllTasks);
        View btnProfile = view.findViewById(R.id.btnProfile);
        ivProfile = view.findViewById(R.id.ivProfile);

        // Setup Header Data
        tvEmployeeName.setText(sessionManager.getUserName());

        String currentDate = DateFormat.getDateInstance(DateFormat.FULL, Locale.getDefault()).format(new Date());
        if (tvDate != null)
            tvDate.setText(currentDate);

        // Setup RecyclerView
        rvRecentTasks.setLayoutManager(new LinearLayoutManager(getContext()));

        // Listeners
        if (btnProfile != null) {
            btnProfile.setOnClickListener(v -> {
                navigateToProfile();
            });
        }

        if (btnViewAllTasks != null) {
            btnViewAllTasks.setOnClickListener(v -> {
                if (getActivity() instanceof DashboardActivity) {
                    ((DashboardActivity) getActivity()).setBottomNavigationItem(R.id.nav_projects);
                }
            });
        }

        // Load Data
        fetchDashboardData(sessionManager.getUserEmail());
        fetchProfileImage();

        return view;
    }

    private void navigateToProfile() {
        if (getActivity() != null) {
            getActivity().getSupportFragmentManager().beginTransaction()
                    .replace(R.id.content_frame, new ProfileFragment())
                    .addToBackStack(null)
                    .commit();
            // Optionally update bottom nav selection to Profile if it exists
        }
    }

    private void fetchDashboardData(String email) {
        if (email == null || email.isEmpty()) {
            return;
        }

        ApiService apiService = ApiClient.getClient(getContext()).create(ApiService.class);

        // 1. Fetch Orders/Tasks
        apiService.getAssignedOrders(email).enqueue(new Callback<List<Order>>() {
            @Override
            public void onResponse(Call<List<Order>> call, Response<List<Order>> response) {
                if (!isAdded())
                    return;

                if (response.isSuccessful() && response.body() != null) {
                    List<Order> tasks = response.body();
                    setupStatsAndList(tasks);
                } else {
                    Log.e("EmployeeHome", "Failed to fetch orders: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<List<Order>> call, Throwable t) {
                if (!isAdded())
                    return;
                Log.e("EmployeeHome", "Network error: " + t.getMessage());
            }
        });

        // 2. Fetch Employee Stats (Documents)
        // Ensure "role" and "email" parameters match API requirement
        apiService.getEmployeeStats("EMPLOYEE", email).enqueue(new Callback<EmployeeDashboardStats>() {
            @Override
            public void onResponse(Call<EmployeeDashboardStats> call, Response<EmployeeDashboardStats> response) {
                if (!isAdded())
                    return;
                if (response.isSuccessful() && response.body() != null) {
                    if (tvDocuments != null) {
                        tvDocuments.setText(String.valueOf(response.body().getDocumentsForAssignedOrders()));
                    }
                }
            }

            @Override
            public void onFailure(Call<EmployeeDashboardStats> call, Throwable t) {
                Log.e("EmployeeHome", "Stats Fetch Error: " + t.getMessage());
            }
        });
    }

    private void fetchProfileImage() {
        // This is already done in DashboardActivity mostly, but if we want it here
        // inside fragment:
        // The layout has ivProfile.
        // We can replicate load logic or rely on cached/session data if available.
        // Simple fetch for now:
        ApiService apiService = ApiClient.getClient(getContext()).create(ApiService.class);
        apiService.getProfileImage().enqueue(new Callback<okhttp3.ResponseBody>() {
            @Override
            public void onResponse(Call<okhttp3.ResponseBody> call, Response<okhttp3.ResponseBody> response) {
                if (isAdded() && response.isSuccessful() && response.body() != null) {
                    android.graphics.Bitmap bmp = android.graphics.BitmapFactory
                            .decodeStream(response.body().byteStream());
                    if (bmp != null && ivProfile != null) {
                        ivProfile.setImageBitmap(bmp);
                    }
                }
            }

            @Override
            public void onFailure(Call<okhttp3.ResponseBody> call, Throwable t) {
            }
        });
    }

    private void setupStatsAndList(List<Order> tasks) {
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

        if (tvTotalAssigned != null)
            tvTotalAssigned.setText(String.valueOf(total));
        if (tvInProgress != null)
            tvInProgress.setText(String.valueOf(inProgress));
        if (tvCompleted != null)
            tvCompleted.setText(String.valueOf(completed));

        if (tvActiveTasksSubtitle != null) {
            tvActiveTasksSubtitle.setText("You have " + inProgress + " active tasks requiring attention today.");
        }

        // Limit to 5 for Recent List
        List<Order> recentTasks = tasks;
        if (tasks.size() > 5) {
            recentTasks = tasks.subList(0, 5);
        }

        taskAdapter = new EmployeeTaskAdapter(recentTasks);
        rvRecentTasks.setAdapter(taskAdapter);
    }
}
