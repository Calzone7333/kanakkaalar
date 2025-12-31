package com.bizzfilling.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class EmployeeCompanyFragment extends Fragment {

    private RecyclerView rvPolicies;
    private Button btnContactHR;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_employee_company, container, false);

        rvPolicies = view.findViewById(R.id.rvPolicies);
        btnContactHR = view.findViewById(R.id.btnContactHR);

        // Setup Policies List (Grid 2 columns)
        rvPolicies.setLayoutManager(new GridLayoutManager(getContext(), 2));
        List<Policy> policies = new ArrayList<>();
        policies.add(new Policy("Employee Handbook 2025", "2.4 MB", "PDF"));
        policies.add(new Policy("Leave Policy", "1.1 MB", "PDF"));
        policies.add(new Policy("Code of Conduct", "850 KB", "PDF"));
        policies.add(new Policy("IT Security Guidelines", "1.5 MB", "PDF"));

        PolicyAdapter adapter = new PolicyAdapter(policies);
        rvPolicies.setAdapter(adapter);

        // Contact HR
        btnContactHR.setOnClickListener(v -> {
            // Intent to Email
            Intent intent = new Intent(Intent.ACTION_SENDTO);
            intent.setData(Uri.parse("mailto:hr@bizzfilling.com")); // Placeholder email
            intent.putExtra(Intent.EXTRA_SUBJECT, "Query regarding Policies");
            try {
                startActivity(intent);
            } catch (Exception e) {
                Toast.makeText(getContext(), "No email app found", Toast.LENGTH_SHORT).show();
            }
        });

        return view;
    }

    // --- Model ---
    static class Policy {
        String title, size, type;

        public Policy(String title, String size, String type) {
            this.title = title;
            this.size = size;
            this.type = type;
        }
    }

    // --- Adapter ---
    class PolicyAdapter extends RecyclerView.Adapter<PolicyAdapter.ViewHolder> {
        private List<Policy> list;

        public PolicyAdapter(List<Policy> list) {
            this.list = list;
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_company_policy, parent, false);
            return new ViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            Policy p = list.get(position);
            holder.tvTitle.setText(p.title);
            holder.tvSize.setText(p.size);
            holder.tvType.setText(p.type);

            holder.itemView.setOnClickListener(
                    v -> Toast.makeText(getContext(), "Downloading " + p.title + "...", Toast.LENGTH_SHORT).show());
        }

        @Override
        public int getItemCount() {
            return list.size();
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvTitle, tvSize, tvType;

            ViewHolder(View v) {
                super(v);
                tvTitle = v.findViewById(R.id.tvPolicyTitle);
                tvSize = v.findViewById(R.id.tvPolicySize);
                tvType = v.findViewById(R.id.tvPolicyType);
            }
        }
    }
}
