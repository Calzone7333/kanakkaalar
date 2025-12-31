package com.bizzfilling.app;

import android.os.Bundle;
import android.util.Log;
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
import com.bizzfilling.app.api.models.Deal;
import com.bizzfilling.app.api.models.Lead;
import com.bizzfilling.app.components.BarChartView;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AdminCrmFragment extends Fragment {

    private TextView tvTotalLeads, tvActiveDeals, tvPipelineValue, tvConversionRate;
    private BarChartView chartDealStages;
    private RecyclerView rvRecentLeads;
    private RecentLeadsAdapter leadsAdapter;
    private ApiService apiService;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view;
        try {
            // Attempt to inflate the layout
            view = inflater.inflate(R.layout.fragment_admin_crm, container, false);
        } catch (Throwable e) {
            Log.e("AdminCrmFragment", "XML Inflation Error", e);
            TextView errorView = new TextView(getContext());
            errorView.setText("Error loading layout: " + e.getMessage());
            errorView.setPadding(32, 32, 32, 32);
            return errorView;
        }

        try {
            // Bind Views with null checks
            tvTotalLeads = view.findViewById(R.id.tvTotalLeads);
            tvActiveDeals = view.findViewById(R.id.tvActiveDeals);
            tvPipelineValue = view.findViewById(R.id.tvPipelineValue);
            tvConversionRate = view.findViewById(R.id.tvConversionRate);
            chartDealStages = view.findViewById(R.id.chartDealStages);
            rvRecentLeads = view.findViewById(R.id.rvRecentLeads);

            // Setup RecyclerView
            if (rvRecentLeads != null) {
                rvRecentLeads.setLayoutManager(new LinearLayoutManager(getContext()));
                leadsAdapter = new RecentLeadsAdapter();
                rvRecentLeads.setAdapter(leadsAdapter);
            }

            // Setup API
            if (getContext() != null) {
                apiService = ApiClient.getClient(getContext()).create(ApiService.class);
                // Fetch Data only if API service created successfully
                if (apiService != null) {
                    fetchLeads();
                    fetchDeals();
                }
            }

            // View All Action
            View btnViewAll = view.findViewById(R.id.btnViewAllLeads);
            if (btnViewAll != null) {
                btnViewAll.setOnClickListener(v -> {
                    if (getActivity() != null) {
                        getActivity().getSupportFragmentManager().beginTransaction()
                                .replace(R.id.content_frame, new AdminLeadsFragment())
                                .addToBackStack(null)
                                .commit();
                    }
                });
            }

        } catch (Exception e) {
            Log.e("AdminCrmFragment", "Initialization Error", e);
            if (getContext() != null) {
                Toast.makeText(getContext(), "Error initializing dashboard details", Toast.LENGTH_SHORT).show();
            }
        }

        return view;
    }

    private void fetchLeads() {
        if (apiService == null) return;
        apiService.getAllLeads().enqueue(new Callback<List<Lead>>() {
            @Override
            public void onResponse(Call<List<Lead>> call, Response<List<Lead>> response) {
                try {
                    if (isAdded() && response.isSuccessful() && response.body() != null) {
                        List<Lead> leads = response.body();
                        
                        if (tvTotalLeads != null) tvTotalLeads.setText(String.valueOf(leads.size()));
                        
                        if (leadsAdapter != null) {
                            int limit = Math.min(leads.size(), 5);
                            List<Lead> recentLeads = new ArrayList<>(leads.subList(0, limit));
                            leadsAdapter.setLeads(recentLeads);
                        }
                    }
                } catch (Exception e) {
                    Log.e("AdminCrmFragment", "Error processing leads", e);
                }
            }

            @Override
            public void onFailure(Call<List<Lead>> call, Throwable t) {
                Log.e("AdminCrmFragment", "Failed to fetch leads", t);
            }
        });
    }

    private void fetchDeals() {
        if (apiService == null) return;
        apiService.getAllDeals().enqueue(new Callback<List<Deal>>() {
            @Override
            public void onResponse(Call<List<Deal>> call, Response<List<Deal>> response) {
                try {
                    if (isAdded() && response.isSuccessful() && response.body() != null) {
                        List<Deal> deals = response.body();
                        calculateDealStats(deals);
                    }
                } catch (Exception e) {
                    Log.e("AdminCrmFragment", "Error processing deals", e);
                }
            }

            @Override
            public void onFailure(Call<List<Deal>> call, Throwable t) {
                Log.e("AdminCrmFragment", "Failed to fetch deals", t);
            }
        });
    }

    private void calculateDealStats(List<Deal> deals) {
        try {
            int activeCount = 0;
            int wonCount = 0;
            double pipelineValue = 0;
            Map<String, Integer> stagedistribution = new HashMap<>();

            for (Deal deal : deals) {
                String stage = deal.getStage();
                if (stage == null) stage = "Unknown";
                
                stagedistribution.put(stage, stagedistribution.getOrDefault(stage, 0) + 1);

                if ("Closed Won".equalsIgnoreCase(stage) || "Won".equalsIgnoreCase(stage)) {
                    wonCount++;
                } else if (!"Closed Lost".equalsIgnoreCase(stage) && !"Lost".equalsIgnoreCase(stage)) {
                    activeCount++;
                    if (deal.getAmount() != null) {
                        pipelineValue += deal.getAmount();
                    }
                }
            }

            if (tvActiveDeals != null) tvActiveDeals.setText(String.valueOf(activeCount));
            
            if (tvPipelineValue != null) {
                NumberFormat format = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
                tvPipelineValue.setText(format.format(pipelineValue));
            }

            if (tvConversionRate != null) {
                float conversionRate = deals.isEmpty() ? 0 : ((float) wonCount / deals.size()) * 100;
                tvConversionRate.setText(String.format(Locale.US, "%.1f%%", conversionRate));
            }

            if (chartDealStages != null) {
                List<BarChartView.BarData> chartData = new ArrayList<>();
                for (Map.Entry<String, Integer> entry : stagedistribution.entrySet()) {
                    // Safety: Ensure we pass float to BarData constructor.
                    // entry.getValue() is Integer. Unbox to int.
                    chartData.add(new BarChartView.BarData(entry.getKey(), (float)entry.getValue(), 0f));
                }
                if (chartData.size() > 5) {
                    chartData = chartData.subList(0, 5);
                }
                chartDealStages.setData(chartData);
            }
        } catch (Exception e) {
            Log.e("AdminCrmFragment", "Error calculating stats", e);
        }
    }

    private static class RecentLeadsAdapter extends RecyclerView.Adapter<RecentLeadsAdapter.LeadViewHolder> {
        private List<Lead> leads = new ArrayList<>();

        void setLeads(List<Lead> leads) {
            this.leads = leads;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public LeadViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            try {
                View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_crm_lead, parent, false);
                return new LeadViewHolder(view);
            } catch (Exception e) {
                Log.e("RecentLeadsAdapter", "Error inflating item view", e);
                // Return a dummy view to avoid crash, though RecyclerView might struggle.
                TextView tv = new TextView(parent.getContext());
                tv.setText("Error");
                return new LeadViewHolder(tv);
            }
        }

        @Override
        public void onBindViewHolder(@NonNull LeadViewHolder holder, int position) {
            try {
                // Check if holder views are null (if fallback used)
                if (holder.tvName == null) return; 

                Lead lead = leads.get(position);
                holder.tvName.setText(lead.getName() != null ? lead.getName() : "Unknown");
                holder.tvService.setText(lead.getService() != null ? lead.getService() : "N/A");
                String status = lead.getStatus() != null ? lead.getStatus() : "New";
                holder.tvStatus.setText(status);
                
                if ("New".equalsIgnoreCase(status)) {
                    holder.tvStatus.setTextColor(0xFFF97316); 
                    holder.tvStatus.setBackgroundColor(0xFFFFF7ED);
                } else if ("Contacted".equalsIgnoreCase(status)) {
                    holder.tvStatus.setTextColor(0xFF3B82F6); 
                    holder.tvStatus.setBackgroundColor(0xFFEFF6FF);
                } else if ("Qualified".equalsIgnoreCase(status)) {
                    holder.tvStatus.setTextColor(0xFF10B981); 
                    holder.tvStatus.setBackgroundColor(0xFFECFDF5);
                } else {
                    holder.tvStatus.setTextColor(0xFF64748B); 
                    holder.tvStatus.setBackgroundColor(0xFFF1F5F9);
                }
            } catch (Exception e) {
                Log.e("RecentLeadsAdapter", "Error binding view", e);
            }
        }

        @Override
        public int getItemCount() {
            return leads.size();
        }

        static class LeadViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvService, tvStatus;

            LeadViewHolder(@NonNull View itemView) {
                super(itemView);
                // Use safe logic in case itemView is the dummy TextView
                tvName = itemView.findViewById(R.id.tvLeadName);
                tvService = itemView.findViewById(R.id.tvLeadService);
                tvStatus = itemView.findViewById(R.id.tvLeadStatus);
            }
        }
    }
}
