package com.bizzfilling.app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
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
import com.bizzfilling.app.api.models.AgentListResponse;
import com.bizzfilling.app.api.models.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import okhttp3.RequestBody;
import okhttp3.MediaType;

public class AdminAgentsFragment extends Fragment {

    private RecyclerView recyclerView;
    private SwipeRefreshLayout swipeRefresh;
    private ProgressBar progressBar;
    private TextView tvEmptyState, tvTitle, tvSubtitle;
    private AgentsAdapter adapter;
    private ApiService apiService;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_admin_list, container, false);

        tvTitle = view.findViewById(R.id.tvPageTitle);
        tvSubtitle = view.findViewById(R.id.tvPageSubtitle);
        tvTitle.setText("Agents");
        tvSubtitle.setText("Manage sales agents");
        tvSubtitle.setVisibility(View.VISIBLE);

        recyclerView = view.findViewById(R.id.recyclerView);
        swipeRefresh = view.findViewById(R.id.swipeRefresh);
        progressBar = view.findViewById(R.id.progressBar);
        tvEmptyState = view.findViewById(R.id.tvEmptyState);
        
        view.findViewById(R.id.fabAdd).setOnClickListener(v -> showAddAgentDialog());

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new AgentsAdapter();
        recyclerView.setAdapter(adapter);

        apiService = ApiClient.getClient(requireContext()).create(ApiService.class);
        loadData();
        swipeRefresh.setOnRefreshListener(this::loadData);

        return view;
    }

    private void showAddAgentDialog() {
        if (getContext() == null) return;
        BottomSheetDialog dialog = new BottomSheetDialog(getContext(), R.style.BottomSheetDialogTheme);
        View sheetView = getLayoutInflater().inflate(R.layout.dialog_add_agent, null);
        dialog.setContentView(sheetView);

        TextInputEditText etName = sheetView.findViewById(R.id.etName);
        TextInputEditText etEmail = sheetView.findViewById(R.id.etEmail);
        TextInputEditText etPhone = sheetView.findViewById(R.id.etPhone);
        TextInputEditText etPassword = sheetView.findViewById(R.id.etPassword);
        
        TextInputEditText etAddress = sheetView.findViewById(R.id.etAddress);
        TextInputEditText etState = sheetView.findViewById(R.id.etState);
        TextInputEditText etCity = sheetView.findViewById(R.id.etCity);
        
        TextInputEditText etFirmName = sheetView.findViewById(R.id.etFirmName);
        TextInputEditText etAadhaar = sheetView.findViewById(R.id.etAadhaar);
        TextInputEditText etPan = sheetView.findViewById(R.id.etPan);
        View btnSave = sheetView.findViewById(R.id.btnSave);

        btnSave.setOnClickListener(v -> {
            String name = etName.getText().toString().trim();
            String email = etEmail.getText().toString().trim();
            String password = etPassword.getText().toString().trim();
            String phone = etPhone.getText().toString().trim();

            if (name.isEmpty() || email.isEmpty() || password.isEmpty() || phone.isEmpty()) {
                Toast.makeText(getContext(), "Required fields missing", Toast.LENGTH_SHORT).show();
                return;
            }

            // Disable button to prevent multiple clicks
            v.setEnabled(false);

            Map<String, RequestBody> params = new HashMap<>();
            params.put("fullName", createPart(name));
            params.put("email", createPart(email));
            params.put("password", createPart(password));
            params.put("phone", createPart(phone));
            
            // Optional fields
            appendIfNotEmpty(params, "address", etAddress.getText().toString());
            appendIfNotEmpty(params, "state", etState.getText().toString());
            appendIfNotEmpty(params, "city", etCity.getText().toString());
            appendIfNotEmpty(params, "firmName", etFirmName.getText().toString());
            appendIfNotEmpty(params, "aadhaarNumber", etAadhaar.getText().toString());
            appendIfNotEmpty(params, "panNumber", etPan.getText().toString());
            
            createAgent(params, dialog, v);
        });

        dialog.show();
    }
    
    private void appendIfNotEmpty(Map<String, RequestBody> params, String key, String value) {
        if (value != null && !value.trim().isEmpty()) {
            params.put(key, createPart(value.trim()));
        }
    }

    private RequestBody createPart(String value) {
        return RequestBody.create(MediaType.parse("text/plain"), value);
    }

    private void createAgent(Map<String, RequestBody> params, BottomSheetDialog dialog, View btnSave) {
        apiService.createAgent(params).enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (isAdded() && getContext() != null) {
                    if (response.isSuccessful()) {
                        Toast.makeText(getContext(), "Agent created successfully", Toast.LENGTH_SHORT).show();
                        dialog.dismiss();
                        loadData();
                    } else {
                        btnSave.setEnabled(true);
                        Toast.makeText(getContext(), "Failed to create agent: " + response.code(), Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                if (isAdded() && getContext() != null) {
                    btnSave.setEnabled(true);
                    Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void loadData() {
        progressBar.setVisibility(View.VISIBLE);
        apiService.listAgents().enqueue(new Callback<AgentListResponse>() {
            @Override
            public void onResponse(Call<AgentListResponse> call, Response<AgentListResponse> response) {
                if (isAdded() && getContext() != null) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    if (response.isSuccessful() && response.body() != null) {
                        List<User> agents = response.body().getAgents();
                        if (agents == null || agents.isEmpty()) {
                            tvEmptyState.setVisibility(View.VISIBLE);
                            recyclerView.setVisibility(View.GONE);
                        } else {
                            tvEmptyState.setVisibility(View.GONE);
                            recyclerView.setVisibility(View.VISIBLE);
                            adapter.setAgents(agents);
                            tvSubtitle.setText(agents.size() + " Agents");
                        }
                    } else {
                        Toast.makeText(getContext(), "Failed to load agents", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<AgentListResponse> call, Throwable t) {
                if (isAdded() && getContext() != null) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private static class AgentsAdapter extends RecyclerView.Adapter<AgentsAdapter.ViewHolder> {
        private List<User> agents = new ArrayList<>();

        void setAgents(List<User> agents) {
            this.agents = agents;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_admin_user, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            User user = agents.get(position);
            holder.tvName.setText(user.getFullName() != null ? user.getFullName() : "Unknown");
            holder.tvEmail.setText(user.getEmail());
            holder.tvRole.setText("AGENT");
            
            String status = user.getStatus();
            boolean isActive = "Active".equalsIgnoreCase(status);

            if (isActive) {
                holder.tvStatus.setText("Active");
                holder.tvStatus.setTextColor(0xFF10B981); // Green
            } else {
                holder.tvStatus.setText("Inactive");
                holder.tvStatus.setTextColor(0xFFEF4444); // Red
            }

            // More Options Click
            holder.btnMore.setOnClickListener(v -> {
                android.widget.PopupMenu popup = new android.widget.PopupMenu(v.getContext(), v);
                popup.getMenu().add("Edit");
                popup.getMenu().add(isActive ? "Deactivate" : "Activate");
                popup.getMenu().add("Delete");
                
                popup.setOnMenuItemClickListener(item -> {
                     String title = item.getTitle().toString();
                     // Placeholder actions
                     Toast.makeText(v.getContext(), title + " " + user.getFullName(), Toast.LENGTH_SHORT).show();
                     return true;
                });
                popup.show();
            });
        }

        @Override
        public int getItemCount() {
            return agents.size();
        }

        static class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvEmail, tvRole, tvStatus;
            android.widget.ImageView btnMore;

            ViewHolder(@NonNull View itemView) {
                super(itemView);
                tvName = itemView.findViewById(R.id.tvUserName);
                tvEmail = itemView.findViewById(R.id.tvUserEmail);
                tvRole = itemView.findViewById(R.id.tvUserRole);
                tvStatus = itemView.findViewById(R.id.tvUserStatus);
                btnMore = itemView.findViewById(R.id.btnMore);
            }
        }
    }
}
