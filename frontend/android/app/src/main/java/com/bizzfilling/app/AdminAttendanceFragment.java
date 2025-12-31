package com.bizzfilling.app;

import android.os.Bundle;
import android.util.Log;
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
import com.bizzfilling.app.api.models.AttendanceRecord;
import com.bizzfilling.app.components.PieChartView;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AdminAttendanceFragment extends Fragment {

    private RecyclerView recyclerView;
    private SwipeRefreshLayout swipeRefresh;
    private ProgressBar progressBar;
    private TextView tvEmptyState;
    private PieChartView chartAttendance;
    private AttendanceAdapter adapter;
    private ApiService apiService;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_admin_attendance, container, false);

        // Init Views
        recyclerView = view.findViewById(R.id.rvAttendance);
        swipeRefresh = view.findViewById(R.id.swipeRefresh);
        progressBar = view.findViewById(R.id.progressBar);
        tvEmptyState = view.findViewById(R.id.tvEmptyState);
        chartAttendance = view.findViewById(R.id.chartAttendance);

        // Setup RecyclerView
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new AttendanceAdapter();
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
        apiService.getAllAttendance().enqueue(new Callback<List<AttendanceRecord>>() {
            @Override
            public void onResponse(Call<List<AttendanceRecord>> call, Response<List<AttendanceRecord>> response) {
                if (isAdded()) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    if (response.isSuccessful() && response.body() != null) {
                        processAttendanceData(response.body());
                    } else {
                        Toast.makeText(getContext(), "Failed to load attendance", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<List<AttendanceRecord>> call, Throwable t) {
                if (isAdded()) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void processAttendanceData(List<AttendanceRecord> allRecords) {
        String todayDate = new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
        List<AttendanceRecord> todayRecords = new ArrayList<>();
        
        int present = 0;
        int absent = 0;
        int late = 0;

        for (AttendanceRecord record : allRecords) {
            // Check if record date matches today. Assuming API returns "yyyy-MM-dd" or ISO format starting with it.
            String recordDate = record.getDate();
            if (recordDate != null && recordDate.startsWith(todayDate)) {
                todayRecords.add(record);
                
                String status = record.getStatus();
                if ("Present".equalsIgnoreCase(status)) present++;
                else if ("Late".equalsIgnoreCase(status)) late++;
                else if ("Absent".equalsIgnoreCase(status)) absent++;
                else present++; // Default to present if checked in but no specific status
            }
        }

        // Update List
        if (todayRecords.isEmpty()) {
            tvEmptyState.setVisibility(View.VISIBLE);
            recyclerView.setVisibility(View.GONE);
        } else {
            tvEmptyState.setVisibility(View.GONE);
            recyclerView.setVisibility(View.VISIBLE);
            adapter.setRecords(todayRecords);
        }

        // Update Chart
        List<PieChartView.PieSlice> slices = new ArrayList<>();
        if (present > 0) slices.add(new PieChartView.PieSlice(present, 0xFF10B981)); // Green
        if (late > 0) slices.add(new PieChartView.PieSlice(late, 0xFFF59E0B)); // Amber
        if (absent > 0) slices.add(new PieChartView.PieSlice(absent, 0xFFEF4444)); // Red
        
        // If no data, show a dummy slice
        if (slices.isEmpty()) slices.add(new PieChartView.PieSlice(1, 0xFFE2E8F0)); // Gray
        
        chartAttendance.setData(slices);
    }

    private static class AttendanceAdapter extends RecyclerView.Adapter<AttendanceAdapter.ViewHolder> {
        private List<AttendanceRecord> records = new ArrayList<>();

        void setRecords(List<AttendanceRecord> records) {
            this.records = records;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            // Using a simple generic item layout or create one. 
            // Reusing item_admin_lead for simplicity for now, or creating item_attendance_record.
            // Let's create a simplified inline View Holder for now within standard simple_list_item_2 style or similar?
            // No, consistency implies I should create a layout. "item_admin_attendance.xml"
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_admin_attendance, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            AttendanceRecord record = records.get(position);
            String name = (record.getUser() != null) ? record.getUser().getFullName() : "Unknown";
            holder.tvName.setText(name);
            holder.tvTime.setText("In: " + formatDate(record.getCheckInTime()) + " | Out: " + formatDate(record.getCheckOutTime()));
            
            String status = record.getStatus() != null ? record.getStatus() : "Present";
            holder.tvStatus.setText(status);

            if ("Present".equalsIgnoreCase(status)) {
                holder.tvStatus.setTextColor(0xFF10B981);
                holder.tvStatus.setBackgroundColor(0xFFECFDF5);
            } else if ("Late".equalsIgnoreCase(status)) {
                holder.tvStatus.setTextColor(0xFFF59E0B);
                holder.tvStatus.setBackgroundColor(0xFFFFFBEB);
            } else {
                holder.tvStatus.setTextColor(0xFFEF4444);
                holder.tvStatus.setBackgroundColor(0xFFFEF2F2);
            }
        }

        private String formatDate(String dateStr) {
            if (dateStr == null) return "-";
            try {
                // Assuming ISO format
                 SimpleDateFormat inputStart = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US);
                 SimpleDateFormat output = new SimpleDateFormat("hh:mm a", Locale.US);
                 Date d = inputStart.parse(dateStr);
                 return output.format(d);
            } catch (Exception e) {
                return dateStr;
            }
        }

        @Override
        public int getItemCount() {
            return records.size();
        }

        static class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvTime, tvStatus;
            ViewHolder(@NonNull View itemView) {
                super(itemView);
                tvName = itemView.findViewById(R.id.tvName);
                tvTime = itemView.findViewById(R.id.tvTime);
                tvStatus = itemView.findViewById(R.id.tvStatus);
            }
        }
    }
}
