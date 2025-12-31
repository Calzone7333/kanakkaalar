package com.bizzfilling.app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class EmployeeMenuFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_employee_menu, container, false);

        // Setup click listeners
        setupClickListener(view, R.id.cardAttendance, "Attendance");
        setupClickListener(view, R.id.cardCRM, "CRM");
        setupClickListener(view, R.id.cardReports, "Reports");
        setupClickListener(view, R.id.cardSales, "Sales");
        setupClickListener(view, R.id.cardCompany, "Company");
        setupClickListener(view, R.id.cardContact, "Contact");

        return view;
    }

    private void setupClickListener(View parent, int cardId, String featureName) {
        View card = parent.findViewById(cardId);
        if (card != null) {
            card.setOnClickListener(v -> {
                if (getActivity() != null) {
                    Fragment fragment = null;
                    if (cardId == R.id.cardAttendance)
                        fragment = new EmployeeAttendanceFragment();
                    // Add other fragments here as we implement them

                    if (fragment != null) {
                        getActivity().getSupportFragmentManager().beginTransaction()
                                .replace(R.id.content_frame, fragment)
                                .addToBackStack(null)
                                .commit();
                    } else {
                        Toast.makeText(getContext(), featureName + " feature coming soon", Toast.LENGTH_SHORT).show();
                    }
                }
            });
        }
    }
}
