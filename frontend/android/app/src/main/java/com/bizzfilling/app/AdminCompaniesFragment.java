package com.bizzfilling.app;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.Company;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AdminCompaniesFragment extends Fragment {

    private RecyclerView rvCompanies;
    private CompanyAdapter adapter;
    private ProgressBar progressBar;
    private EditText etSearch;
    private List<Company> allCompanies = new ArrayList<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_admin_companies, container, false);

        rvCompanies = view.findViewById(R.id.rvCompanies);
        progressBar = view.findViewById(R.id.progressBar);
        etSearch = view.findViewById(R.id.etSearch);

        rvCompanies.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new CompanyAdapter();
        rvCompanies.setAdapter(adapter);

        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                filter(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

        loadCompanies();

        return view;
    }

    private void loadCompanies() {
        progressBar.setVisibility(View.VISIBLE);
        ApiClient.getClient(requireContext()).create(ApiService.class).getAllCompanies()
                .enqueue(new Callback<List<Company>>() {
                    @Override
                    public void onResponse(Call<List<Company>> call, Response<List<Company>> response) {
                        if (isAdded()) {
                            progressBar.setVisibility(View.GONE);
                            if (response.isSuccessful() && response.body() != null) {
                                allCompanies = response.body();
                                adapter.setList(allCompanies);
                            } else {
                                Toast.makeText(getContext(), "No companies found", Toast.LENGTH_SHORT).show();
                            }
                        }
                    }

                    @Override
                    public void onFailure(Call<List<Company>> call, Throwable t) {
                        if (isAdded()) {
                            progressBar.setVisibility(View.GONE);
                            Toast.makeText(getContext(), "Failed to load companies", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
    }

    private void filter(String query) {
        List<Company> filtered = new ArrayList<>();
        for (Company c : allCompanies) {
            if (c.getBusinessName() != null && c.getBusinessName().toLowerCase().contains(query.toLowerCase())) {
                filtered.add(c);
            } else if (c.getPanNumber() != null && c.getPanNumber().toLowerCase().contains(query.toLowerCase())) {
                filtered.add(c);
            }
        }
        adapter.setList(filtered);
    }

    // --- Adapter ---
    class CompanyAdapter extends RecyclerView.Adapter<CompanyAdapter.ViewHolder> {
        private List<Company> list = new ArrayList<>();

        void setList(List<Company> list) {
            this.list = list;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_company, parent, false);
            return new ViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            Company c = list.get(position);
            holder.tvName.setText(c.getBusinessName() != null ? c.getBusinessName() : "N/A");
            holder.tvType.setText(c.getBusinessType() != null ? c.getBusinessType() : "N/A");

            holder.tvUserEmail.setText(c.getUser() != null ? c.getUser().getEmail() : "No User");

            holder.tvIncorp.setText(c.getIncorporationDate() != null ? c.getIncorporationDate() : "-");
            holder.tvPan.setText(c.getPanNumber() != null ? c.getPanNumber() : "-");
            holder.tvGst.setText(c.getGstin() != null ? c.getGstin() : "-");
        }

        @Override
        public int getItemCount() {
            return list.size();
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvType, tvUserEmail, tvIncorp, tvPan, tvGst;

            ViewHolder(View v) {
                super(v);
                tvName = v.findViewById(R.id.tvBusinessName);
                tvType = v.findViewById(R.id.tvBusinessType);
                tvUserEmail = v.findViewById(R.id.tvUserEmail);
                tvIncorp = v.findViewById(R.id.tvIncorporationDate);
                tvPan = v.findViewById(R.id.tvPan);
                tvGst = v.findViewById(R.id.tvGst);
            }
        }
    }
}
