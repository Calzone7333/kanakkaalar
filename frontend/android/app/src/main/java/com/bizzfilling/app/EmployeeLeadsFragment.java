package com.bizzfilling.app;

import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageView;
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
import com.bizzfilling.app.api.models.Lead;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EmployeeLeadsFragment extends Fragment {

    private TextView tvNewLeads, tvConverted, tvLost, tvFollowUps;
    private RecyclerView rvLeads;
    private ProgressBar progressBar;
    private EditText etSearch;
    private FloatingActionButton fabAddLead;

    private LeadAdapter adapter;
    private List<Lead> allLeads = new ArrayList<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_employee_leads, container, false);

        // Init Views
        tvNewLeads = view.findViewById(R.id.tvNewLeads);
        tvConverted = view.findViewById(R.id.tvConverted);
        tvLost = view.findViewById(R.id.tvLost);
        tvFollowUps = view.findViewById(R.id.tvFollowUps);
        rvLeads = view.findViewById(R.id.rvLeads);
        progressBar = view.findViewById(R.id.progressBar);
        etSearch = view.findViewById(R.id.etSearch);
        fabAddLead = view.findViewById(R.id.fabAddLead);

        // RecyclerView Setup
        rvLeads.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new LeadAdapter();
        rvLeads.setAdapter(adapter);

        // Load Data
        loadLeads();

        // Search Listener
        if (etSearch != null) {
            etSearch.addTextChangedListener(new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                }

                @Override
                public void onTextChanged(CharSequence s, int start, int before, int count) {
                    filterLeads(s.toString());
                }

                @Override
                public void afterTextChanged(Editable s) {
                }
            });
        }

        // Add Lead Click
        if (fabAddLead != null) {
            fabAddLead.setOnClickListener(v -> {
                Toast.makeText(getContext(), "Add Lead Feature Coming Soon", Toast.LENGTH_SHORT).show();
            });
        }

        return view;
    }

    private void loadLeads() {
        progressBar.setVisibility(View.VISIBLE);
        ApiService api = ApiClient.getClient(requireContext()).create(ApiService.class);

        api.getAllLeads().enqueue(new Callback<List<Lead>>() {
            @Override
            public void onResponse(Call<List<Lead>> call, Response<List<Lead>> response) {
                if (!isAdded())
                    return;
                progressBar.setVisibility(View.GONE);

                if (response.isSuccessful() && response.body() != null) {
                    allLeads = response.body();
                    calculateStats();
                    adapter.setLeads(allLeads);
                }
            }

            @Override
            public void onFailure(Call<List<Lead>> call, Throwable t) {
                if (!isAdded())
                    return;
                progressBar.setVisibility(View.GONE);
                // Toast.makeText(getContext(), "Failed to load leads",
                // Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void filterLeads(String query) {
        if (query.isEmpty()) {
            adapter.setLeads(allLeads);
            return;
        }

        List<Lead> filtered = new ArrayList<>();
        String q = query.toLowerCase();
        for (Lead l : allLeads) {
            boolean matchName = l.getName() != null && l.getName().toLowerCase().contains(q);
            boolean matchEmail = l.getEmail() != null && l.getEmail().toLowerCase().contains(q);
            if (matchName || matchEmail) {
                filtered.add(l);
            }
        }
        adapter.setLeads(filtered);
    }

    private void calculateStats() {
        int newLeads = 0;
        int converted = 0;
        int lost = 0;
        int followUps = 0;

        for (Lead l : allLeads) {
            String status = l.getStatus();
            if (status == null)
                status = "";

            if (status.equalsIgnoreCase("New"))
                newLeads++;
            else if (status.equalsIgnoreCase("Converted"))
                converted++;
            else if (status.equalsIgnoreCase("Lost"))
                lost++;
            else if (status.equalsIgnoreCase("Contacted"))
                followUps++;
        }

        tvNewLeads.setText(String.valueOf(newLeads));
        tvConverted.setText(String.valueOf(converted));
        tvLost.setText(String.valueOf(lost));
        tvFollowUps.setText(String.valueOf(followUps));
    }

    // --- Adapter ---
    private class LeadAdapter extends RecyclerView.Adapter<LeadAdapter.ViewHolder> {
        private List<Lead> leads = new ArrayList<>();

        void setLeads(List<Lead> leads) {
            this.leads = leads;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_lead, parent, false);
            return new ViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            Lead l = leads.get(position);
            holder.tvName.setText(l.getName() != null ? l.getName() : "Unknown");
            holder.tvService.setText(l.getService() != null ? l.getService() : "N/A");
            holder.tvPhone.setText(l.getPhone() != null ? l.getPhone() : "-");
            holder.tvEmail.setText(l.getEmail() != null ? l.getEmail() : "-");

            String status = l.getStatus() != null ? l.getStatus() : "New";
            holder.tvStatus.setText(status);

            // Color & Bg
            int color, bgTint;
            if ("Converted".equalsIgnoreCase(status)) {
                color = Color.parseColor("#16A34A"); // Green
                bgTint = Color.parseColor("#F0FDF4");
            } else if ("Lost".equalsIgnoreCase(status)) {
                color = Color.parseColor("#DC2626"); // Red
                bgTint = Color.parseColor("#FEF2F2");
            } else if ("Contacted".equalsIgnoreCase(status)) {
                color = Color.parseColor("#D97706"); // Amber
                bgTint = Color.parseColor("#FFFBEB");
            } else {
                color = Color.parseColor("#2563EB"); // Blue
                bgTint = Color.parseColor("#EFF6FF");
            }

            holder.tvStatus.setTextColor(color);
            holder.tvStatus.setBackgroundTintList(ColorStateList.valueOf(bgTint));
        }

        @Override
        public int getItemCount() {
            return leads.size();
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvService, tvStatus, tvPhone, tvEmail;

            ViewHolder(View v) {
                super(v);
                tvName = v.findViewById(R.id.tvLeadName);
                tvService = v.findViewById(R.id.tvLeadService);
                tvStatus = v.findViewById(R.id.tvLeadStatus);
                tvPhone = v.findViewById(R.id.tvLeadPhone);
                tvEmail = v.findViewById(R.id.tvLeadEmail);
            }
        }
    }
}
