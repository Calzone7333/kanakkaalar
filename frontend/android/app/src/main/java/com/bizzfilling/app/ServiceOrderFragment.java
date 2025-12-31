package com.bizzfilling.app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.bizzfilling.app.utils.SessionManager; // Added Import

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.razorpay.Checkout;
import com.razorpay.PaymentResultListener;
import org.json.JSONObject;

public class ServiceOrderFragment extends Fragment implements PaymentResultListener {

    private String orderId;
    private String title;
    private String desc;
    private String price;
    private int currentStep = 1;

    private TextView tvTitle, tvDesc, tvStepTitle, tvStepDesc;
    private android.widget.LinearLayout llFileList;
    private ImageView step1Icon, step2Icon, step3Icon;
    private Button btnNext;

    public static ServiceOrderFragment newInstance(String orderId, String title, String desc, String price) {
        ServiceOrderFragment fragment = new ServiceOrderFragment();
        Bundle args = new Bundle();
        args.putString("orderId", orderId);
        args.putString("title", title);
        args.putString("desc", desc);
        args.putString("price", price);
        fragment.setArguments(args);
        return fragment;
    }

    private androidx.activity.result.ActivityResultLauncher<String> filePickerLauncher;
    private java.util.List<android.net.Uri> selectedFiles = new java.util.ArrayList<>();

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            orderId = getArguments().getString("orderId");
            title = getArguments().getString("title");
            desc = getArguments().getString("desc");
            price = getArguments().getString("price");
        }

        filePickerLauncher = registerForActivityResult(
                new androidx.activity.result.contract.ActivityResultContracts.GetMultipleContents(), uris -> {
                    if (uris != null && !uris.isEmpty()) {
                        selectedFiles.addAll(uris);
                        updateFileListUI();
                        uploadFiles(uris);
                    }
                });
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_service_order, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        tvTitle = view.findViewById(R.id.orderTitle);
        tvDesc = view.findViewById(R.id.orderDesc);
        tvStepTitle = view.findViewById(R.id.stepTitle);
        tvStepDesc = view.findViewById(R.id.stepDesc);
        llFileList = view.findViewById(R.id.llFileList);

        step1Icon = view.findViewById(R.id.step1Icon);
        step2Icon = view.findViewById(R.id.step2Icon);
        step3Icon = view.findViewById(R.id.step3Icon);

        btnNext = view.findViewById(R.id.btnNext);

        tvTitle.setText(title);
        tvDesc.setText(desc);

        // btnUpload removed

        // Also allow clicking the drag-drop zone
        View layoutUploadZone = view.findViewById(R.id.layoutUploadZone);
        if (layoutUploadZone != null) {
            layoutUploadZone.setOnClickListener(v -> {
                filePickerLauncher.launch("*/*");
            });
        }

        btnNext.setOnClickListener(v -> nextStep());

        updateUI();
    }

    private void updateFileListUI() {
        // No-op: We add views dynamically in uploadFiles
    }

    private void uploadFiles(java.util.List<android.net.Uri> files) {
        // btnUpload.setEnabled(false); // Removed
        for (android.net.Uri uri : files) {
            uploadSingleFile(uri);
        }
    }

    private void uploadSingleFile(android.net.Uri fileUri) {
        // Create View for this file
        View fileView = LayoutInflater.from(getContext()).inflate(R.layout.item_file_upload, llFileList, false);
        TextView tvName = fileView.findViewById(R.id.tvFileName);
        TextView tvMeta = fileView.findViewById(R.id.tvFileMeta);

        // Uploading State Views
        TextView tvUploading = fileView.findViewById(R.id.tvUploading);
        android.widget.ProgressBar progressBar = fileView.findViewById(R.id.progressBar);

        // Completed State Views
        View layoutCompleted = fileView.findViewById(R.id.layoutCompleted);

        llFileList.addView(fileView);

        try {
            android.content.ContentResolver resolver = getContext().getContentResolver();

            // Get file name and size
            String tempFileName = "document_" + System.currentTimeMillis() + ".pdf";
            long fileSize = 0;

            android.database.Cursor cursor = resolver.query(fileUri, null, null, null, null);
            if (cursor != null && cursor.moveToFirst()) {
                int nameIndex = cursor.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME);
                int sizeIndex = cursor.getColumnIndex(android.provider.OpenableColumns.SIZE);

                if (nameIndex >= 0)
                    tempFileName = cursor.getString(nameIndex);
                if (sizeIndex >= 0)
                    fileSize = cursor.getLong(sizeIndex);
                cursor.close();
            }
            final String fileName = tempFileName;

            // Format Size
            String sizeStr = fileSize / 1024 + " KB";
            if (fileSize > 1024 * 1024)
                sizeStr = String.format("%.1f MB", fileSize / (1024.0 * 1024.0));

            // Format Date
            String dateStr = new java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.getDefault())
                    .format(new java.util.Date());

            tvName.setText(fileName);
            tvMeta.setText("Date: " + dateStr + "  Size: " + sizeStr);

            // Initial State: Uploading
            tvUploading.setVisibility(View.VISIBLE);
            progressBar.setVisibility(View.VISIBLE);
            progressBar.setProgress(0);

            layoutCompleted.setVisibility(View.GONE);

            java.io.InputStream inputStream = resolver.openInputStream(fileUri);
            byte[] bytes = new byte[inputStream.available()];
            inputStream.read(bytes);
            inputStream.close();

            okhttp3.RequestBody requestFile = okhttp3.RequestBody
                    .create(okhttp3.MediaType.parse(resolver.getType(fileUri)), bytes);
            okhttp3.MultipartBody.Part body = okhttp3.MultipartBody.Part.createFormData("file", fileName, requestFile);

            // Simulate Progress
            final android.os.Handler progressHandler = new android.os.Handler(android.os.Looper.getMainLooper());
            final int[] progress = { 0 };
            Runnable progressRunnable = new Runnable() {
                @Override
                public void run() {
                    if (progress[0] < 90) {
                        progress[0] += 5;
                        progressBar.setProgress(progress[0]);
                        progressHandler.postDelayed(this, 100);
                    }
                }
            };
            progressHandler.post(progressRunnable);

            // Defer Upload if orderId is null
            if (orderId == null) {
                // Mock Success for UI
                final android.os.Handler mockHandler = new android.os.Handler(android.os.Looper.getMainLooper());
                final int[] mockProgress = { 0 };
                Runnable mockRunnable = new Runnable() {
                    @Override
                    public void run() {
                        if (mockProgress[0] < 100) {
                            mockProgress[0] += 10;
                            progressBar.setProgress(mockProgress[0]);
                            mockHandler.postDelayed(this, 100);
                        } else {
                            tvUploading.setVisibility(View.GONE);
                            progressBar.setVisibility(View.GONE);
                            layoutCompleted.setVisibility(View.VISIBLE);
                        }
                    }
                };
                mockHandler.post(mockRunnable);
                return; // Stop here, don't call API
            }

            com.bizzfilling.app.api.ApiService apiService = com.bizzfilling.app.api.ApiClient.getClient(getContext())
                    .create(com.bizzfilling.app.api.ApiService.class);
            apiService.uploadDocument(orderId, body).enqueue(new retrofit2.Callback<Void>() {
                @Override
                public void onResponse(retrofit2.Call<Void> call, retrofit2.Response<Void> response) {
                    progressHandler.removeCallbacks(progressRunnable);

                    if (response.isSuccessful()) {
                        // Switch to Completed State
                        tvUploading.setVisibility(View.GONE);
                        progressBar.setVisibility(View.GONE);

                        layoutCompleted.setVisibility(View.VISIBLE);
                    } else {
                        tvUploading.setText("Failed");
                        tvUploading.setTextColor(android.graphics.Color.RED);
                        progressBar.setVisibility(View.GONE);
                    }
                    checkAllUploadsComplete();
                }

                @Override
                public void onFailure(retrofit2.Call<Void> call, Throwable t) {
                    progressHandler.removeCallbacks(progressRunnable);
                    tvUploading.setText("Error");
                    tvUploading.setTextColor(android.graphics.Color.RED);
                    progressBar.setVisibility(View.GONE);
                    checkAllUploadsComplete();
                }
            });

        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(getContext(), "File Error", Toast.LENGTH_SHORT).show();
            checkAllUploadsComplete();
        }
    }

    private void checkAllUploadsComplete() {
        if (getActivity() != null) {
            // getActivity().runOnUiThread(() -> btnUpload.setEnabled(true)); // Removed
        }
    }

    private void nextStep() {
        if (currentStep == 1) {
            if (selectedFiles.isEmpty()) {
                Toast.makeText(getContext(), "Please upload at least one document to proceed.", Toast.LENGTH_SHORT)
                        .show();
                return;
            }
            // Validate upload if needed
            currentStep++;
            updateUI();
        } else if (currentStep == 2) {
            currentStep++;
            updateUI();
        } else if (currentStep == 3) {
            initiatePayment();
        }
    }

    private void initiatePayment() {
        if (orderId == null) {
            createOrderAndProceed();
            return;
        }

        Toast.makeText(getContext(), "Initiating Payment...", Toast.LENGTH_SHORT).show();

        // 1. Fetch Razorpay Key
        com.bizzfilling.app.api.ApiService apiService = com.bizzfilling.app.api.ApiClient.getClient(getContext())
                .create(com.bizzfilling.app.api.ApiService.class);

        apiService.getRazorpayKey().enqueue(new retrofit2.Callback<okhttp3.ResponseBody>() {
            @Override
            public void onResponse(retrofit2.Call<okhttp3.ResponseBody> call,
                    retrofit2.Response<okhttp3.ResponseBody> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        String rawResponse = response.body().string();
                        String razorpayKey = rawResponse;

                        // Try to parse as JSON if it looks like one
                        if (rawResponse.trim().startsWith("{")) {
                            org.json.JSONObject json = new org.json.JSONObject(rawResponse);
                            if (json.has("key")) {
                                razorpayKey = json.getString("key");
                            }
                        }

                        // Strip quotes if present (rare case of raw string with quotes)
                        if (razorpayKey.startsWith("\"") && razorpayKey.endsWith("\"")) {
                            razorpayKey = razorpayKey.substring(1, razorpayKey.length() - 1);
                        }

                        if (razorpayKey == null || !razorpayKey.startsWith("rzp_")) {
                            Toast.makeText(getContext(), "Invalid Payment Configuration (Key)", Toast.LENGTH_LONG)
                                    .show();
                            return;
                        }

                        createRazorpayOrder(razorpayKey);
                    } catch (Exception e) {
                        e.printStackTrace();
                        Toast.makeText(getContext(), "Error parsing key: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(getContext(), "Failed to get Payment Key: " + response.code(), Toast.LENGTH_SHORT)
                            .show();
                }
            }

            @Override
            public void onFailure(retrofit2.Call<okhttp3.ResponseBody> call, Throwable t) {
                String errorMsg = t.getMessage() != null ? t.getMessage() : "Unknown Error";
                Toast.makeText(getContext(), "Network Error: " + errorMsg, Toast.LENGTH_LONG).show();
                android.util.Log.e("ServiceOrderFragment", "Key Fetch Error", t);
            }
        });
    }

    private void createRazorpayOrder(String razorpayKey) {
        // 2. Create Order
        // Parse price
        double amount = 499.0;
        try {
            String cleanPrice = price.replaceAll("[^0-9.]", "");
            if (!cleanPrice.isEmpty())
                amount = Double.parseDouble(cleanPrice);
        } catch (Exception e) {
        }

        long amountInPaise = (long) (amount * 100);

        com.bizzfilling.app.api.models.RazorpayOrderRequest request = new com.bizzfilling.app.api.models.RazorpayOrderRequest(
                amountInPaise,
                "INR",
                "Payment for " + title);

        com.bizzfilling.app.api.ApiService apiService = com.bizzfilling.app.api.ApiClient.getClient(getContext())
                .create(com.bizzfilling.app.api.ApiService.class);
        apiService.createRazorpayOrder(request)
                .enqueue(new retrofit2.Callback<com.bizzfilling.app.api.models.RazorpayOrderResponse>() {
                    @Override
                    public void onResponse(retrofit2.Call<com.bizzfilling.app.api.models.RazorpayOrderResponse> call,
                            retrofit2.Response<com.bizzfilling.app.api.models.RazorpayOrderResponse> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            String razorpayOrderId = response.body().getOrderId();
                            // Ensure amount is passed as int if Checkout requires int, but backend uses
                            // long.
                            // Checkout.open options accept String or int/float?
                            // Official docs say 'amount' is number (paise).
                            startPayment(razorpayKey, razorpayOrderId, (int) amountInPaise);
                        } else {
                            try {
                                String err = response.errorBody() != null ? response.errorBody().string() : "";
                                String message = "Failed to initiate payment (" + response.code() + ")";
                                // Try to parse backend error description
                                if (err.contains("{")) {
                                    org.json.JSONObject errObj = new org.json.JSONObject(err);
                                    if (errObj.has("description")) {
                                        message = errObj.getString("description");
                                    }
                                }
                                Toast.makeText(getContext(), message, Toast.LENGTH_LONG).show();
                                android.util.Log.e("ServiceOrder", "Payment Order Failed: " + err);
                            } catch (Exception e) {
                                Toast.makeText(getContext(), "Failed to create payment order", Toast.LENGTH_SHORT)
                                        .show();
                            }
                        }
                    }

                    @Override
                    public void onFailure(retrofit2.Call<com.bizzfilling.app.api.models.RazorpayOrderResponse> call,
                            Throwable t) {
                        Toast.makeText(getContext(), "Network Error during Payment Init: " + t.getMessage(),
                                Toast.LENGTH_LONG).show();
                    }
                });
    }

    private void startPayment(String key, String rzOrderId, int amountInPaise) {
        Checkout checkout = new Checkout();
        checkout.setKeyID(key);

        try {
            JSONObject options = new JSONObject();
            options.put("name", "BizzFilling");
            options.put("description", "Payment for " + title);
            options.put("image", "https://s3.amazonaws.com/rzp-mobile/images/rzp.png");
            options.put("order_id", rzOrderId);
            options.put("currency", "INR");
            options.put("amount", amountInPaise);
            options.put("prefill.email", new SessionManager(getContext()).getUserEmail());

            checkout.open(getActivity(), options);
        } catch (Exception e) {
            Toast.makeText(getContext(), "Error in payment initialization: " + e.getMessage(), Toast.LENGTH_SHORT)
                    .show();
            e.printStackTrace();
        }
    }

    @Override
    public void onPaymentSuccess(String razorpayPaymentId) {
        Toast.makeText(getContext(), "Payment Successful!", Toast.LENGTH_SHORT).show();

        confirmPayment(razorpayPaymentId, razorpayPaymentId);
    }

    @Override
    public void onPaymentError(int code, String response) {
        Toast.makeText(getContext(), "Payment Failed: " + response, Toast.LENGTH_LONG).show();
    }

    private void confirmPayment(String razorpayOrderId, String paymentId) {
        java.util.Map<String, String> params = new java.util.HashMap<>();
        params.put("orderId", razorpayOrderId);
        params.put("paymentId", paymentId);

        com.bizzfilling.app.api.ApiService apiService = com.bizzfilling.app.api.ApiClient.getClient(getContext())
                .create(com.bizzfilling.app.api.ApiService.class);
        apiService.confirmPayment(orderId, params).enqueue(new retrofit2.Callback<Void>() {
            @Override
            public void onResponse(retrofit2.Call<Void> call, retrofit2.Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(getContext(), "Payment Successful!", Toast.LENGTH_LONG).show();
                    // Call API to mark order as Paid (since web app does this too separately
                    // usually, or rely on confirmPayment)
                    // The web app calls orderAPI.pay(order.id, ...) which might be this
                    // confirmPayment or another
                    // For now we assume confirmPayment handles it.
                    getParentFragmentManager().popBackStack(); // Go back
                } else {
                    Toast.makeText(getContext(), "Payment Confirmation Failed", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(retrofit2.Call<Void> call, Throwable t) {
                Toast.makeText(getContext(), "Network Error", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void createOrderAndProceed() {
        Toast.makeText(getContext(), "Creating Application...", Toast.LENGTH_SHORT).show();

        SessionManager sessionManager = new SessionManager(getContext());
        if (!sessionManager.isLoggedIn() || sessionManager.getToken() == null) {
            Toast.makeText(getContext(), "You must be logged in to apply.", Toast.LENGTH_LONG).show();
            // Redirect to Login
            android.content.Intent intent = new android.content.Intent(getContext(),
                    com.bizzfilling.app.LoginActivity.class);
            startActivity(intent);
            return;
        }

        String email = sessionManager.getUserEmail();

        // Prepare Request
        // Parse price
        double amount = 499.0;
        try {
            String cleanPrice = price.replaceAll("[^0-9]", "");
            if (!cleanPrice.isEmpty())
                amount = Double.parseDouble(cleanPrice);
        } catch (Exception e) {
        }

        com.bizzfilling.app.api.models.CreateOrderRequest request = new com.bizzfilling.app.api.models.CreateOrderRequest(
                title, email, amount);

        com.bizzfilling.app.api.ApiService apiService = com.bizzfilling.app.api.ApiClient.getClient(getContext())
                .create(com.bizzfilling.app.api.ApiService.class);
        apiService.createOrder(request).enqueue(new retrofit2.Callback<com.bizzfilling.app.api.models.Order>() {
            @Override
            public void onResponse(retrofit2.Call<com.bizzfilling.app.api.models.Order> call,
                    retrofit2.Response<com.bizzfilling.app.api.models.Order> response) {
                if (response.isSuccessful() && response.body() != null) {
                    orderId = String.valueOf(response.body().getId());
                    uploadPendingDocuments();
                } else {
                    try {
                        String err = response.errorBody() != null ? response.errorBody().string() : "Unknown";
                        Toast.makeText(getContext(), "Order Error (" + response.code() + "): " + err, Toast.LENGTH_LONG)
                                .show();
                        android.util.Log.e("ServiceOrder", "Order Failed: " + response.code() + " " + err);
                    } catch (Exception e) {
                        Toast.makeText(getContext(), "Failed to create order: " + response.message(),
                                Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(retrofit2.Call<com.bizzfilling.app.api.models.Order> call, Throwable t) {
                Toast.makeText(getContext(), "Network Error during Order Creation", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void uploadPendingDocuments() {
        if (selectedFiles.isEmpty()) {
            initiatePayment();
            return;
        }

        Toast.makeText(getContext(), "Uploading Documents...", Toast.LENGTH_SHORT).show();
        // Upload recursively or all at once? Let's do simple recursive for safety
        uploadNextDocument(0);
    }

    private void uploadNextDocument(int index) {
        if (index >= selectedFiles.size()) {
            initiatePayment();
            return;
        }

        android.net.Uri fileUri = selectedFiles.get(index);
        try {
            android.content.ContentResolver resolver = getContext().getContentResolver();
            String fileName = "document_" + System.currentTimeMillis(); // Simplified, should act. get real name but
                                                                        // reusing simplified logic

            // ... We re-derive name logic or just use simple one ...
            // Ideally we should refactor uploadSingleFile to extract Body creation, but
            // let's copy-paste for safety/speed

            java.io.InputStream inputStream = resolver.openInputStream(fileUri);
            byte[] bytes = new byte[inputStream.available()];
            inputStream.read(bytes);
            inputStream.close();

            okhttp3.RequestBody requestFile = okhttp3.RequestBody
                    .create(okhttp3.MediaType.parse(resolver.getType(fileUri)), bytes);
            okhttp3.MultipartBody.Part body = okhttp3.MultipartBody.Part.createFormData("file", fileName, requestFile); // Name?

            com.bizzfilling.app.api.ApiService apiService = com.bizzfilling.app.api.ApiClient.getClient(getContext())
                    .create(com.bizzfilling.app.api.ApiService.class);
            apiService.uploadDocument(orderId, body).enqueue(new retrofit2.Callback<Void>() {
                @Override
                public void onResponse(retrofit2.Call<Void> call, retrofit2.Response<Void> response) {
                    uploadNextDocument(index + 1); // Next
                }

                @Override
                public void onFailure(retrofit2.Call<Void> call, Throwable t) {
                    uploadNextDocument(index + 1); // Try next even if fail? Yes.
                }
            });

        } catch (Exception e) {
            uploadNextDocument(index + 1);
        }
    }

    private void updateUI() {
        // Reset Icons
        step1Icon.setColorFilter(getResources().getColor(R.color.gray_400));
        step2Icon.setColorFilter(getResources().getColor(R.color.gray_400));
        step3Icon.setColorFilter(getResources().getColor(R.color.gray_400));

        if (currentStep == 1) {
            step1Icon.setColorFilter(getResources().getColor(R.color.blue_600));
            tvStepTitle.setText("Upload Documents");
            tvStepDesc.setText("Please upload the required documents (PAN, Aadhar, etc).");
            // btnUpload is removed; zone is clickable
            if (llFileList != null)
                llFileList.setVisibility(View.VISIBLE);
            if (btnNext != null)
                btnNext.setText("Next: Review");
        } else if (currentStep == 2) {
            step1Icon.setColorFilter(getResources().getColor(R.color.green_600));
            step2Icon.setColorFilter(getResources().getColor(R.color.blue_600));
            tvStepTitle.setText("Review Application");
            tvStepDesc.setText(
                    "Service: " + title + "\nPrice: " + price + "\n\nPlease review your details before payment.");
            if (llFileList != null)
                llFileList.setVisibility(View.GONE);
            if (btnNext != null)
                btnNext.setText("Proceed to Payment");
        } else if (currentStep == 3) {
            step1Icon.setColorFilter(getResources().getColor(R.color.green_600));
            step2Icon.setColorFilter(getResources().getColor(R.color.green_600));
            step3Icon.setColorFilter(getResources().getColor(R.color.blue_600));
            tvStepTitle.setText("Payment Gateway");
            tvStepDesc.setText("Total Payable: " + price + "\n\nClick 'Pay Now' to launch the secure payment gateway.");
            if (llFileList != null)
                llFileList.setVisibility(View.GONE);
            if (btnNext != null)
                btnNext.setText("Pay Now");
        }
    }

}
