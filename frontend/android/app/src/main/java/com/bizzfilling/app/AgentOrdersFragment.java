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
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.Order;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AgentOrdersFragment extends Fragment {

    private RecyclerView recyclerView;
    private SwipeRefreshLayout swipeRefresh;
    private AgentOrdersAdapter adapter;
    private ApiService apiService;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_agent_orders, container, false);

        apiService = ApiClient.getClient(requireContext()).create(ApiService.class);

        recyclerView = view.findViewById(R.id.recyclerView);
        swipeRefresh = view.findViewById(R.id.swipeRefresh);

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new AgentOrdersAdapter();
        recyclerView.setAdapter(adapter);

        swipeRefresh.setOnRefreshListener(this::loadData);

        loadData();
        return view;
    }

    private void loadData() {
        swipeRefresh.setRefreshing(true);
        apiService.getAllOrders().enqueue(new Callback<List<Order>>() {
            @Override
            public void onResponse(Call<List<Order>> call, Response<List<Order>> response) {
                if (!isAdded())
                    return;
                swipeRefresh.setRefreshing(false);
                if (response.isSuccessful() && response.body() != null) {
                    adapter.setOrders(response.body());
                } else {
                    Toast.makeText(getContext(), "Failed to load orders", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Order>> call, Throwable t) {
                if (!isAdded())
                    return;
                swipeRefresh.setRefreshing(false);
                Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    // Adapter
    private static class AgentOrdersAdapter extends RecyclerView.Adapter<AgentOrdersAdapter.ViewHolder> {
        private List<Order> list = new ArrayList<>();

        void setOrders(List<Order> list) {
            this.list = list;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_agent_order, parent, false);
            return new ViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            Order order = list.get(position);
            holder.tvServiceName.setText(order.getServiceName());
            holder.tvClient
                    .setText("Client: " + (order.getCustomerEmail() != null ? order.getCustomerEmail() : "Unknown"));
            holder.tvOrderId.setText("Order #" + order.getId());

            // Status
            String status = order.getStatus() != null ? order.getStatus() : "Pending";
            holder.tvStatus.setText(" " + status + " "); // Padding via text for simplicity or spaces

            // Color Logic
            int statusBgColor;
            int statusTextColor;

            if ("COMPLETED".equalsIgnoreCase(status)) {
                statusBgColor = 0xFFECFDF5;
                statusTextColor = 0xFF059669;
            } else if ("PROCESSING".equalsIgnoreCase(status)) {
                statusBgColor = 0xFFEFF6FF;
                statusTextColor = 0xFF3B82F6;
            } else if ("CANCELLED".equalsIgnoreCase(status)) {
                statusBgColor = 0xFFFEF2F2;
                statusTextColor = 0xFFEF4444;
            } else { // PENDING
                statusBgColor = 0xFFFFFBEB;
                statusTextColor = 0xFFD97706;
            }

            holder.tvStatus.setBackgroundColor(statusBgColor);
            holder.tvStatus.setTextColor(statusTextColor);

            // Earnings Mock
            holder.tvEarnings.setText("Earn: ₹0 (Est)");
        }

        @Override
        public int getItemCount() {
            return list.size();
        }

        static class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvServiceName, tvClient, tvOrderId, tvStatus, tvEarnings;

            ViewHolder(View v) {
                super(v);
                tvServiceName = v.findViewById(R.id.tvServiceName);
                tvClient = v.findViewById(R.id.tvClient);
                tvOrderId = v.findViewById(R.id.tvOrderId);
                tvStatus = v.findViewById(R.id.tvStatus);
                tvEarnings = v.findViewById(R.id.tvEarnings);
            }
        }
    }
}
