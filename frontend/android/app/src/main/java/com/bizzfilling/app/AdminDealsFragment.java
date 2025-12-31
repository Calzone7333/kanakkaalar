package com.bizzfilling.app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
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
import com.bizzfilling.app.api.models.Deal;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import java.text.NumberFormat;

public class AdminDealsFragment extends Fragment {

    private RecyclerView recyclerView;
    private SwipeRefreshLayout swipeRefresh;
    private ProgressBar progressBar;
    private TextView tvEmptyState;
    private DealsAdapter adapter;
    private ApiService apiService;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_admin_list, container, false);

        TextView tvTitle = view.findViewById(R.id.tvPageTitle);
        TextView tvSubtitle = view.findViewById(R.id.tvPageSubtitle);
        tvTitle.setText("Deals");
        tvSubtitle.setText("Track deal pipeline");
        tvSubtitle.setVisibility(View.VISIBLE);

        recyclerView = view.findViewById(R.id.recyclerView);
        swipeRefresh = view.findViewById(R.id.swipeRefresh);
        progressBar = view.findViewById(R.id.progressBar);
        tvEmptyState = view.findViewById(R.id.tvEmptyState);
        
        view.findViewById(R.id.fabAdd).setOnClickListener(v -> showAddDealDialog());

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new DealsAdapter();
        recyclerView.setAdapter(adapter);

        apiService = ApiClient.getClient(requireContext()).create(ApiService.class);
        loadData();
        swipeRefresh.setOnRefreshListener(this::loadData);

        return view;
    }

    private void showAddDealDialog() {
        if (getContext() == null) return;
        BottomSheetDialog dialog = new BottomSheetDialog(getContext(), R.style.BottomSheetDialogTheme);
        View sheetView = getLayoutInflater().inflate(R.layout.dialog_add_deal, null);
        dialog.setContentView(sheetView);

        TextInputEditText etName = sheetView.findViewById(R.id.etName);
        TextInputEditText etCustomer = sheetView.findViewById(R.id.etCustomer);
        TextInputEditText etAmount = sheetView.findViewById(R.id.etAmount);
        AutoCompleteTextView ddStage = sheetView.findViewById(R.id.ddStage);
        TextInputEditText etProbability = sheetView.findViewById(R.id.etProbability);
        TextInputEditText etOwner = sheetView.findViewById(R.id.etOwner);
        TextInputEditText etDueDate = sheetView.findViewById(R.id.etDueDate);
        View btnSave = sheetView.findViewById(R.id.btnSave);

        // Setup Dropdown with Web App Stages
        String[] stages = {"Lead In", "Qualification", "Proposal Sent", "Negotiation", "Closed Won", "Closed Lost"};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_dropdown_item_1line, stages);
        ddStage.setAdapter(adapter);

        // Setup DatePicker for Due Date
        etDueDate.setOnClickListener(v -> {
            java.util.Calendar c = java.util.Calendar.getInstance();
            new android.app.DatePickerDialog(getContext(), (view, year, month, dayOfMonth) -> {
                etDueDate.setText(String.format(Locale.US, "%d-%02d-%02d", year, month + 1, dayOfMonth));
            }, c.get(java.util.Calendar.YEAR), c.get(java.util.Calendar.MONTH), c.get(java.util.Calendar.DAY_OF_MONTH)).show();
        });

        btnSave.setOnClickListener(v -> {
            String name = etName.getText().toString().trim();
            String customer = etCustomer.getText().toString().trim();
            String amountStr = etAmount.getText().toString().trim();
            
            if (name.isEmpty() || customer.isEmpty() || amountStr.isEmpty()) {
                Toast.makeText(getContext(), "Name, Customer, and Amount are required", Toast.LENGTH_SHORT).show();
                return;
            }

            Deal deal = new Deal();
            deal.setName(name);
            deal.setCustomer(customer);
            try {
                deal.setAmount(Double.parseDouble(amountStr));
            } catch (NumberFormatException e) {
                deal.setAmount(0.0);
            }
            deal.setStage(ddStage.getText().toString());
            
            String probStr = etProbability.getText().toString().trim();
            try {
                 deal.setProbability(Integer.parseInt(probStr));
            } catch (NumberFormatException e) {
                 deal.setProbability(20);
            }

            deal.setOwner(etOwner.getText().toString().trim());
            deal.setDueDate(etDueDate.getText().toString().trim());

            createDeal(deal, dialog);
        });

        dialog.show();
    }

   private void createDeal(Deal deal, BottomSheetDialog dialog) {
        apiService.createDeal(deal).enqueue(new Callback<Deal>() {
            @Override
            public void onResponse(Call<Deal> call, Response<Deal> response) {
                if (isAdded()) {
                    if(response.isSuccessful()) {
                        Toast.makeText(getContext(), "Deal created successfully", Toast.LENGTH_SHORT).show();
                        dialog.dismiss();
                        loadData(); // Refresh list
                    } else {
                        Toast.makeText(getContext(), "Failed to create deal", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<Deal> call, Throwable t) {
                if (isAdded()) {
                    Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void loadData() {
        progressBar.setVisibility(View.VISIBLE);
        apiService.getAllDeals().enqueue(new Callback<List<Deal>>() {
            @Override
            public void onResponse(Call<List<Deal>> call, Response<List<Deal>> response) {
                if (isAdded()) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    if (response.isSuccessful() && response.body() != null) {
                        List<Deal> deals = response.body();
                        if (deals.isEmpty()) {
                            tvEmptyState.setVisibility(View.VISIBLE);
                            recyclerView.setVisibility(View.GONE);
                        } else {
                            tvEmptyState.setVisibility(View.GONE);
                            recyclerView.setVisibility(View.VISIBLE);
                            adapter.setDeals(deals);
                        }
                    } else {
                        Toast.makeText(getContext(), "Failed to load deals", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<List<Deal>> call, Throwable t) {
                if (isAdded()) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private static class DealsAdapter extends RecyclerView.Adapter<DealsAdapter.ViewHolder> {
        private List<Deal> deals = new ArrayList<>();
        private NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));

        void setDeals(List<Deal> deals) {
            this.deals = deals;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_admin_deal, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            Deal deal = deals.get(position);
            holder.tvName.setText(deal.getName() != null ? deal.getName() : "Untitled Deal");
            holder.tvCustomer.setText(deal.getCustomer() != null ? deal.getCustomer() : "No Customer");
            
            Double amount = deal.getAmount();
            holder.tvAmount.setText(amount != null ? currencyFormat.format(amount) : "₹ 0.0");

            String stage = deal.getStage() != null ? deal.getStage() : "New";
            holder.tvStage.setText(stage);
            
            Integer prob = deal.getProbability();
            holder.tvProbability.setText((prob != null ? prob : 0) + "%");
        }

        @Override
        public int getItemCount() {
            return deals.size();
        }

        static class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvCustomer, tvAmount, tvStage, tvProbability;
            ViewHolder(@NonNull View itemView) {
                super(itemView);
                tvName = itemView.findViewById(R.id.tvDealName);
                tvCustomer = itemView.findViewById(R.id.tvCustomerName);
                tvAmount = itemView.findViewById(R.id.tvAmount);
                tvStage = itemView.findViewById(R.id.tvStage);
                tvProbability = itemView.findViewById(R.id.tvProbability);
            }
        }
    }
}
