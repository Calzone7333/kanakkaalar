package com.bizzfilling.app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.CreateOrderRequest;
import com.bizzfilling.app.api.models.Order;
import com.bizzfilling.app.utils.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ServiceDetailFragment extends Fragment {

    private String title;
    private String desc;
    private String category;
    private String price;

    private TextView tabOverview, tabProcess;
    private LinearLayout contentContainer;
    private boolean isOverviewSelected = true;

    public static ServiceDetailFragment newInstance(String title, String desc, String category, String price) {
        ServiceDetailFragment fragment = new ServiceDetailFragment();
        Bundle args = new Bundle();
        args.putString("title", title);
        args.putString("desc", desc);
        args.putString("category", category);
        args.putString("price", price);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            title = getArguments().getString("title");
            desc = getArguments().getString("desc");
            category = getArguments().getString("category");
            price = getArguments().getString("price");
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_service_detail, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        TextView tvTitle = view.findViewById(R.id.serviceTitle);
        TextView tvPrice = view.findViewById(R.id.servicePrice);
        TextView tvDesc = view.findViewById(R.id.serviceDesc);
        ImageView btnBack = view.findViewById(R.id.btnBack);
        Button btnApply = view.findViewById(R.id.btnApply);
        Button btnCallback = view.findViewById(R.id.btnCallback);

        tabOverview = view.findViewById(R.id.tabOverview);
        tabProcess = view.findViewById(R.id.tabProcess);
        contentContainer = view.findViewById(R.id.contentContainer);

        tvTitle.setText(title);
        tvPrice.setText(price);
        tvDesc.setText(desc);

        btnBack.setOnClickListener(v -> getParentFragmentManager().popBackStack());

        tabOverview.setOnClickListener(v -> switchTab(true));
        tabProcess.setOnClickListener(v -> switchTab(false));

        btnApply.setOnClickListener(v -> {
            // New Flow: Navigate directly without creating order (Deferred Creation)
            getParentFragmentManager().beginTransaction()
                    .replace(R.id.content_frame, ServiceOrderFragment.newInstance(null, title, desc, price))
                    .addToBackStack(null)
                    .commit();
        });
        btnCallback
                .setOnClickListener(v -> Toast.makeText(getContext(), "Callback requested", Toast.LENGTH_SHORT).show());

        switchTab(true);
    }

    private void switchTab(boolean overview) {
        isOverviewSelected = overview;
        if (overview) {
            tabOverview.setBackgroundResource(R.drawable.bg_chip_selected);
            tabOverview.setTextColor(getResources().getColor(android.R.color.white));
            tabProcess.setBackground(null);
            tabProcess.setTextColor(getResources().getColor(R.color.gray_600)); // Ensure this color exists or use hex
        } else {
            tabProcess.setBackgroundResource(R.drawable.bg_chip_selected);
            tabProcess.setTextColor(getResources().getColor(android.R.color.white));
            tabOverview.setBackground(null);
            tabOverview.setTextColor(getResources().getColor(R.color.gray_600));
        }
        loadContent();
    }

    private void loadContent() {
        contentContainer.removeAllViews();

        if (title != null && title.contains("GST Registration")) {
            loadGSTContent();
        } else if (title != null && title.contains("MSME Registration")) {
            loadMSMEContent();
        } else if (title != null && (title.contains("Pvt Ltd") || title.contains("Private Limited"))) {
            loadPvtLtdContent();
        } else {
            loadGenericContent();
        }
    }

    private void loadGSTContent() {
        if (isOverviewSelected) {
            addSectionTitle("Description");
            addText("Every business or corporation that buys and sells goods or services has to register for GST if they cross the threshold. The threshold limit is Rs.40 lakhs for goods and Rs.20 lakhs for services in normal states.");
            addText("With us, you can register for GST for your Private Limited Company and get your GSTIN easily in a few simple steps.");

            addSectionTitle("Key Details");
            addDetailRow("Process Time", "3-7 working days");
            addDetailRow("Authority", "GST Council / CBIC");

            addSectionTitle("Benefits");
            addBulletPoint("Become compliant, reduce indirect taxes, and grow your business.");
            addBulletPoint("You can open a current account easily with GST registration.");
            addBulletPoint("Ability to claim input tax credit on purchases.");
        } else {
            addSectionTitle("Documents Required");
            addBulletPoint("Company PAN / Individual PAN");
            addBulletPoint("Certificate of Incorporation (if applicable)");
            addBulletPoint("Board Resolution (for companies)");
            addBulletPoint("Directors'/Partners' PAN & Aadhar");
            addBulletPoint("Passport size photo");
            addBulletPoint("Address Proof (Electricity Bill/Rent Agreement)");

            addSectionTitle("Deliverables");
            addBulletPoint("GSTIN Number, HSN, and SAC Code");
            addBulletPoint("Provisional GST login credentials");
            addBulletPoint("Expert consultation for 30 days post-registration");
        }
    }

    private void loadPvtLtdContent() {
        if (isOverviewSelected) {
            addSectionTitle("Description");
            addText("Private limited company registration in India provides limited liability, legal independence, and access to tax benefits. It is the ideal structure for startups and SMEs seeking credibility and funding.");
            addText("Governed by the Companies Act, 2013.");

            addSectionTitle("Key Advantages");
            addBulletPoint("Limited Liability: Personal assets are protected.");
            addBulletPoint("Separate Legal Entity: Can own property and contracts independently.");
            addBulletPoint("Easier Access to Capital: Attracts venture capital and loans.");
            addBulletPoint("Perpetual Existence: Business continuity regardless of owner changes.");
        } else {
            addSectionTitle("Minimum Requirements");
            addBulletPoint("Minimum Two Directors (One resident in India)");
            addBulletPoint("Minimum Two Shareholders");
            addBulletPoint("Registered Office Address in India");
            addBulletPoint("Digital Signature Certificate (DSC)");
            addBulletPoint("Director Identification Number (DIN)");

            addSectionTitle("Process Steps");
            addStep("1. DSC & DIN", "Obtain Digital Signature and Director ID.");
            addStep("2. Name Approval", "Apply for unique name reservation.");
            addStep("3. Incorporation Filing", "File SPICe+ forms with MoA & AoA.");
            addStep("4. PAN & TAN", "Auto-generated with incorporation.");
            addStep("5. Certification", "Receive Certificate of Incorporation.");
        }
    }

    private void loadMSMEContent() {
        if (isOverviewSelected) {
            addSectionTitle("Description");
            addText("Small scale businesses play a vital role in improving the economy. These businesses can register themselves under the MSME Act, also known as Udyog Aadhaar or SSI registration.");
            addText("Government schemes can be availed easily when you have an MSME registered.");

            addSectionTitle("Benefits");
            addBulletPoint("Easier to get licenses, registrations, and approvals.");
            addBulletPoint("You can get collateral-free loans.");
            addBulletPoint("Avail various government schemes for small and medium enterprises.");
        } else {
            addSectionTitle("Documents Required");
            addBulletPoint("Applicant's Aadhaar card");
            addBulletPoint("Applicant's PAN");
            addBulletPoint("Company PAN / Incorporation Certificate");
            addBulletPoint("Basic details about company/firm");

            addSectionTitle("Deliverables");
            addBulletPoint("MSME certificate");
        }
    }

    private void loadGenericContent() {
        if (isOverviewSelected) {
            // Overview Content
            addSectionTitle("Description");
            addText("This service helps businesses like yours fulfill regulatory requirements related to " + title
                    + ". Our experts ensure a smooth, transparent, and compliant process.");

            addSectionTitle("Key Benefits");
            addBulletPoint("Ensures legal compliance and avoids penalties.");
            addBulletPoint("Builds credibility and trust with customers.");
            addBulletPoint("Facilitates smoother business operations.");
        } else {
            // Process & Docs Content
            addSectionTitle("Process Steps");
            if (category != null && (category.contains("Licenses") || category.contains("Tax"))) {
                addStep("1. Document Vetting", "Specialists review your documents.");
                addStep("2. Application Filing", "Application prepared and submitted.");
                addStep("3. Fee Payment", "Government fees paid.");
                addStep("4. Certificate Delivery", "Final certificate delivered.");
            } else if (category != null && category.contains("IP")) {
                addStep("1. Preliminary Search", "Comprehensive search for uniqueness.");
                addStep("2. Drafting & Filing", "Application drafted by experts.");
                addStep("3. Examination", "Handling objections if any.");
                addStep("4. Registration", "Certificate granted.");
            } else {
                addStep("1. Data Collection", "Gathering required details.");
                addStep("2. Drafting", "Preparation of documents.");
                addStep("3. Filing", "Submission to authority.");
                addStep("4. Approval", "Final approval received.");
            }

            addSectionTitle("Documents Required");
            addBulletPoint("Proof of Identity (PAN/Aadhar)");
            addBulletPoint("Proof of Address");
            addBulletPoint("Passport Size Photo");
            addBulletPoint("Business Registration Proof");
        }
    }

    private void addSectionTitle(String text) {
        TextView tv = new TextView(getContext());
        tv.setText(text);
        tv.setTextSize(18);
        tv.setTypeface(null, android.graphics.Typeface.BOLD);
        tv.setTextColor(getResources().getColor(R.color.gray_800)); // Ensure color exists
        tv.setPadding(0, 24, 0, 8);
        contentContainer.addView(tv);
    }

    private void addText(String text) {
        TextView tv = new TextView(getContext());
        tv.setText(text);
        tv.setTextSize(14);
        tv.setTextColor(getResources().getColor(R.color.gray_600));
        tv.setLineSpacing(0, 1.4f);
        tv.setPadding(0, 0, 0, 16);
        contentContainer.addView(tv);
    }

    private void addDetailRow(String label, String value) {
        LinearLayout layout = new LinearLayout(getContext());
        layout.setOrientation(LinearLayout.HORIZONTAL);
        layout.setPadding(0, 4, 0, 4);

        TextView tvLabel = new TextView(getContext());
        tvLabel.setText(label + ": ");
        tvLabel.setTypeface(null, android.graphics.Typeface.BOLD);
        tvLabel.setTextSize(14);
        tvLabel.setTextColor(getResources().getColor(R.color.gray_800));

        TextView tvValue = new TextView(getContext());
        tvValue.setText(value);
        tvValue.setTextSize(14);
        tvValue.setTextColor(getResources().getColor(R.color.gray_600));

        layout.addView(tvLabel);
        layout.addView(tvValue);
        contentContainer.addView(layout);
    }

    private void addBulletPoint(String text) {
        TextView tv = new TextView(getContext());
        tv.setText("• " + text);
        tv.setTextSize(14);
        tv.setTextColor(getResources().getColor(R.color.gray_600));
        tv.setPadding(16, 4, 0, 4);
        contentContainer.addView(tv);
    }

    private void addStep(String title, String desc) {
        LinearLayout layout = new LinearLayout(getContext());
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(0, 12, 0, 12);
        layout.setBackgroundResource(R.drawable.bg_card_outline); // Optional: add a bg if available, else simple

        TextView tvTitle = new TextView(getContext());
        tvTitle.setText(title);
        tvTitle.setTextSize(14);
        tvTitle.setTypeface(null, android.graphics.Typeface.BOLD);
        tvTitle.setTextColor(getResources().getColor(R.color.gray_800));

        TextView tvDesc = new TextView(getContext());
        tvDesc.setText(desc);
        tvDesc.setTextSize(13);
        tvDesc.setTextColor(getResources().getColor(R.color.gray_600));

        layout.addView(tvTitle);
        layout.addView(tvDesc);
        contentContainer.addView(layout);
    }

    private void createOrder() {
        SessionManager sessionManager = new SessionManager(getContext());
        String email = sessionManager.getUserEmail();

        if (email == null) {
            Toast.makeText(getContext(), "Please login to continue", Toast.LENGTH_SHORT).show();
            return;
        }

        // Parse price to double (remove non-numeric chars)
        double amount = 499.0; // Default
        try {
            String cleanPrice = price.replaceAll("[^0-9]", "");
            if (!cleanPrice.isEmpty()) {
                amount = Double.parseDouble(cleanPrice);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        CreateOrderRequest request = new CreateOrderRequest(title, email, amount);

        // Show loading state
        Toast.makeText(getContext(), "Creating application...", Toast.LENGTH_SHORT).show();

        ApiService apiService = ApiClient.getClient(getContext()).create(ApiService.class);
        apiService.createOrder(request).enqueue(new Callback<Order>() {
            @Override
            public void onResponse(Call<Order> call, Response<Order> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Toast.makeText(getContext(), "Order Created Successfully!", Toast.LENGTH_SHORT).show();

                    // Navigate to ServiceOrderFragment (to be created)
                    // This matches the web app flow: ServiceHub -> Detail -> Order Flow (Upload ->
                    // Review -> Payment)
                    getParentFragmentManager().beginTransaction()
                            .replace(R.id.content_frame,
                                    ServiceOrderFragment.newInstance(String.valueOf(response.body().getId()), title,
                                            desc, price))
                            .addToBackStack(null)
                            .commit();
                } else {
                    Toast.makeText(getContext(), "Failed to create order: " + response.message(), Toast.LENGTH_SHORT)
                            .show();
                }
            }

            @Override
            public void onFailure(Call<Order> call, Throwable t) {
                Toast.makeText(getContext(), "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
