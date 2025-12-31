package com.bizzfilling.app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class AdminSalesReportsFragment extends Fragment {
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_admin_placeholder, container, false);
        
        TextView tvTitle = view.findViewById(R.id.tvPageTitle);
        TextView tvMessage = view.findViewById(R.id.tvPageMessage);
        
        if (tvTitle != null) tvTitle.setText("Sales Reports");
        if (tvMessage != null) tvMessage.setText("Detailed sales tracking and financial reports.");

        return view;
    }
}
