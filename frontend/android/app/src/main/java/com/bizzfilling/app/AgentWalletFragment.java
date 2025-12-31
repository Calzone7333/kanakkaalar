package com.bizzfilling.app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ImageView;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.AgentWallet;
import com.bizzfilling.app.api.models.WalletTransaction;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import android.widget.EditText;

import java.util.ArrayList;
import java.util.List;
import java.text.NumberFormat;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AgentWalletFragment extends Fragment {

    private TextView tvBalance;
    private RecyclerView recyclerView;
    private SwipeRefreshLayout swipeRefresh;
    private TransactionsAdapter adapter;
    private ApiService apiService;
    private View btnWithdraw;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_agent_wallet, container, false);

        apiService = ApiClient.getClient(requireContext()).create(ApiService.class);

        tvBalance = view.findViewById(R.id.tvWalletBalance);
        recyclerView = view.findViewById(R.id.recyclerView);
        swipeRefresh = view.findViewById(R.id.swipeRefresh);
        btnWithdraw = view.findViewById(R.id.btnWithdraw);

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new TransactionsAdapter();
        recyclerView.setAdapter(adapter);

        swipeRefresh.setOnRefreshListener(this::loadData);
        if (btnWithdraw != null) {
            btnWithdraw.setOnClickListener(v -> showWithdrawDialog());
        }

        loadData();
        return view;
    }

    private void loadData() {
        swipeRefresh.setRefreshing(true);

        // Fetch Balance
        apiService.getAgentWallet().enqueue(new Callback<AgentWallet>() {
            @Override
            public void onResponse(Call<AgentWallet> call, Response<AgentWallet> response) {
                if (!isAdded())
                    return;
                if (response.isSuccessful() && response.body() != null) {
                    double bal = response.body().getBalance();
                    NumberFormat format = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
                    tvBalance.setText(format.format(bal));
                }
            }

            @Override
            public void onFailure(Call<AgentWallet> call, Throwable t) {
                // Log error
            }
        });

        // Fetch Transactions
        apiService.getWalletTransactions().enqueue(new Callback<List<WalletTransaction>>() {
            @Override
            public void onResponse(Call<List<WalletTransaction>> call, Response<List<WalletTransaction>> response) {
                if (!isAdded())
                    return;
                swipeRefresh.setRefreshing(false);
                if (response.isSuccessful() && response.body() != null) {
                    adapter.setTransactions(response.body());
                } else {
                    Toast.makeText(getContext(), "Failed to load transactions", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<WalletTransaction>> call, Throwable t) {
                if (!isAdded())
                    return;
                swipeRefresh.setRefreshing(false);
                Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showWithdrawDialog() {
        if (getContext() == null)
            return;
        EditText input = new EditText(getContext());
        input.setHint("Amount to Withdraw");
        input.setInputType(android.text.InputType.TYPE_CLASS_NUMBER | android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL);
        int padding = (int) (16 * getResources().getDisplayMetrics().density);
        input.setPadding(padding, padding, padding, padding);

        new MaterialAlertDialogBuilder(getContext())
                .setTitle("Withdraw Funds")
                .setView(input)
                .setPositiveButton("Withdraw", (dialog, which) -> {
                    Toast.makeText(getContext(), "Withdrawal Requested", Toast.LENGTH_SHORT).show();
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    // Adapter
    private static class TransactionsAdapter extends RecyclerView.Adapter<TransactionsAdapter.ViewHolder> {
        private List<WalletTransaction> list = new ArrayList<>();

        void setTransactions(List<WalletTransaction> list) {
            this.list = list;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_wallet_transaction, parent, false);
            return new ViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            WalletTransaction tx = list.get(position);
            holder.tvTitle.setText(tx.getDescription());

            // Format Date
            holder.tvDate.setText(tx.getCreatedAt().split("T")[0]);

            NumberFormat format = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
            String amt = format.format(tx.getAmount());

            if ("CREDIT".equalsIgnoreCase(tx.getType())) {
                holder.tvAmount.setText("+ " + amt);
                holder.tvAmount.setTextColor(0xFF10B981); // Green
                holder.iconView.setImageResource(R.drawable.ic_arrow_down_left); // Assuming resource or system
                holder.iconView.setColorFilter(0xFF10B981);
                holder.iconBg.setBackgroundColor(0xFFECFDF5); // Light Green
            } else {
                holder.tvAmount.setText("- " + amt);
                holder.tvAmount.setTextColor(0xFFEF4444); // Red
                holder.iconView.setImageResource(R.drawable.ic_arrow_up_right); // Assuming resource or system
                holder.iconView.setColorFilter(0xFFEF4444);
                holder.iconBg.setBackgroundColor(0xFFFEF2F2); // Light Red
            }
        }

        @Override
        public int getItemCount() {
            return list.size();
        }

        static class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvTitle, tvDate, tvAmount;
            ImageView iconView;
            View iconBg;

            ViewHolder(View v) {
                super(v);
                tvTitle = v.findViewById(R.id.tvTxTitle);
                tvDate = v.findViewById(R.id.tvTxDate);
                tvAmount = v.findViewById(R.id.tvTxAmount);
                iconView = v.findViewById(R.id.imgTxIcon);
                iconBg = v.findViewById(R.id.viewTxIconBg);
            }
        }
    }
}
