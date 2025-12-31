package com.bizzfilling.app;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bizzfilling.app.adapters.EmployeeTaskAdapter;
import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.Order;
import com.bizzfilling.app.utils.SessionManager;
import com.google.android.material.chip.Chip;
import com.google.android.material.chip.ChipGroup;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EmployeeTasksFragment extends Fragment {

    private RecyclerView rvTasks;
    private ProgressBar progressBar;
    private TextView tvEmpty;
    private EditText etSearch;
    private ChipGroup chipGroupStatus;

    private EmployeeTaskAdapter adapter;
    private List<Order> allOrders = new ArrayList<>();
    private SessionManager sessionManager;
    private String currentStatusFilter = "ALL";

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_employee_tasks, container, false);

        sessionManager = new SessionManager(requireContext());

        // Initialize Views
        rvTasks = view.findViewById(R.id.rvTasks);
        progressBar = view.findViewById(R.id.progressBar);
        tvEmpty = view.findViewById(R.id.tvEmpty);
        etSearch = view.findViewById(R.id.etSearch);
        chipGroupStatus = view.findViewById(R.id.chipGroupStatus);

        // Setup RecyclerView
        rvTasks.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new EmployeeTaskAdapter(new ArrayList<>());
        rvTasks.setAdapter(adapter);

        // Setup Listeners
        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                filterOrders(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

        chipGroupStatus.setOnCheckedChangeListener((group, checkedId) -> {
            if (checkedId == R.id.chipAll)
                currentStatusFilter = "ALL";
            else if (checkedId == R.id.chipAssigned)
                currentStatusFilter = "ASSIGNED";
            else if (checkedId == R.id.chipInProgress)
                currentStatusFilter = "IN_PROGRESS";
            else if (checkedId == R.id.chipCompleted)
                currentStatusFilter = "COMPLETED";
            else
                currentStatusFilter = "ALL";

            filterOrders(etSearch.getText().toString());
        });

        loadTasks();

        return view;
    }

    private void loadTasks() {
        progressBar.setVisibility(View.VISIBLE);
        tvEmpty.setVisibility(View.GONE);
        String email = sessionManager.getUserEmail();

        ApiService apiService = ApiClient.getClient(getContext()).create(ApiService.class);
        apiService.getAssignedOrders(email).enqueue(new Callback<List<Order>>() {
            @Override
            public void onResponse(Call<List<Order>> call, Response<List<Order>> response) {
                if (!isAdded())
                    return;
                progressBar.setVisibility(View.GONE);

                if (response.isSuccessful() && response.body() != null) {
                    allOrders = response.body();
                    filterOrders(etSearch.getText().toString());
                } else {
                    tvEmpty.setVisibility(View.VISIBLE);
                    tvEmpty.setText("No tasks available");
                }
            }

            @Override
            public void onFailure(Call<List<Order>> call, Throwable t) {
                if (!isAdded())
                    return;
                progressBar.setVisibility(View.GONE);
                tvEmpty.setVisibility(View.VISIBLE);
                tvEmpty.setText("Failed to load: " + t.getMessage());
            }
        });
    }

    private void filterOrders(String query) {
        List<Order> filtered = new ArrayList<>();

        for (Order order : allOrders) {
            boolean statusMatch = true;
            if (!currentStatusFilter.equals("ALL")) {
                statusMatch = order.getStatus() != null && order.getStatus().equalsIgnoreCase(currentStatusFilter);
            }

            boolean queryMatch = true;
            if (query != null && !query.isEmpty()) {
                String q = query.toLowerCase();
                queryMatch = (order.getCustomerEmail() != null && order.getCustomerEmail().toLowerCase().contains(q)) ||
                        (order.getId() != null && String.valueOf(order.getId()).contains(q)) ||
                        (order.getServiceName() != null && order.getServiceName().toLowerCase().contains(q));
            }

            if (statusMatch && queryMatch) {
                filtered.add(order);
            }
        }

        adapter.updateData(filtered);

        if (filtered.isEmpty()) {
            tvEmpty.setVisibility(View.VISIBLE);
            tvEmpty.setText("No tasks match your criteria");
        } else {
            tvEmpty.setVisibility(View.GONE);
        }
    }
}
