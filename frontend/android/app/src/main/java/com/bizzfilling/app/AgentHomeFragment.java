package com.bizzfilling.app;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.AgentWallet;
import com.bizzfilling.app.utils.SessionManager;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import java.text.NumberFormat;
import java.util.Locale;

public class AgentHomeFragment extends Fragment {

    private TextView tvHello, tvRole, tvWalletBalance, tvActiveReferrals, tvPendingOrders;
    private SwipeRefreshLayout swipeRefresh;
    private ApiService apiService;
    private SessionManager sessionManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_agent_home, container, false);

        // Init
        apiService = ApiClient.getClient(requireContext()).create(ApiService.class);
        sessionManager = new SessionManager(requireContext());

        // Views
        tvHello = view.findViewById(R.id.tvHello);
        tvRole = view.findViewById(R.id.tvRole);
        tvWalletBalance = view.findViewById(R.id.tvWalletBalance);
        tvActiveReferrals = view.findViewById(R.id.tvActiveReferrals);
        tvPendingOrders = view.findViewById(R.id.tvPendingOrders);
        swipeRefresh = view.findViewById(R.id.swipeRefresh);

        // Buttons
        Button btnCreateOrder = view.findViewById(R.id.btnCreateOrder);
        Button btnReferUser = view.findViewById(R.id.btnReferUser);

        // Set User Info
        String userName = sessionManager.getUserName();
        tvHello.setText("Hello, " + (userName != null ? userName : "Agent"));
        tvRole.setText("Agent Dashboard");

        // Listeners
        swipeRefresh.setOnRefreshListener(this::loadData);
        btnCreateOrder.setOnClickListener(v -> navigateToServices());
        btnReferUser.setOnClickListener(v -> showReferDialog());

        loadData();

        return view;
    }

    private void loadData() {
        swipeRefresh.setRefreshing(true);

        // Fetch Wallet
        apiService.getAgentWallet().enqueue(new Callback<AgentWallet>() {
            @Override
            public void onResponse(Call<AgentWallet> call, Response<AgentWallet> response) {
                if (isAdded()) {
                    swipeRefresh.setRefreshing(false);
                    if (response.isSuccessful() && response.body() != null) {
                        double bal = response.body().getBalance();
                        NumberFormat format = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
                        tvWalletBalance.setText(format.format(bal));
                    } else {
                        tvWalletBalance.setText("₹0.00");
                    }
                }
            }

            @Override
            public void onFailure(Call<AgentWallet> call, Throwable t) {
                if (isAdded()) {
                    swipeRefresh.setRefreshing(false);
                    Toast.makeText(getContext(), "Failed to load wallet", Toast.LENGTH_SHORT).show();
                }
            }
        });

        // Mock other stats for now as parity with iOS
        tvActiveReferrals.setText("8");
        tvPendingOrders.setText("2");
    }

    private void navigateToServices() {
        // Navigate to Service Selection (Assuming MainActivity/Dashboard handles
        // fragment switching or intent)
        // For simple parity, we can launch ServiceHubActivity
        Intent intent = new Intent(getContext(), ServiceHubActivity.class);
        startActivity(intent);
    }

    private void showReferDialog() {
        if (getContext() == null)
            return;
        EditText input = new EditText(getContext());
        input.setHint("Client Email Address");
        int padding = (int) (16 * getResources().getDisplayMetrics().density);
        input.setPadding(padding, padding, padding, padding);

        new MaterialAlertDialogBuilder(getContext())
                .setTitle("Refer New User")
                .setMessage("Enter the email of the user you want to refer.")
                .setView(input)
                .setPositiveButton("Refer", (dialog, which) -> {
                    String email = input.getText().toString().trim();
                    if (!email.isEmpty()) {
                        // Mock Refer API
                        Toast.makeText(getContext(), "Referral sent to " + email, Toast.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("Cancel", null)
                .show();
    }
}
