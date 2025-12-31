package com.bizzfilling.app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.User;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CompanyDetailsFragment extends Fragment {

    private TextView tvCompanyName, tvCompanyMeta, tvCompanyDate;
    private TextView tvOwnerName, tvEmail, tvPhone;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_company_details, container, false);

        tvCompanyName = view.findViewById(R.id.tvCompanyName);
        tvCompanyMeta = view.findViewById(R.id.tvCompanyMeta);
        tvCompanyDate = view.findViewById(R.id.tvCompanyDate);
        
        // Add IDs for owner details if they don't exist in XML yet
        // For now, I'll assume the XML needs update to include owner details section
        // But first let's just populate the company card with User info as "Company" info for now
        // or fetch user profile.

        fetchCompanyDetails();

        return view;
    }

    private void fetchCompanyDetails() {
        ApiService apiService = ApiClient.getClient(getContext()).create(ApiService.class);
        apiService.getUserProfile().enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful() && response.body() != null) {
                    User user = response.body();
                    
                    // Simulate Company Details based on User
                    // In real app, we'd have a separate endpoint or fields
                    tvCompanyName.setText(user.getFullName() + "'s Company");
                    tvCompanyMeta.setText("Email: " + user.getEmail());
                    tvCompanyDate.setText("Phone: " + (user.getPhone() != null ? user.getPhone() : "N/A"));
                } else {
                    Toast.makeText(getContext(), "Failed to load details", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                if (getContext() != null)
                   Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
