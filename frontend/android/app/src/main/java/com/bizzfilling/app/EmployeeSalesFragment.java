package com.bizzfilling.app;

import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
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

import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.Deal;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EmployeeSalesFragment extends Fragment {

    private TextView tvTotalRevenue, tvRealizedRevenue, tvPipelineValue, tvActiveClients;
    private RecyclerView rvHighValueOrders;
    private ProgressBar progressBar;
    private SalesAdapter adapter;
    private List<Deal> allDeals = new ArrayList<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_employee_sales, container, false);

        // Init Views
        tvTotalRevenue = view.findViewById(R.id.tvTotalRevenue);
        tvRealizedRevenue = view.findViewById(R.id.tvRealizedRevenue);
        tvPipelineValue = view.findViewById(R.id.tvPipelineValue);
        tvActiveClients = view.findViewById(R.id.tvActiveClients);
        rvHighValueOrders = view.findViewById(R.id.rvHighValueOrders);
        progressBar = view.findViewById(R.id.progressBar);

        // RecyclerView Setup
        rvHighValueOrders.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new SalesAdapter();
        rvHighValueOrders.setAdapter(adapter);

        loadDealsData();

        return view;
    }

    private void loadDealsData() {
        progressBar.setVisibility(View.VISIBLE);
        ApiService api = ApiClient.getClient(requireContext()).create(ApiService.class);

        api.getAllDeals().enqueue(new Callback<List<Deal>>() {
            @Override
            public void onResponse(Call<List<Deal>> call, Response<List<Deal>> response) {
                if (!isAdded())
                    return;
                progressBar.setVisibility(View.GONE);

                if (response.isSuccessful() && response.body() != null) {
                    allDeals = response.body();
                    calculateMetrics();
                } else {
                    // Toast.makeText(getContext(), "No deals found", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Deal>> call, Throwable t) {
                if (!isAdded())
                    return;
                progressBar.setVisibility(View.GONE);
                Toast.makeText(getContext(), "Failed to load deals", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void calculateMetrics() {
        double totalRevenue = 0;
        double realizedRevenue = 0;
        Set<String> clients = new HashSet<>();

        for (Deal d : allDeals) {
            double amount = d.getAmount() != null ? d.getAmount() : 0;
            totalRevenue += amount;

            if ("Won".equalsIgnoreCase(d.getStage())) {
                realizedRevenue += amount;
            }

            if (d.getCustomer() != null) {
                clients.add(d.getCustomer());
            }
        }

        double pipeline = totalRevenue - realizedRevenue;

        tvTotalRevenue.setText(formatCurrency(totalRevenue));
        tvRealizedRevenue.setText(formatCurrency(realizedRevenue));
        tvPipelineValue.setText(formatCurrency(pipeline));
        tvActiveClients.setText(String.valueOf(clients.size()));

        // High Value Deals (Top 5)
        List<Deal> sorted = new ArrayList<>(allDeals);
        Collections.sort(sorted, (d1, d2) -> {
            Double a1 = d1.getAmount() != null ? d1.getAmount() : 0;
            Double a2 = d2.getAmount() != null ? d2.getAmount() : 0;
            return a2.compareTo(a1); // Descending
        });

        adapter.setDeals(sorted.subList(0, Math.min(sorted.size(), 5)));
    }

    private String formatCurrency(double amount) {
        if (amount >= 100000) {
            return String.format(Locale.US, "₹%.2f L", amount / 100000);
        } else if (amount >= 1000) {
            return String.format(Locale.US, "₹%.1f k", amount / 1000);
        } else {
            return String.format(Locale.US, "₹%.0f", amount);
        }
    }

    // --- Adapter ---
    private class SalesAdapter extends RecyclerView.Adapter<SalesAdapter.ViewHolder> {
        private List<Deal> deals = new ArrayList<>();

        void setDeals(List<Deal> deals) {
            this.deals = deals;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_sales_order, parent, false);
            return new ViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            Deal d = deals.get(position);
            holder.tvClientEmail.setText(d.getCustomer() != null ? d.getCustomer() : "Unknown Client");
            holder.tvOrderService.setText(d.getName() != null ? d.getName() : "Deal");

            double amount = d.getAmount() != null ? d.getAmount() : 0;
            holder.tvOrderAmount.setText(formatCurrency(amount));

            String stage = d.getStage() != null ? d.getStage() : "New";
            holder.tvOrderStatus.setText(stage);

            // Dynamic Colors for Stage
            if ("Won".equalsIgnoreCase(stage)) {
                holder.tvOrderStatus.setTextColor(Color.parseColor("#059669")); // Green
                holder.tvOrderStatus.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#ECFDF5")));
            } else if ("Lost".equalsIgnoreCase(stage)) {
                holder.tvOrderStatus.setTextColor(Color.parseColor("#DC2626")); // Red
                holder.tvOrderStatus.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#FEF2F2")));
            } else {
                holder.tvOrderStatus.setTextColor(Color.parseColor("#D97706")); // Amber
                holder.tvOrderStatus.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#FFFBEB")));
            }
        }

        @Override
        public int getItemCount() {
            return deals.size();
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvClientEmail, tvOrderService, tvOrderAmount, tvOrderStatus;

            ViewHolder(View v) {
                super(v);
                tvClientEmail = v.findViewById(R.id.tvClientEmail);
                tvOrderService = v.findViewById(R.id.tvOrderService);
                tvOrderAmount = v.findViewById(R.id.tvOrderAmount);
                tvOrderStatus = v.findViewById(R.id.tvOrderStatus);
            }
        }
    }
}
