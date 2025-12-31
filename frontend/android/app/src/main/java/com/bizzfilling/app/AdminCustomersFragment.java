package com.bizzfilling.app;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.CustomerProfile;
import com.bizzfilling.app.components.PieChartView;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AdminCustomersFragment extends Fragment {

    private RecyclerView recyclerView;
    private SwipeRefreshLayout swipeRefresh;
    private ProgressBar progressBar;
    private TextView tvEmptyState, tvSubtitle;
    private PieChartView chartCustomers;
    private CustomerAdapter adapter;
    private ApiService apiService;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_admin_customers, container, false);

        // Init Views
        recyclerView = view.findViewById(R.id.rvCustomers);
        swipeRefresh = view.findViewById(R.id.swipeRefresh);
        progressBar = view.findViewById(R.id.progressBar);
        tvEmptyState = view.findViewById(R.id.tvEmptyState);
        chartCustomers = view.findViewById(R.id.chartCustomers);
        tvSubtitle = view.findViewById(R.id.tvSubtitle);

        // Setup RecyclerView
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new CustomerAdapter();
        recyclerView.setAdapter(adapter);

        // API Setup
        apiService = ApiClient.getClient(requireContext()).create(ApiService.class);

        // Load Data
        loadData();

        swipeRefresh.setOnRefreshListener(this::loadData);

        return view;
    }

    private void loadData() {
        progressBar.setVisibility(View.VISIBLE);
        apiService.getAllCustomerProfiles().enqueue(new Callback<List<CustomerProfile>>() {
            @Override
            public void onResponse(Call<List<CustomerProfile>> call, Response<List<CustomerProfile>> response) {
                if (isAdded()) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    if (response.isSuccessful() && response.body() != null) {
                        processCustomerData(response.body());
                    } else {
                        Toast.makeText(getContext(), "Failed to load customers", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<List<CustomerProfile>> call, Throwable t) {
                if (isAdded()) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void processCustomerData(List<CustomerProfile> profiles) {
        tvSubtitle.setText(profiles.size() + " customers found");
        
        int active = 0;
        int pending = 0;
        int inactive = 0;

        for (CustomerProfile profile : profiles) {
            String status = profile.getStatus();
            if ("Active".equalsIgnoreCase(status)) active++;
            else if ("Pending".equalsIgnoreCase(status)) pending++;
            else inactive++; // Include 'Inactive', 'Blocked', etc.
        }

        // Update List
        if (profiles.isEmpty()) {
            tvEmptyState.setVisibility(View.VISIBLE);
            recyclerView.setVisibility(View.GONE);
        } else {
            tvEmptyState.setVisibility(View.GONE);
            recyclerView.setVisibility(View.VISIBLE);
            adapter.setCustomers(profiles);
        }

        // Update Chart
        List<PieChartView.PieSlice> slices = new ArrayList<>();
        if (active > 0) slices.add(new PieChartView.PieSlice(active, 0xFF10B981)); // Green
        if (pending > 0) slices.add(new PieChartView.PieSlice(pending, 0xFFF59E0B)); // Amber
        if (inactive > 0) slices.add(new PieChartView.PieSlice(inactive, 0xFFEF4444)); // Red
        
        if (slices.isEmpty()) slices.add(new PieChartView.PieSlice(1, 0xFFE2E8F0)); // Gray
        
        chartCustomers.setData(slices);
    }

    private static class CustomerAdapter extends RecyclerView.Adapter<CustomerAdapter.ViewHolder> {
        private List<CustomerProfile> customers = new ArrayList<>();

        void setCustomers(List<CustomerProfile> customers) {
            this.customers = customers;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_admin_customer, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            CustomerProfile profile = customers.get(position);
            String name = (profile.getUser() != null) ? profile.getUser().getFullName() : "N/A";
            String email = (profile.getUser() != null) ? profile.getUser().getEmail() : "N/A";
            String phone = (profile.getUser() != null) ? profile.getUser().getPhone() : profile.getWhatsappNumber();
            
            holder.tvName.setText(name);
            holder.tvEmail.setText(email);
            holder.tvPhone.setText(phone != null ? phone : "");
            
            // Initials
            if (name != null && !name.isEmpty()) {
                String initial = name.substring(0, 1).toUpperCase();
                holder.tvInitial.setText(initial);
            }

            String status = profile.getStatus() != null ? profile.getStatus() : "Active";
            holder.tvStatus.setText(status);

            if ("Active".equalsIgnoreCase(status)) {
                holder.tvStatus.setTextColor(0xFF10B981);
                holder.tvStatus.setBackgroundColor(0xFFECFDF5);
            } else if ("Pending".equalsIgnoreCase(status)) {
                holder.tvStatus.setTextColor(0xFFF59E0B);
                holder.tvStatus.setBackgroundColor(0xFFFFFBEB);
            } else {
                holder.tvStatus.setTextColor(0xFFEF4444);
                holder.tvStatus.setBackgroundColor(0xFFFEF2F2);
            }
        }

        @Override
        public int getItemCount() {
            return customers.size();
        }

        static class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvEmail, tvPhone, tvStatus, tvInitial;
            ViewHolder(@NonNull View itemView) {
                super(itemView);
                tvName = itemView.findViewById(R.id.tvName);
                tvEmail = itemView.findViewById(R.id.tvEmail);
                tvPhone = itemView.findViewById(R.id.tvPhone);
                tvStatus = itemView.findViewById(R.id.tvStatus);
                tvInitial = itemView.findViewById(R.id.tvInitial);
            }
        }
    }
}
