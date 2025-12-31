package com.bizzfilling.app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ProgressBar;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.Order;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.text.NumberFormat;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AdminOrdersFragment extends Fragment {

    private RecyclerView recyclerView;
    private SwipeRefreshLayout swipeRefresh;
    private ProgressBar progressBar;
    private TextView tvEmptyState, tvTitle, tvSubtitle;
    private OrdersAdapter adapter;
    private ApiService apiService;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_admin_list, container, false);

        tvTitle = view.findViewById(R.id.tvPageTitle);
        tvSubtitle = view.findViewById(R.id.tvPageSubtitle);
        tvTitle.setText("Orders");
        tvSubtitle.setText("Track customer orders");
        tvSubtitle.setVisibility(View.VISIBLE);

        recyclerView = view.findViewById(R.id.recyclerView);
        swipeRefresh = view.findViewById(R.id.swipeRefresh);
        progressBar = view.findViewById(R.id.progressBar);
        tvEmptyState = view.findViewById(R.id.tvEmptyState);
        
        view.findViewById(R.id.fabAdd).setOnClickListener(v -> {
             Toast.makeText(getContext(), "Create Order feature coming soon", Toast.LENGTH_SHORT).show();
        });

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new OrdersAdapter();
        recyclerView.setAdapter(adapter);

        apiService = ApiClient.getClient(requireContext()).create(ApiService.class);
        loadData();
        swipeRefresh.setOnRefreshListener(this::loadData);

        return view;
    }

    private void loadData() {
        progressBar.setVisibility(View.VISIBLE);
        apiService.getAllOrders().enqueue(new Callback<List<Order>>() {
            @Override
            public void onResponse(Call<List<Order>> call, Response<List<Order>> response) {
                if (isAdded()) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    if (response.isSuccessful() && response.body() != null) {
                        List<Order> orders = response.body();
                        if (orders.isEmpty()) {
                            tvEmptyState.setVisibility(View.VISIBLE);
                            recyclerView.setVisibility(View.GONE);
                        } else {
                            tvEmptyState.setVisibility(View.GONE);
                            recyclerView.setVisibility(View.VISIBLE);
                            adapter.setOrders(orders);
                        }
                    } else {
                        Toast.makeText(getContext(), "Failed to load orders", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<List<Order>> call, Throwable t) {
                if (isAdded()) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private static class OrdersAdapter extends RecyclerView.Adapter<OrdersAdapter.ViewHolder> {
        private List<Order> orders = new ArrayList<>();
        private NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));

        void setOrders(List<Order> orders) {
            this.orders = orders;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_admin_order, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            Order order = orders.get(position);
            holder.tvOrderId.setText(order.getId() != null ? "#ORD-" + order.getId() : "#ORD-??");
            holder.tvService.setText(order.getServiceName() != null ? order.getServiceName() : "Service");
            holder.tvEmail.setText(order.getCustomerEmail() != null ? order.getCustomerEmail() : "No Email");
            
            Double amount = order.getTotalAmount();
            holder.tvAmount.setText(amount != null ? currencyFormat.format(amount) : "₹ 0.0");

            String status = order.getStatus() != null ? order.getStatus() : "Pending";
            holder.tvStatus.setText(status);
            
            // Status Colors
            if ("COMPLETED".equalsIgnoreCase(status) || "PAID".equalsIgnoreCase(status)) {
                 holder.tvStatus.setTextColor(0xFF10B981); // Green
                 holder.tvStatus.setBackgroundColor(0xFFECFDF5);
            } else if ("PENDING".equalsIgnoreCase(status)) {
                 holder.tvStatus.setTextColor(0xFFF59E0B); // Amber
                 holder.tvStatus.setBackgroundColor(0xFFFFFBEB);
            } else if ("CANCELLED".equalsIgnoreCase(status)) {
                 holder.tvStatus.setTextColor(0xFFEF4444); // Red
                 holder.tvStatus.setBackgroundColor(0xFFFEF2F2);
            } else {
                 holder.tvStatus.setTextColor(0xFF64748B); // Slate
                 holder.tvStatus.setBackgroundColor(0xFFF1F5F9);
            }
        }

        @Override
        public int getItemCount() {
            return orders.size();
        }

        static class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvOrderId, tvService, tvAmount, tvEmail, tvStatus;
            ViewHolder(@NonNull View itemView) {
                super(itemView);
                tvOrderId = itemView.findViewById(R.id.tvOrderId);
                tvService = itemView.findViewById(R.id.tvOrderService);
                tvAmount = itemView.findViewById(R.id.tvOrderAmount);
                tvEmail = itemView.findViewById(R.id.tvCustomerEmail);
                tvStatus = itemView.findViewById(R.id.tvOrderStatus);
            }
        }
    }
}
