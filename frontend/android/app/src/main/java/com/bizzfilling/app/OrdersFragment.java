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

public class OrdersFragment extends Fragment {

    private RecyclerView recyclerView;
    private OrdersAdapter adapter;
    private List<Order> orderList = new ArrayList<>();
    private TextView tvNoOrders;
    private TextView tvTitle;

    private String filterType = "ALL"; // Default to ALL

    public static OrdersFragment newInstance(String filterType) {
        OrdersFragment fragment = new OrdersFragment();
        Bundle args = new Bundle();
        args.putString("filterType", filterType);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            filterType = getArguments().getString("filterType", "ALL");
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_orders, container, false);

        recyclerView = view.findViewById(R.id.recyclerViewOrders);
        tvNoOrders = view.findViewById(R.id.tvNoOrders);
        tvTitle = view.findViewById(R.id.tvTitle);

        if ("DRAFTS".equals(filterType)) {
            tvTitle.setText("Drafts");
        } else {
            tvTitle.setText("My Orders");
        }

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new OrdersAdapter(orderList);
        recyclerView.setAdapter(adapter);

        fetchOrders();

        return view;
    }

    private void fetchOrders() {
        ApiService apiService = ApiClient.getClient(getContext()).create(ApiService.class);
        apiService.getAllOrders().enqueue(new Callback<List<Order>>() {
            @Override
            public void onResponse(Call<List<Order>> call, Response<List<Order>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    orderList.clear();
                    List<Order> allOrders = response.body();

                    if ("DRAFTS".equals(filterType)) {
                        for (Order order : allOrders) {
                            String status = order.getStatus();
                            if ("DRAFT".equalsIgnoreCase(status) ||
                                    "DOCUMENTS_PENDING".equalsIgnoreCase(status) ||
                                    "PENDING_PAYMENT".equalsIgnoreCase(status) ||
                                    "PAYMENT_COMPLETED".equalsIgnoreCase(status)) {
                                orderList.add(order);
                            }
                        }
                        tvNoOrders.setText("No Draft Orders Found");
                    } else {
                        orderList.addAll(allOrders);
                        tvNoOrders.setText("No Orders Found");
                    }

                    adapter.notifyDataSetChanged();

                    if (orderList.isEmpty()) {
                        tvNoOrders.setVisibility(View.VISIBLE);
                        recyclerView.setVisibility(View.GONE);
                    } else {
                        tvNoOrders.setVisibility(View.GONE);
                        recyclerView.setVisibility(View.VISIBLE);
                    }
                } else {
                    Toast.makeText(getContext(), "Failed to load orders", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Order>> call, Throwable t) {
                Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    // --- Adapter Class ---
    private class OrdersAdapter extends RecyclerView.Adapter<OrdersAdapter.OrderViewHolder> {
        private List<Order> orders;

        public OrdersAdapter(List<Order> orders) {
            this.orders = orders;
        }

        @NonNull
        @Override
        public OrderViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_order, parent, false);
            return new OrderViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull OrderViewHolder holder, int position) {
            Order order = orders.get(position);
            holder.tvOrderId.setText("Order #" + order.getId());
            holder.tvServiceName.setText(order.getServiceName());
            holder.tvAmount.setText("₹" + order.getTotalAmount());
            holder.tvStatus.setText(order.getStatus());

            // Simple status color logic
            if ("COMPLETED".equalsIgnoreCase(order.getStatus())) {
                holder.tvStatus.setTextColor(android.graphics.Color.parseColor("#16A34A")); // Green
                holder.tvStatus.setBackgroundColor(android.graphics.Color.parseColor("#DCFCE7"));
            } else if ("PENDING".equalsIgnoreCase(order.getStatus())) {
                holder.tvStatus.setTextColor(android.graphics.Color.parseColor("#D97706")); // Orange
                holder.tvStatus.setBackgroundColor(android.graphics.Color.parseColor("#FEF3C7"));
            } else {
                holder.tvStatus.setTextColor(android.graphics.Color.parseColor("#64748B")); // Grey
                holder.tvStatus.setBackgroundColor(android.graphics.Color.parseColor("#F1F5F9"));
            }

            holder.itemView.setOnClickListener(v -> {
                // Logic based on web app: If DRAFT or PENDING_PAYMENT, go to Wizard.
                // PAYMENT_COMPLETED goes to Details.
                if ("DRAFT".equalsIgnoreCase(order.getStatus()) ||
                        "DOCUMENTS_PENDING".equalsIgnoreCase(order.getStatus()) ||
                        "PENDING_PAYMENT".equalsIgnoreCase(order.getStatus()) ||
                        "PAYMENT_COMPLETED".equalsIgnoreCase(order.getStatus())) {

                    // Resume Order Flow
                    getParentFragmentManager().beginTransaction()
                            .replace(R.id.content_frame, ServiceOrderFragment.newInstance(
                                    String.valueOf(order.getId()),
                                    order.getServiceName(),
                                    "Resuming Application",
                                    String.valueOf(order.getTotalAmount())))
                            .addToBackStack(null)
                            .commit();
                } else {
                    // Navigate to Order Detail
                    // Use OrderDetailFragment if available
                    getParentFragmentManager().beginTransaction()
                            .replace(R.id.content_frame, OrderDetailFragment.newInstance(String.valueOf(order.getId())))
                            .addToBackStack(null)
                            .commit();
                }
            });
        }

        @Override
        public int getItemCount() {
            return orders.size();
        }

        class OrderViewHolder extends RecyclerView.ViewHolder {
            TextView tvOrderId, tvServiceName, tvAmount, tvStatus;

            public OrderViewHolder(@NonNull View itemView) {
                super(itemView);
                tvOrderId = itemView.findViewById(R.id.tvOrderId);
                tvServiceName = itemView.findViewById(R.id.tvServiceName);
                tvAmount = itemView.findViewById(R.id.tvAmount);
                tvStatus = itemView.findViewById(R.id.tvStatus);
            }
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if (getActivity() != null && getActivity() instanceof androidx.appcompat.app.AppCompatActivity) {
            androidx.appcompat.app.ActionBar actionBar = ((androidx.appcompat.app.AppCompatActivity) getActivity())
                    .getSupportActionBar();
            if (actionBar != null)
                actionBar.hide();
        }
    }

    @Override
    public void onStop() {
        super.onStop();
        if (getActivity() != null && getActivity() instanceof androidx.appcompat.app.AppCompatActivity) {
            androidx.appcompat.app.ActionBar actionBar = ((androidx.appcompat.app.AppCompatActivity) getActivity())
                    .getSupportActionBar();
            if (actionBar != null)
                actionBar.show();
        }
    }
}
