package com.bizzfilling.app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import java.util.List;

public class DocumentUploadFragment extends Fragment {

    private RecyclerView recyclerView;
    private UploadAdapter adapter;
    private List<UploadItem> uploadList = new ArrayList<>();
    private LinearLayout layoutUploadZone;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_document_upload, container, false);

        recyclerView = view.findViewById(R.id.recyclerViewUploads);
        layoutUploadZone = view.findViewById(R.id.layoutUploadZone);

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        
        // Dummy Data matching the image
        uploadList.add(new UploadItem("Company_budget.xls", "20 MB", "2023-10-27", 53, false));
        uploadList.add(new UploadItem("Registration.csv", "20 MB", "2023-10-27", 100, true));

        adapter = new UploadAdapter(uploadList);
        recyclerView.setAdapter(adapter);

        layoutUploadZone.setOnClickListener(v -> {
            Toast.makeText(getContext(), "Opening File Picker...", Toast.LENGTH_SHORT).show();
        });

        return view;
    }

    // --- Model ---
    private static class UploadItem {
        String name;
        String size;
        String date;
        int progress;
        boolean isCompleted;

        public UploadItem(String name, String size, String date, int progress, boolean isCompleted) {
            this.name = name;
            this.size = size;
            this.date = date;
            this.progress = progress;
            this.isCompleted = isCompleted;
        }
    }

    // --- Adapter ---
    private class UploadAdapter extends RecyclerView.Adapter<UploadAdapter.UploadViewHolder> {
        private List<UploadItem> items;

        public UploadAdapter(List<UploadItem> items) {
            this.items = items;
        }

        @NonNull
        @Override
        public UploadViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_file_upload, parent, false);
            return new UploadViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull UploadViewHolder holder, int position) {
            UploadItem item = items.get(position);
            holder.tvName.setText(item.name);
            holder.tvMeta.setText("Date: " + item.date + "  Size: " + item.size);

            if (item.isCompleted) {
                holder.layoutCompleted.setVisibility(View.VISIBLE);
                holder.tvUploading.setVisibility(View.GONE);
                holder.progressBar.setVisibility(View.GONE);
            } else {
                holder.layoutCompleted.setVisibility(View.GONE);
                holder.tvUploading.setVisibility(View.VISIBLE);
                holder.progressBar.setVisibility(View.VISIBLE);
                holder.progressBar.setProgress(item.progress);
                holder.tvUploading.setText("Uploading...");
            }
        }

        @Override
        public int getItemCount() {
            return items.size();
        }

        class UploadViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvMeta, tvUploading;
            ProgressBar progressBar;
            LinearLayout layoutCompleted;

            public UploadViewHolder(@NonNull View itemView) {
                super(itemView);
                tvName = itemView.findViewById(R.id.tvFileName);
                tvMeta = itemView.findViewById(R.id.tvFileMeta);
                tvUploading = itemView.findViewById(R.id.tvUploading);
                progressBar = itemView.findViewById(R.id.progressBar);
                layoutCompleted = itemView.findViewById(R.id.layoutCompleted);
            }
        }
    }
}
