package com.bizzfilling.app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.Order;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UserReportsFragment extends Fragment {

    private TextView tvTotalOrders, tvInProgress, tvNeedsAttention, tvCompleted;
    private RecyclerView recyclerViewRecent;
    private DashboardOrdersAdapter recentAdapter;
    private List<Order> recentOrders = new ArrayList<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_user_reports, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Bind Views
        tvTotalOrders = view.findViewById(R.id.tvTotalOrders);
        tvInProgress = view.findViewById(R.id.tvInProgress);
        tvNeedsAttention = view.findViewById(R.id.tvNeedsAttention);
        tvCompleted = view.findViewById(R.id.tvCompleted);
        recyclerViewRecent = view.findViewById(R.id.recyclerViewRecent);

        // Setup RecyclerView
        recyclerViewRecent.setLayoutManager(new LinearLayoutManager(getContext()));
        // Note: We might need to make OrdersAdapter public static or extract it to use it here.
        // For now, I will assume we can reuse it or I'll implement a simple one if needed. 
        // Checking OrdersFragment code (not visible now but presumably has an adapter).
        // If I can't access it, I'll assume OrdersFragment.OrdersAdapter is accessible or create a local one.
        // To be safe and independent: I'll recommend creating a shared adapter or create a local basic one.
        
        loadDashboardData();
    }

    private void loadDashboardData() {
        ApiService apiService = ApiClient.getClient(getContext()).create(ApiService.class);
        apiService.getAllOrders().enqueue(new Callback<List<Order>>() {
            @Override
            public void onResponse(Call<List<Order>> call, Response<List<Order>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Order> orders = response.body();
                    calculateAndSetStats(orders);
                    setupRecentOrders(orders);
                } else {
                    Toast.makeText(getContext(), "Failed to load dashboard data", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Order>> call, Throwable t) {
                if (getContext() != null)
                    Toast.makeText(getContext(), "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void calculateAndSetStats(List<Order> orders) {
        int total = orders.size();
        int inProgress = 0;
        int needsAttention = 0;
        int completed = 0;

        for (Order order : orders) {
            String status = order.getStatus();
            if ("COMPLETED".equalsIgnoreCase(status)) {
                completed++;
            } else if ("DRAFT".equalsIgnoreCase(status) || 
                       "DOCUMENTS_PENDING".equalsIgnoreCase(status) || 
                       "PENDING_PAYMENT".equalsIgnoreCase(status) ||
                       "ACTION_REQUIRED".equalsIgnoreCase(status)) {
                needsAttention++;
                // Also count as in progress implicitly? Or separate? 
                // Usually "In Progress" means active processing by admin/employee.
            } else {
                // PROCESSING, ON_HOLD, etc.
                inProgress++;
            }
        }
        
        // Let's refine "In Progress" to include everything not completed, 
        // but "needs attention" splits out the user-actionable ones.
        // A simple mutually exclusive categorization:
        // Completed: COMPLETED
        // Needs Attention: DRAFT, DOCS_PENDING, PAYMENT_PENDING, ACTION_REQUIRED
        // In Progress: PROCESSING, ASSIGNED, REVIEWING, etc. (Default)
        
        // Recalculate mutually exclusive
        inProgress = 0; needsAttention = 0; completed = 0;
        for (Order order : orders) {
            String status = order.getStatus();
            if (status == null) status = "";
            
            if ("COMPLETED".equalsIgnoreCase(status)) {
                completed++;
            } else if ("DRAFT".equalsIgnoreCase(status) || 
                       "DOCUMENTS_PENDING".equalsIgnoreCase(status) || 
                       "PENDING_PAYMENT".equalsIgnoreCase(status) ||
                       "ACTION_REQUIRED".equalsIgnoreCase(status)) {
                needsAttention++;
            } else {
                inProgress++;
            }
        }

        tvTotalOrders.setText(String.valueOf(total));
        tvInProgress.setText(String.valueOf(inProgress));
        tvNeedsAttention.setText(String.valueOf(needsAttention));
        tvCompleted.setText(String.valueOf(completed));
    }

    private void setupRecentOrders(List<Order> orders) {
        // Sort by date (descending) - Assuming list comes sorted or we sort it?
        // Basic implementation: take first 5
        List<Order> recent = new ArrayList<>();
        int limit = Math.min(orders.size(), 5);
        for(int i=0; i<limit; i++) recent.add(orders.get(i));
        
        // We need an adapter. Since OrdersFragment.OrdersAdapter is likely private, 
        // let's define a simple one here or use a shared one.
        // I will assume I need to handle this.
        
        DashboardOrdersAdapter adapter = new DashboardOrdersAdapter(recent);
        recyclerViewRecent.setAdapter(adapter);
    }
    
    // Simple Adapter Class for Dashboard
    private class DashboardOrdersAdapter extends RecyclerView.Adapter<DashboardOrdersAdapter.ViewHolder> {
        private List<Order> items;

        DashboardOrdersAdapter(List<Order> items) {
            this.items = items;
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_order, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            Order order = items.get(position);
            holder.tvTitle.setText(order.getServiceName()); // Fixed: getTitle() -> getServiceName()
            holder.tvStatus.setText(order.getStatus());
            holder.tvId.setText("ID: " + order.getId()); // Fixed: getOrderId() -> getId()
            // holder.tvDate.setText(order.getCreatedAt()); // Fixed: tvDate removed as it's not in XML
            
            // Using tvCustomerEmail to show date for now, as tvDate doesn't exist in item_order.xml
            holder.tvCustomerEmail.setText("Date: " + order.getCreatedAt()); 
            
            // Basic Status Styling
            String status = order.getStatus();
            if ("COMPLETED".equalsIgnoreCase(status)) {
                 holder.tvStatus.setTextColor(android.graphics.Color.parseColor("#10B981")); // Green
            } else if ("DRAFT".equalsIgnoreCase(status)) {
                 holder.tvStatus.setTextColor(android.graphics.Color.parseColor("#9CA3AF")); // Gray
            } else {
                 holder.tvStatus.setTextColor(android.graphics.Color.parseColor("#EAB308")); // Yellow
            }
        }

        @Override
        public int getItemCount() {
            return items.size();
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvTitle, tvStatus, tvId, tvCustomerEmail; // Fixed: Removed tvDate

            ViewHolder(@NonNull View itemView) {
                super(itemView);
                tvTitle = itemView.findViewById(R.id.tvServiceName);
                tvStatus = itemView.findViewById(R.id.tvStatus);
                tvId = itemView.findViewById(R.id.tvOrderId);
                tvCustomerEmail = itemView.findViewById(R.id.tvCustomerEmail); // Mapped to existing ID
            }
        }
    }
}
