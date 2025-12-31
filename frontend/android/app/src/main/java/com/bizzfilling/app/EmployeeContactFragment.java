package com.bizzfilling.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.cardview.widget.CardView;
import androidx.fragment.app.Fragment;

public class EmployeeContactFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_employee_contact, container, false);

        CardView cardPhone = view.findViewById(R.id.cardPhone);
        CardView cardEmail = view.findViewById(R.id.cardEmail);
        CardView cardAddress = view.findViewById(R.id.cardAddress);

        // Phone Action
        cardPhone.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_DIAL);
            intent.setData(Uri.parse("tel:+919876543210"));
            try {
                startActivity(intent);
            } catch (Exception e) {
                Toast.makeText(getContext(), "Cannot open dialer", Toast.LENGTH_SHORT).show();
            }
        });

        // Email Action
        cardEmail.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_SENDTO);
            intent.setData(Uri.parse("mailto:support@bizzfilling.com"));
            try {
                startActivity(intent);
            } catch (Exception e) {
                Toast.makeText(getContext(), "Cannot open email app", Toast.LENGTH_SHORT).show();
            }
        });

        // Map Action
        cardAddress.setOnClickListener(v -> {
            Uri gmmIntentUri = Uri.parse("geo:0,0?q=123, Business Park, Tech City, India");
            Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
            mapIntent.setPackage("com.google.android.apps.maps");
            try {
                startActivity(mapIntent);
            } catch (Exception e) {
                // Try browser if map app not found
                startActivity(new Intent(Intent.ACTION_VIEW,
                        Uri.parse("https://maps.google.com/?q=123, Business Park, Tech City, India")));
            }
        });

        return view;
    }
}
