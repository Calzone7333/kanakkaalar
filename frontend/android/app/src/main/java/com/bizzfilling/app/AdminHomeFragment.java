package com.bizzfilling.app;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.bizzfilling.app.utils.SessionManager;

public class AdminHomeFragment extends Fragment {

    private TextView tvTotalRevenue, tvTotalEmployees, tvTotalAgents, tvTotalCustomers, tvTotalLeads, tvTotalDeals;
    private  com.bizzfilling.app.components.PieChartView pieChart;
    private com.bizzfilling.app.components.BarChartView barChart;
    private com.bizzfilling.app.components.LineChartView lineChart;
    private SessionManager sessionManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = null;
        try {
            view = inflater.inflate(R.layout.fragment_admin_home, container, false);
            sessionManager = new SessionManager(requireContext());

            // Bind Views
            tvTotalRevenue = view.findViewById(R.id.tvTotalRevenue);
            tvTotalEmployees = view.findViewById(R.id.tvTotalEmployees);
            tvTotalAgents = view.findViewById(R.id.tvTotalAgents);
            tvTotalDeals = view.findViewById(R.id.tvTotalDeals);
            tvTotalCustomers = view.findViewById(R.id.tvTotalCustomers);
            tvTotalLeads = view.findViewById(R.id.tvTotalLeads);
            pieChart = view.findViewById(R.id.pieChartOrders);
            barChart = view.findViewById(R.id.barChartTrend);
            lineChart = view.findViewById(R.id.lineChartRevenue);

            // Fetch Dashboard Data
            if (isAdded()) {
                fetchDashboardData();
            }

            // Quick Actions Listeners
            view.findViewById(R.id.btnQuickAddEmployee).setOnClickListener(v -> android.widget.Toast.makeText(getContext(), "Add Employee Clicked", android.widget.Toast.LENGTH_SHORT).show());
            view.findViewById(R.id.btnQuickAddAgent).setOnClickListener(v -> android.widget.Toast.makeText(getContext(), "Add Agent Clicked", android.widget.Toast.LENGTH_SHORT).show());
            view.findViewById(R.id.btnQuickReports).setOnClickListener(v -> android.widget.Toast.makeText(getContext(), "Reports Clicked", android.widget.Toast.LENGTH_SHORT).show());
            view.findViewById(R.id.btnQuickSettings).setOnClickListener(v -> android.widget.Toast.makeText(getContext(), "Settings Clicked", android.widget.Toast.LENGTH_SHORT).show());

        } catch (Exception e) {
            e.printStackTrace();
            // Fallback to simple view if something explodes
            TextView errorView = new TextView(getContext());
            errorView.setText("Error loading dashboard: " + e.getMessage());
            errorView.setPadding(32, 32, 32, 32);
            return errorView;
        }

        return view;
    }

    private void fetchDashboardData() {
        com.bizzfilling.app.api.ApiService apiService = com.bizzfilling.app.api.ApiClient.getClient(requireContext()).create(com.bizzfilling.app.api.ApiService.class);
        apiService.getAdminDashboardStats().enqueue(new retrofit2.Callback<com.bizzfilling.app.api.models.DashboardStatsResponse>() {
            @Override
            public void onResponse(retrofit2.Call<com.bizzfilling.app.api.models.DashboardStatsResponse> call, retrofit2.Response<com.bizzfilling.app.api.models.DashboardStatsResponse> response) {
                try {
                    if (response.isSuccessful() && response.body() != null) {
                        com.bizzfilling.app.api.models.DashboardStatsResponse stats = response.body();
                        
                        if (tvTotalRevenue != null) {
                            java.text.NumberFormat format = java.text.NumberFormat.getCurrencyInstance(new java.util.Locale("en", "IN"));
                            tvTotalRevenue.setText(format.format(stats.getTotalRevenue()));
                        }
                        if (tvTotalEmployees != null) tvTotalEmployees.setText(String.valueOf(stats.getTotalEmployees()));
                        if (tvTotalAgents != null) tvTotalAgents.setText(String.valueOf(stats.getTotalAgents()));
                        if (tvTotalCustomers != null) tvTotalCustomers.setText(String.valueOf(stats.getTotalCustomers()));
                        if (tvTotalLeads != null) tvTotalLeads.setText(String.valueOf(stats.getTotalLeads()));
                        if (tvTotalDeals != null) tvTotalDeals.setText(String.valueOf(stats.getTotalDeals()));

                        // Update Pie Chart
                        if (pieChart != null && stats.getOrderStatusChart() != null) {
                            java.util.List<com.bizzfilling.app.components.PieChartView.PieSlice> slices = new java.util.ArrayList<>();
                            int[] fallbackColors = {0xFF10B981, 0xFF3B82F6, 0xFFF59E0B, 0xFFEF4444, 0xFFA855F7, 0xFFEC4899};
                            int index = 0;
                            
                            for (com.bizzfilling.app.api.models.DashboardStatsResponse.ChartData data : stats.getOrderStatusChart()) {
                                if (data == null) continue; // Skip null data
                                int color;
                                String name = data.getName() != null ? data.getName().trim() : "";
                                
                                if ("Completed".equalsIgnoreCase(name)) color = 0xFF10B981; // Green
                                else if ("Processing".equalsIgnoreCase(name)) color = 0xFF3B82F6; // Blue
                                else if ("Pending".equalsIgnoreCase(name)) color = 0xFFF59E0B; // Amber
                                else if ("Cancelled".equalsIgnoreCase(name)) color = 0xFFEF4444; // Red
                                else {
                                    color = fallbackColors[index % fallbackColors.length];
                                }
                                
                                slices.add(new com.bizzfilling.app.components.PieChartView.PieSlice(data.getValue(), color));
                                index++;
                            }
                            pieChart.setData(slices);
                        }

                        // Update Bar Chart
                        if (barChart != null && stats.getLeadsVsDealsChart() != null) {
                            java.util.List<com.bizzfilling.app.components.BarChartView.BarData> barData = new java.util.ArrayList<>();
                            for (com.bizzfilling.app.api.models.DashboardStatsResponse.ChartData data : stats.getLeadsVsDealsChart()) {
                               if (data == null) continue; // Skip null data
                               barData.add(new com.bizzfilling.app.components.BarChartView.BarData(
                                   data.getName() != null ? data.getName() : "", 
                                   (float)data.getLeads(), 
                                   (float)data.getDeals()
                               ));
                            }
                            barChart.setData(barData);
                        }

                        // Update Revenue Line Chart (Mock Trend based on Total Revenue)
                        if (lineChart != null) { // Use member variable
                            java.util.List<Float> points = new java.util.ArrayList<>();
                            float total = (float) stats.getTotalRevenue();
                            if (total == 0) total = 100000;
                            
                            points.add(total * 0.4f);
                            points.add(total * 0.55f);
                            points.add(total * 0.45f);
                            points.add(total * 0.7f);
                            points.add(total * 0.85f);
                            points.add(total); 
                            
                            lineChart.setData(points);
                        }

                    } else {
                        android.widget.Toast.makeText(getContext(), "Failed to load stats: " + response.code(), android.widget.Toast.LENGTH_SHORT).show();
                    }
                } catch (Exception e) {
                    e.printStackTrace(); // Log error preventing crash
                }
            }

            @Override
            public void onFailure(retrofit2.Call<com.bizzfilling.app.api.models.DashboardStatsResponse> call, Throwable t) {
                android.widget.Toast.makeText(getContext(), "Network error: " + t.getMessage(), android.widget.Toast.LENGTH_SHORT).show();
            }
        });
    }
}
