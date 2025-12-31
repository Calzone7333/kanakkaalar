package com.bizzfilling.app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ProgressBar;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.textfield.TextInputEditText;

import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.Lead;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AdminLeadsFragment extends Fragment {

    private RecyclerView recyclerView;
    private SwipeRefreshLayout swipeRefresh;
    private ProgressBar progressBar;
    private TextView tvEmptyState;
    private LeadsAdapter adapter;
    private ApiService apiService;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_admin_list, container, false);

        // Setup Header
        TextView tvTitle = view.findViewById(R.id.tvPageTitle);
        TextView tvSubtitle = view.findViewById(R.id.tvPageSubtitle);
        tvTitle.setText("Leads");
        tvSubtitle.setText("Manage sales leads");
        tvSubtitle.setVisibility(View.VISIBLE);

        // Init Views
        recyclerView = view.findViewById(R.id.recyclerView);
        swipeRefresh = view.findViewById(R.id.swipeRefresh);
        progressBar = view.findViewById(R.id.progressBar);
        tvEmptyState = view.findViewById(R.id.tvEmptyState);
        
        view.findViewById(R.id.fabAdd).setOnClickListener(v -> showAddLeadDialog());

        // Setup RecyclerView
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new LeadsAdapter();
        recyclerView.setAdapter(adapter);

        // API Setup
        apiService = ApiClient.getClient(requireContext()).create(ApiService.class);

        // Load Data
        loadData();

        swipeRefresh.setOnRefreshListener(this::loadData);

        return view;
    }

    private void showAddLeadDialog() {
        if (getContext() == null) return;
        BottomSheetDialog dialog = new BottomSheetDialog(getContext(), R.style.BottomSheetDialogTheme);
        View sheetView = getLayoutInflater().inflate(R.layout.dialog_add_lead, null);
        dialog.setContentView(sheetView);

        TextInputEditText etName = sheetView.findViewById(R.id.etName);
        TextInputEditText etEmail = sheetView.findViewById(R.id.etEmail);
        TextInputEditText etPhone = sheetView.findViewById(R.id.etPhone);
        TextInputEditText etService = sheetView.findViewById(R.id.etService);
        AutoCompleteTextView ddStatus = sheetView.findViewById(R.id.ddStatus);
        View btnSave = sheetView.findViewById(R.id.btnSave);

        // Setup Status Dropdown
        String[] statuses = {"New", "Contacted", "Converted", "Lost"};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_dropdown_item_1line, statuses);
        ddStatus.setAdapter(adapter);

        btnSave.setOnClickListener(v -> {
            String name = etName.getText().toString().trim();
            String email = etEmail.getText().toString().trim();
            
            if (name.isEmpty() || email.isEmpty()) {
                Toast.makeText(getContext(), "Please fill required fields", Toast.LENGTH_SHORT).show();
                return;
            }

            createLead(name, email, etPhone.getText().toString().trim(), etService.getText().toString().trim(), ddStatus.getText().toString(), dialog);
        });

        dialog.show();
    }

    private void createLead(String name, String email, String phone, String service, String status, BottomSheetDialog dialog) {
        Lead lead = new Lead();
        lead.setName(name);
        lead.setEmail(email);
        lead.setPhone(phone);
        lead.setService(service);
        lead.setStatus(status.isEmpty() ? "New" : status);

        apiService.createLead(lead).enqueue(new Callback<Lead>() {
            @Override
            public void onResponse(Call<Lead> call, Response<Lead> response) {
                if (isAdded()) {
                    if(response.isSuccessful()) {
                        Toast.makeText(getContext(), "Lead created successfully", Toast.LENGTH_SHORT).show();
                        dialog.dismiss();
                        loadData(); // Refresh list
                    } else {
                        Toast.makeText(getContext(), "Failed to create lead", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<Lead> call, Throwable t) {
                if (isAdded()) {
                    Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void loadData() {
        progressBar.setVisibility(View.VISIBLE);
        apiService.getAllLeads().enqueue(new Callback<List<Lead>>() {
            @Override
            public void onResponse(Call<List<Lead>> call, Response<List<Lead>> response) {
                if (isAdded()) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    if (response.isSuccessful() && response.body() != null) {
                        List<Lead> leads = response.body();
                        if (leads.isEmpty()) {
                            tvEmptyState.setVisibility(View.VISIBLE);
                            recyclerView.setVisibility(View.GONE);
                        } else {
                            tvEmptyState.setVisibility(View.GONE);
                            recyclerView.setVisibility(View.VISIBLE);
                            adapter.setLeads(leads);
                        }
                    } else {
                        Toast.makeText(getContext(), "Failed to load leads", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<List<Lead>> call, Throwable t) {
                if (isAdded()) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private class LeadsAdapter extends RecyclerView.Adapter<LeadsAdapter.ViewHolder> {
        private List<Lead> leads = new ArrayList<>();

        void setLeads(List<Lead> leads) {
            this.leads = leads;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_admin_lead, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            Lead lead = leads.get(position);
            holder.tvName.setText(lead.getName() != null ? lead.getName() : "Unknown");
            holder.tvEmail.setText(lead.getEmail() != null ? lead.getEmail() : "No Email");
            holder.tvService.setText(lead.getService() != null ? lead.getService() : "N/A");
            String status = lead.getStatus() != null ? lead.getStatus() : "New";
            holder.tvStatus.setText(status);
            
            if ("New".equalsIgnoreCase(status)) {
                holder.tvStatus.setTextColor(0xFFF97316); 
                holder.tvStatus.setBackgroundColor(0xFFFFF7ED);
            } else if ("Contacted".equalsIgnoreCase(status)) {
                holder.tvStatus.setTextColor(0xFF3B82F6); 
                holder.tvStatus.setBackgroundColor(0xFFEFF6FF);
            } else if ("Converted".equalsIgnoreCase(status)) { 
                holder.tvStatus.setTextColor(0xFF10B981); 
                holder.tvStatus.setBackgroundColor(0xFFECFDF5);
            } else {
                holder.tvStatus.setTextColor(0xFF64748B); 
                holder.tvStatus.setBackgroundColor(0xFFF1F5F9);
            }

            // Click listener for details/edit
            holder.itemView.setOnClickListener(v -> {
                 Toast.makeText(getContext(), "Lead Details: " + lead.getName(), Toast.LENGTH_SHORT).show();
            });
            
            ImageView btnCall = holder.itemView.findViewById(R.id.btnCall);
            if(btnCall != null) {
                btnCall.setOnClickListener(v -> {
                    Toast.makeText(getContext(), "Assign Expert Clicked", Toast.LENGTH_SHORT).show();
                });
            }
        }

        @Override
        public int getItemCount() {
            return leads.size();
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvEmail, tvService, tvStatus;
            ViewHolder(@NonNull View itemView) {
                super(itemView);
                tvName = itemView.findViewById(R.id.tvLeadName);
                tvEmail = itemView.findViewById(R.id.tvLeadEmail);
                tvService = itemView.findViewById(R.id.tvService);
                tvStatus = itemView.findViewById(R.id.tvStatus);
            }
        }
    }
}
