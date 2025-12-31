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
import com.bizzfilling.app.api.models.EmployeeListResponse;
import com.bizzfilling.app.api.models.User;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import okhttp3.RequestBody;
import okhttp3.MediaType;

public class AdminEmployeesFragment extends Fragment {

    private RecyclerView recyclerView;
    private SwipeRefreshLayout swipeRefresh;
    private ProgressBar progressBar;
    private TextView tvEmptyState, tvTitle, tvSubtitle;
    private EmployeesAdapter adapter;
    private ApiService apiService;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_admin_list, container, false);

        tvTitle = view.findViewById(R.id.tvPageTitle);
        tvSubtitle = view.findViewById(R.id.tvPageSubtitle);
        tvTitle.setText("Employees");
        tvSubtitle.setText("Manage team members");
        tvSubtitle.setVisibility(View.VISIBLE);

        recyclerView = view.findViewById(R.id.recyclerView);
        swipeRefresh = view.findViewById(R.id.swipeRefresh);
        progressBar = view.findViewById(R.id.progressBar);
        tvEmptyState = view.findViewById(R.id.tvEmptyState);
        
        view.findViewById(R.id.fabAdd).setOnClickListener(v -> showAddEmployeeDialog());

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new EmployeesAdapter();
        recyclerView.setAdapter(adapter);

        apiService = ApiClient.getClient(requireContext()).create(ApiService.class);
        loadData();
        swipeRefresh.setOnRefreshListener(this::loadData);

        return view;
    }

    private void showAddEmployeeDialog() {
        if (getContext() == null) return;
        BottomSheetDialog dialog = new BottomSheetDialog(getContext(), R.style.BottomSheetDialogTheme);
        View sheetView = getLayoutInflater().inflate(R.layout.dialog_add_employee, null);
        dialog.setContentView(sheetView);

        TextInputEditText etFullName = sheetView.findViewById(R.id.etFullName);
        TextInputEditText etEmail = sheetView.findViewById(R.id.etEmail);
        TextInputEditText etPassword = sheetView.findViewById(R.id.etPassword);
        View btnSave = sheetView.findViewById(R.id.btnSave);

        btnSave.setOnClickListener(v -> {
            String fullName = etFullName.getText().toString().trim();
            String email = etEmail.getText().toString().trim();
            String password = etPassword.getText().toString().trim();

            if (fullName.isEmpty() || email.isEmpty() || password.isEmpty()) {
                Toast.makeText(getContext(), "All fields are required", Toast.LENGTH_SHORT).show();
                return;
            }

            // Disable button to prevent multiple clicks
            v.setEnabled(false);
            createEmployee(fullName, email, password, dialog, v);
        });

        dialog.show();
    }

    private void createEmployee(String fullName, String email, String password, BottomSheetDialog dialog, View btnSave) {
        RequestBody namePart = RequestBody.create(MediaType.parse("text/plain"), fullName);
        RequestBody emailPart = RequestBody.create(MediaType.parse("text/plain"), email);
        RequestBody passPart = RequestBody.create(MediaType.parse("text/plain"), password);
        RequestBody rolePart = RequestBody.create(MediaType.parse("text/plain"), "EMPLOYEE");

        apiService.createEmployee(namePart, emailPart, passPart, rolePart).enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (isAdded() && getContext() != null) {
                    if (response.isSuccessful()) {
                        Toast.makeText(getContext(), "Employee created successfully", Toast.LENGTH_SHORT).show();
                        dialog.dismiss();
                        loadData(); // Refresh list
                    } else {
                        btnSave.setEnabled(true); // Re-enable
                        Toast.makeText(getContext(), "Failed to create employee", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                if (isAdded() && getContext() != null) {
                    btnSave.setEnabled(true); // Re-enable
                    Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void loadData() {
        progressBar.setVisibility(View.VISIBLE);
        apiService.listEmployees().enqueue(new Callback<EmployeeListResponse>() {
            @Override
            public void onResponse(Call<EmployeeListResponse> call, Response<EmployeeListResponse> response) {
                if (isAdded() && getContext() != null) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    if (response.isSuccessful() && response.body() != null) {
                        List<User> employees = response.body().getEmployees();
                        if (employees == null || employees.isEmpty()) {
                            tvEmptyState.setVisibility(View.VISIBLE);
                            recyclerView.setVisibility(View.GONE);
                        } else {
                            tvEmptyState.setVisibility(View.GONE);
                            recyclerView.setVisibility(View.VISIBLE);
                            adapter.setEmployees(employees);
                            tvSubtitle.setText(employees.size() + " Employees");
                        }
                    } else {
                        Toast.makeText(getContext(), "Failed to load employees", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<EmployeeListResponse> call, Throwable t) {
                if (isAdded() && getContext() != null) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private static class EmployeesAdapter extends RecyclerView.Adapter<EmployeesAdapter.ViewHolder> {
        private List<User> employees = new ArrayList<>();

        void setEmployees(List<User> employees) {
            this.employees = employees;
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
            User user = employees.get(position);
            holder.tvName.setText(user.getFullName() != null ? user.getFullName() : "Unknown");
            holder.tvEmail.setText(user.getEmail());
            holder.tvRole.setText("EMPLOYEE");
            
            // Fix status logic: Assuming 'status' field contains "Active" or "Inactive"
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
                // Show popup menu to Edit/Delete/Toggle Status
                android.widget.PopupMenu popup = new android.widget.PopupMenu(v.getContext(), v);
                popup.getMenu().add("Edit");
                popup.getMenu().add(isActive ? "Deactivate" : "Activate");
                popup.getMenu().add("Delete");
                
                popup.setOnMenuItemClickListener(item -> {
                    String title = item.getTitle().toString();
                    if (title.equals("Edit")) {
                        // TODO: Implement Edit
                        Toast.makeText(v.getContext(), "Edit clicked for " + user.getFullName(), Toast.LENGTH_SHORT).show();
                    } else if (title.equals("Delete")) {
                        // TODO: Implement Delete
                        Toast.makeText(v.getContext(), "Delete clicked for " + user.getFullName(), Toast.LENGTH_SHORT).show();
                    } else if (title.equals("Activate") || title.equals("Deactivate")) {
                         // TODO: Implement Status Toggle
                         Toast.makeText(v.getContext(), "Status toggle clicked", Toast.LENGTH_SHORT).show();
                    }
                    return true;
                });
                popup.show();
            });
        }

        @Override
        public int getItemCount() {
            return employees.size();
        }

        static class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvEmail, tvRole, tvStatus;
            android.widget.ImageView btnMore; // Added button reference
            
            ViewHolder(@NonNull View itemView) {
                super(itemView);
                tvName = itemView.findViewById(R.id.tvUserName);
                tvEmail = itemView.findViewById(R.id.tvUserEmail);
                tvRole = itemView.findViewById(R.id.tvUserRole);
                tvStatus = itemView.findViewById(R.id.tvUserStatus);
                btnMore = itemView.findViewById(R.id.btnMore); // Bind button
            }
        }
    }
}
