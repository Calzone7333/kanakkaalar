package com.bizzfilling.app;

import android.app.AlertDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.Document;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DocumentsFragment extends Fragment {

    private RecyclerView recyclerView;
    private DocumentsAdapter adapter;
    private List<Document> documentList = new ArrayList<>();
    private LinearLayout layoutUploadZone;
    private ProgressBar progressBarLoading;
    private TextView tvEmptyState;

    private ActivityResultLauncher<String> filePickerLauncher;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_documents, container, false);

        recyclerView = view.findViewById(R.id.recyclerViewDocuments);
        layoutUploadZone = view.findViewById(R.id.layoutUploadZone);
        progressBarLoading = new ProgressBar(getContext()); // Dynamically adding or assume it exists in layout if I
                                                            // checked.
        // Actually, let's just use Toast/Loading dialog for simplicity or finding a
        // progress bar in layout if it exists.
        // fragment_documents.xml usually has a recyclerview. I'll rely on Toast for
        // loading state visibility for now to be safe.

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new DocumentsAdapter(documentList);
        recyclerView.setAdapter(adapter);

        // Upload Zone Click
        if (layoutUploadZone != null) {
            layoutUploadZone.setOnClickListener(v -> openFilePicker());
        }

        // Initialize File Picker
        filePickerLauncher = registerForActivityResult(new ActivityResultContracts.GetContent(), uri -> {
            if (uri != null) {
                uploadFile(uri);
            }
        });

        // Load Documents
        fetchDocuments();

        return view;
    }

    private void openFilePicker() {
        filePickerLauncher.launch("*/*");
    }

    private void fetchDocuments() {
        ApiService apiService = ApiClient.getService(getContext());
        apiService.listMyDocs().enqueue(new Callback<List<Document>>() {
            @Override
            public void onResponse(Call<List<Document>> call, Response<List<Document>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    documentList.clear();
                    documentList.addAll(response.body());
                    adapter.notifyDataSetChanged();
                } else {
                    Toast.makeText(getContext(), "Failed to load documents", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Document>> call, Throwable t) {
                Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void uploadFile(Uri fileUri) {
        Toast.makeText(getContext(), "Uploading...", Toast.LENGTH_SHORT).show();

        try {
            File file = FileUtil.from(getContext(), fileUri);
            RequestBody requestFile = RequestBody
                    .create(MediaType.parse(getContext().getContentResolver().getType(fileUri)), file);
            MultipartBody.Part body = MultipartBody.Part.createFormData("file", file.getName(), requestFile);

            // Assuming we need ownerUserId. In React it was passed.
            // In Android we usually get "me" profile first or just send it if backend
            // requires.
            // Wait, the backend endpoint I added expects "ownerUserId".
            // I need to know the User ID. Since I don't have it readily stored in a static
            // Session manager here (checking Auth logic might take time),
            // I'll assume the backend actually extracts it from the Token (which is
            // standard) but the React code was sending it explicitly.
            // If React sends it, I probably should too.
            // For now, I'll try to fetch User profile first or just send a dummy/stored ID
            // if available.
            // However, looking at the api.js, `getAuth()?.user` is used.
            // In Android, I might need to fetch `getUserProfile` first.

            // For this implementation, let's fetch profile then upload, or rely on backend
            // taking it from token if modified.
            // But to be safe and follow React exactly:
            fetchUserAndUpload(body);

        } catch (Exception e) {
            Toast.makeText(getContext(), "File preparation failed: " + e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }

    private void fetchUserAndUpload(MultipartBody.Part filePart) {
        ApiClient.getService(getContext()).getUserProfile()
                .enqueue(new Callback<com.bizzfilling.app.api.models.User>() {
                    @Override
                    public void onResponse(Call<com.bizzfilling.app.api.models.User> call,
                            Response<com.bizzfilling.app.api.models.User> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            String userId = response.body().getId();
                            RequestBody ownerIdPart = RequestBody.create(MediaType.parse("text/plain"), userId);
                            performUpload(filePart, ownerIdPart);
                        } else {
                            Toast.makeText(getContext(), "Auth check failed. Cannot upload.", Toast.LENGTH_SHORT)
                                    .show();
                        }
                    }

                    @Override
                    public void onFailure(Call<com.bizzfilling.app.api.models.User> call, Throwable t) {
                        Toast.makeText(getContext(), "Network error during auth check", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void performUpload(MultipartBody.Part filePart, RequestBody ownerIdPart) {
        ApiClient.getService(getContext()).uploadDocument(filePart, ownerIdPart).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(getContext(), "Upload successful!", Toast.LENGTH_SHORT).show();
                    fetchDocuments();
                } else {
                    Toast.makeText(getContext(), "Upload failed: " + response.code(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(getContext(), "Upload error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void deleteDocument(Document doc) {
        new AlertDialog.Builder(getContext())
                .setTitle("Delete Document")
                .setMessage("Are you sure you want to delete " + doc.getName() + "?")
                .setPositiveButton("Delete", (dialog, which) -> {
                    ApiClient.getService(getContext()).deleteDocument(doc.getId()).enqueue(new Callback<Void>() {
                        @Override
                        public void onResponse(Call<Void> call, Response<Void> response) {
                            if (response.isSuccessful()) {
                                Toast.makeText(getContext(), "Deleted", Toast.LENGTH_SHORT).show();
                                fetchDocuments();
                            } else {
                                Toast.makeText(getContext(), "Delete failed", Toast.LENGTH_SHORT).show();
                            }
                        }

                        @Override
                        public void onFailure(Call<Void> call, Throwable t) {
                            Toast.makeText(getContext(), "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                        }
                    });
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void downloadDocument(Document doc) {
        Toast.makeText(getContext(), "Downloading " + doc.getName() + "...", Toast.LENGTH_SHORT).show();
        ApiClient.getService(getContext()).downloadDocument(doc.getId()).enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful() && response.body() != null) {
                    boolean written = writeResponseBodyToDisk(response.body(), doc.getName());
                    if (written) {
                        Toast.makeText(getContext(), "Saved to Downloads", Toast.LENGTH_LONG).show();
                    } else {
                        Toast.makeText(getContext(), "Save failed", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(getContext(), "Download failed", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Toast.makeText(getContext(), "Download error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private boolean writeResponseBodyToDisk(ResponseBody body, String filename) {
        try {
            File path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            File file = new File(path, filename);

            InputStream inputStream = null;
            OutputStream outputStream = null;

            try {
                byte[] fileReader = new byte[4096];
                long fileSize = body.contentLength();
                long fileSizeDownloaded = 0;

                inputStream = body.byteStream();
                outputStream = new FileOutputStream(file);

                while (true) {
                    int read = inputStream.read(fileReader);
                    if (read == -1) {
                        break;
                    }
                    outputStream.write(fileReader, 0, read);
                    fileSizeDownloaded += read;
                }
                outputStream.flush();
                return true;
            } catch (Exception e) {
                return false;
            } finally {
                if (inputStream != null)
                    inputStream.close();
                if (outputStream != null)
                    outputStream.close();
            }
        } catch (Exception e) {
            return false;
        }
    }

    // --- Helper for File Util if not exists, create a simple internal class or use
    // standard ---
    // Since I cannot guarantee FileUtil exists, I will implement a minimal getting
    // path from URI logic here or expect it exists.
    // For this environment, I'll rely on a simple content resolver copy to temp
    // file approach which is safer.

    private static class FileUtil {
        public static File from(android.content.Context context, Uri uri) throws java.io.IOException {
            InputStream inputStream = context.getContentResolver().openInputStream(uri);
            String fileName = getFileName(context, uri);
            String[] splitName = splitFileName(fileName);
            String prefix = splitName[0];
            if (prefix.length() < 3) {
                prefix = prefix + "tmp";
            }
            File tempFile = File.createTempFile(prefix, splitName[1], context.getCacheDir());
            tempFile.deleteOnExit();
            FileOutputStream out = new FileOutputStream(tempFile);
            if (inputStream != null) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
                inputStream.close();
            }
            out.close();
            return tempFile;
        }

        private static String getFileName(android.content.Context context, Uri uri) {
            String result = null;
            if (uri.getScheme().equals("content")) {
                try (android.database.Cursor cursor = context.getContentResolver().query(uri, null, null, null, null)) {
                    if (cursor != null && cursor.moveToFirst()) {
                        int index = cursor.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME);
                        if (index >= 0)
                            result = cursor.getString(index);
                    }
                }
            }
            if (result == null) {
                result = uri.getPath();
                int cut = result.lastIndexOf('/');
                if (cut != -1) {
                    result = result.substring(cut + 1);
                }
            }
            return result;
        }

        private static String[] splitFileName(String fileName) {
            String name = fileName;
            String extension = "";
            int i = fileName.lastIndexOf(".");
            if (i != -1) {
                name = fileName.substring(0, i);
                extension = fileName.substring(i);
            }
            return new String[] { name, extension };
        }
    }

    // --- Adapter ---
    private class DocumentsAdapter extends RecyclerView.Adapter<DocumentsAdapter.DocumentViewHolder> {
        private List<Document> items;

        public DocumentsAdapter(List<Document> items) {
            this.items = items;
        }

        @NonNull
        @Override
        public DocumentViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_file_upload, parent, false);
            return new DocumentViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull DocumentViewHolder holder, int position) {
            Document item = items.get(position);
            holder.tvName.setText(item.getName());
            holder.tvMeta.setText("Size: " + item.getFormattedSize());

            // Assuming Date is present or format it.
            if (item.getCreatedAt() != null) {
                holder.tvMeta.setText("Size: " + item.getFormattedSize() + " • " + item.getCreatedAt().split("T")[0]);
            }

            holder.layoutActions.setVisibility(View.VISIBLE);
            holder.tvUploading.setVisibility(View.GONE);
            holder.progressBar.setVisibility(View.GONE);

            holder.btnDelete.setOnClickListener(v -> deleteDocument(item));
            holder.btnDownload.setOnClickListener(v -> downloadDocument(item));
        }

        @Override
        public int getItemCount() {
            return items.size();
        }

        class DocumentViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvMeta, tvUploading;
            ProgressBar progressBar;
            LinearLayout layoutActions;
            ImageButton btnDownload, btnDelete;

            public DocumentViewHolder(@NonNull View itemView) {
                super(itemView);
                tvName = itemView.findViewById(R.id.tvFileName);
                tvMeta = itemView.findViewById(R.id.tvFileMeta);
                tvUploading = itemView.findViewById(R.id.tvUploading);
                progressBar = itemView.findViewById(R.id.progressBar);
                layoutActions = itemView.findViewById(R.id.layoutActions);
                btnDownload = itemView.findViewById(R.id.btnDownload);
                btnDelete = itemView.findViewById(R.id.btnDelete);
            }
        }
    }
}
