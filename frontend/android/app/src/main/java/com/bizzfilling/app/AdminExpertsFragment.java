package com.bizzfilling.app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
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
import com.bizzfilling.app.api.models.Expert;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import okhttp3.RequestBody;
import okhttp3.MediaType;

public class AdminExpertsFragment extends Fragment {

    private RecyclerView recyclerView;
    private SwipeRefreshLayout swipeRefresh;
    private ProgressBar progressBar;
    private TextView tvEmptyState, tvTitle, tvSubtitle;
    private ExpertsAdapter adapter;
    private ApiService apiService;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_admin_list, container, false);

        tvTitle = view.findViewById(R.id.tvPageTitle);
        tvSubtitle = view.findViewById(R.id.tvPageSubtitle);
        tvTitle.setText("Experts");
        tvSubtitle.setText("Manage domain experts");
        tvSubtitle.setVisibility(View.VISIBLE);

        recyclerView = view.findViewById(R.id.recyclerView);
        swipeRefresh = view.findViewById(R.id.swipeRefresh);
        progressBar = view.findViewById(R.id.progressBar);
        tvEmptyState = view.findViewById(R.id.tvEmptyState);
        
        view.findViewById(R.id.fabAdd).setOnClickListener(v -> showAddExpertDialog());

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new ExpertsAdapter();
        recyclerView.setAdapter(adapter);

        apiService = ApiClient.getClient(requireContext()).create(ApiService.class);
        loadData();
        swipeRefresh.setOnRefreshListener(this::loadData);

        return view;
    }

    private void showAddExpertDialog() {
        if (getContext() == null) return;
        BottomSheetDialog dialog = new BottomSheetDialog(getContext(), R.style.BottomSheetDialogTheme);
        View sheetView = getLayoutInflater().inflate(R.layout.dialog_add_expert, null);
        dialog.setContentView(sheetView);

        TextInputEditText etName = sheetView.findViewById(R.id.etName);
        TextInputEditText etQualification = sheetView.findViewById(R.id.etQualification);
        TextInputEditText etExperience = sheetView.findViewById(R.id.etExperience);
        TextInputEditText etPrice = sheetView.findViewById(R.id.etPrice);
        TextInputEditText etLanguages = sheetView.findViewById(R.id.etLanguages);
        TextInputEditText etSpecialization = sheetView.findViewById(R.id.etSpecialization);
        TextInputEditText etBio = sheetView.findViewById(R.id.etBio);
        View btnSave = sheetView.findViewById(R.id.btnSave);

        btnSave.setOnClickListener(v -> {
            String name = etName.getText().toString().trim();
            String qualification = etQualification.getText().toString().trim();
            
            if (name.isEmpty() || qualification.isEmpty()) {
                Toast.makeText(getContext(), "Name and Qualification are required", Toast.LENGTH_SHORT).show();
                return;
            }

            Map<String, Object> data = new HashMap<>();
            data.put("name", name);
            data.put("qualification", qualification);
            data.put("experience", etExperience.getText().toString().trim());
            data.put("price", etPrice.getText().toString().trim());
            data.put("rating", 5.0);
            data.put("reviews", 0);
            data.put("bio", etBio.getText().toString().trim());
            data.put("available", true);
            
            String langs = etLanguages.getText().toString().trim();
            if (!langs.isEmpty()) data.put("languages", Arrays.asList(langs.split(",")));
            else data.put("languages", new ArrayList<>());

            String specs = etSpecialization.getText().toString().trim();
            if (!specs.isEmpty()) data.put("specialization", Arrays.asList(specs.split(",")));
            else data.put("specialization", new ArrayList<>());

            createExpert(data, dialog);
        });

        dialog.show();
    }

    private void createExpert(Map<String, Object> dataMap, BottomSheetDialog dialog) {
        String json = new Gson().toJson(dataMap);
        RequestBody dataPart = RequestBody.create(MediaType.parse("application/json"), json);
        
        // Note: Sending 'data' as part of multipart request, similar to web sending JSON string in 'data' field
        // The ApiService method expects @Part("data") RequestBody
        
        apiService.createExpert(dataPart).enqueue(new Callback<Expert>() {
            @Override
            public void onResponse(Call<Expert> call, Response<Expert> response) {
                if (isAdded()) {
                    if (response.isSuccessful()) {
                        Toast.makeText(getContext(), "Expert created successfully", Toast.LENGTH_SHORT).show();
                        dialog.dismiss();
                        loadData();
                    } else {
                         // Fallback for debugging
                        Toast.makeText(getContext(), "Failed: " + response.code(), Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<Expert> call, Throwable t) {
                if (isAdded()) {
                    Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void loadData() {
        progressBar.setVisibility(View.VISIBLE);
        apiService.getExperts().enqueue(new Callback<List<Expert>>() {
            @Override
            public void onResponse(Call<List<Expert>> call, Response<List<Expert>> response) {
                if (isAdded()) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    if (response.isSuccessful() && response.body() != null) {
                        List<Expert> experts = response.body();
                        if (experts.isEmpty()) {
                            tvEmptyState.setVisibility(View.VISIBLE);
                            recyclerView.setVisibility(View.GONE);
                        } else {
                            tvEmptyState.setVisibility(View.GONE);
                            recyclerView.setVisibility(View.VISIBLE);
                            adapter.setExperts(experts);
                        }
                    } else {
                        Toast.makeText(getContext(), "Failed to load experts", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<List<Expert>> call, Throwable t) {
                if (isAdded()) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private static class ExpertsAdapter extends RecyclerView.Adapter<ExpertsAdapter.ViewHolder> {
        private List<Expert> experts = new ArrayList<>();

        void setExperts(List<Expert> experts) {
            this.experts = experts;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_admin_expert, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            Expert expert = experts.get(position);
            holder.tvName.setText(expert.getName() != null ? expert.getName() : "Unknown");
            holder.tvQualification.setText(expert.getQualification() != null ? expert.getQualification() : "");
            
            Double rating = expert.getRating();
            holder.tvRating.setText((rating != null ? rating : 0.0) + " ★");

            List<String> specs = expert.getSpecialization();
            if (specs != null && !specs.isEmpty()) {
                // Formatting list for display
                 StringBuilder sb = new StringBuilder();
                 for (String s : specs) {
                     if (sb.length() > 0) sb.append(", ");
                     sb.append(s);
                 }
                holder.tvSpec.setText(sb.toString());
            } else {
                holder.tvSpec.setText("General");
            }

            Boolean avail = expert.getAvailable();
            if (Boolean.TRUE.equals(avail)) {
                holder.tvStatus.setText("Available");
                holder.tvStatus.setTextColor(0xFF10B981);
                holder.tvStatus.setBackgroundColor(0xFFECFDF5);
            } else {
                holder.tvStatus.setText("Busy");
                holder.tvStatus.setTextColor(0xFFEF4444);
                holder.tvStatus.setBackgroundColor(0xFFFEF2F2);
            }
        }

        @Override
        public int getItemCount() {
            return experts.size();
        }

        static class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvQualification, tvRating, tvSpec, tvStatus;
            ViewHolder(@NonNull View itemView) {
                super(itemView);
                tvName = itemView.findViewById(R.id.tvExpertName);
                tvQualification = itemView.findViewById(R.id.tvQualification);
                tvRating = itemView.findViewById(R.id.tvRating);
                tvSpec = itemView.findViewById(R.id.tvExpertSpecialization);
                tvStatus = itemView.findViewById(R.id.tvExpertStatus);
            }
        }
    }
}
