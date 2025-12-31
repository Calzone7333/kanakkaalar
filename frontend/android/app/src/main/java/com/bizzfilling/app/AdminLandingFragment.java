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
import androidx.fragment.app.FragmentTransaction;
import com.google.android.material.card.MaterialCardView;

public class AdminLandingFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_admin_landing, container, false);
        
        try {
            com.bizzfilling.app.utils.SessionManager sessionManager = new com.bizzfilling.app.utils.SessionManager(requireContext());
            TextView tvAdminName = view.findViewById(R.id.tvAdminName);
            if(sessionManager.isLoggedIn()) {
                tvAdminName.setText("Welcome, " + sessionManager.getUserName());
            } else {
                tvAdminName.setText("Welcome, Admin");
            }

            // Bind Grid Cards
            MaterialCardView cardUsers = view.findViewById(R.id.cardUsers);
            MaterialCardView cardOrders = view.findViewById(R.id.cardOrders);
            MaterialCardView cardAgents = view.findViewById(R.id.cardAgents);
            MaterialCardView cardReports = view.findViewById(R.id.cardReports);
            MaterialCardView cardIssues = view.findViewById(R.id.cardIssues);
            MaterialCardView cardSettings = view.findViewById(R.id.cardSettings);

            // Bind Stats (Mock Data / Initial State)
            TextView tvTotalRevenue = view.findViewById(R.id.tvTotalRevenue);
            TextView tvPendingOrders = view.findViewById(R.id.tvPendingOrders);
            
            // Set OnClickListeners for Navigation
            if (cardUsers != null) {
                cardUsers.setOnClickListener(v -> navigateTo(new AdminCustomersFragment()));
            }
            if (cardOrders != null) {
                cardOrders.setOnClickListener(v -> navigateTo(new AdminOrdersFragment()));
            }
            if (cardAgents != null) {
                cardAgents.setOnClickListener(v -> navigateTo(new AdminAgentsFragment()));
            }
            if (cardReports != null) {
                cardReports.setOnClickListener(v -> navigateTo(new AdminReportsFragment()));
            }
            if (cardIssues != null) {
                cardIssues.setOnClickListener(v -> navigateTo(new AdminCrmFragment())); // Using CRM for Issues/Leads
            }
            if (cardSettings != null) {
                cardSettings.setOnClickListener(v -> navigateTo(new AdminSettingsFragment()));
            }

            // Load Profile Image
            android.widget.ImageView imgAdminProfile = view.findViewById(R.id.imgUserProfile);
            
            if (imgAdminProfile != null) {
                com.bizzfilling.app.api.ApiService apiService = com.bizzfilling.app.api.ApiClient.getClient(requireContext()).create(com.bizzfilling.app.api.ApiService.class);
                final android.widget.ImageView targetImage = imgAdminProfile;
                apiService.getProfileImage().enqueue(new retrofit2.Callback<okhttp3.ResponseBody>() {
                    @Override
                    public void onResponse(retrofit2.Call<okhttp3.ResponseBody> call, retrofit2.Response<okhttp3.ResponseBody> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            android.graphics.Bitmap bmp = android.graphics.BitmapFactory.decodeStream(response.body().byteStream());
                            if (bmp != null) {
                                androidx.core.graphics.drawable.RoundedBitmapDrawable circularBitmapDrawable =
                                        androidx.core.graphics.drawable.RoundedBitmapDrawableFactory.create(getResources(), bmp);
                                circularBitmapDrawable.setCircular(true);
                                targetImage.setImageDrawable(circularBitmapDrawable);
                            }
                        }
                    }
                    @Override
                    public void onFailure(retrofit2.Call<okhttp3.ResponseBody> call, Throwable t) {}
                });
                
                // Navigate to Profile on click
                imgAdminProfile.setOnClickListener(v -> navigateTo(new AdminSettingsFragment()));
            }

            // Optional: Bind dynamic data here later (e.g., fetch from API)
            // if (tvTotalRevenue != null) tvTotalRevenue.setText(...);

            // --- ANIMATIONS ---
            // --- ANIMATIONS ---
            try {
                // 1. Slide In Header & Search
                android.view.animation.Animation slideIn = android.view.animation.AnimationUtils.loadAnimation(getContext(), R.anim.slide_in_bottom);
                View appBarView = view.findViewById(R.id.appBar);
                if (appBarView != null) appBarView.startAnimation(slideIn);
                
                // 2. Slide In Banners
                View bannerScroll = view.findViewById(R.id.bannerScrollView); 
                if (bannerScroll != null) {
                    bannerScroll.startAnimation(slideIn);
                }
            } catch (Exception e) {
                // Log animation error but don't crash the app
                android.util.Log.e("AdminLanding", "Animation failed: " + e.getMessage());
            }

            // 3. Grid Layout Animation is handled in XML (layoutAnimation)

        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(getContext(), "Error init dashboard: " + e.getMessage(), Toast.LENGTH_SHORT).show();
        }
        
        return view;
    }

    private void navigateTo(Fragment fragment) {
        if (getActivity() != null) {
            getActivity().getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.content_frame, fragment)
                .addToBackStack(null)
                .commit();
        }
    }
}
