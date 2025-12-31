package com.bizzfilling.app;

import android.graphics.Color;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import java.util.List;

public class ServicesFragment extends Fragment {

    private RecyclerView rvCategories, rvServices;
    private ServicesAdapter servicesAdapter;
    private CategoriesAdapter categoriesAdapter;
    private List<ServiceItem> allServices = new ArrayList<>();
    private List<String> categories = new ArrayList<>();
    private EditText etSearch;
    private String currentCategory = "All";

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_services, container, false);

        etSearch = view.findViewById(R.id.etSearch);
        rvCategories = view.findViewById(R.id.rvCategories);
        rvServices = view.findViewById(R.id.recyclerViewServices);

        // Setup Services Grid
        GridLayoutManager layoutManager = new GridLayoutManager(getContext(), 2);
        rvServices.setLayoutManager(layoutManager);

        loadAllServices();
        loadCategories();

        // Setup Adapters
        servicesAdapter = new ServicesAdapter(allServices);
        rvServices.setAdapter(servicesAdapter);

        categoriesAdapter = new CategoriesAdapter(categories, category -> {
            currentCategory = category;
            filterServices(etSearch.getText().toString());
            categoriesAdapter.notifyDataSetChanged();
        });
        rvCategories.setAdapter(categoriesAdapter);

        // Search Logic
        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                filterServices(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

        return view;
    }

    @Override
    public void onResume() {
        super.onResume();
        if (getActivity() instanceof androidx.appcompat.app.AppCompatActivity) {
            androidx.appcompat.app.ActionBar actionBar = ((androidx.appcompat.app.AppCompatActivity) getActivity())
                    .getSupportActionBar();
            if (actionBar != null) {
                actionBar.hide();
            }
        }
    }

    @Override
    public void onStop() {
        super.onStop();
        if (getActivity() instanceof androidx.appcompat.app.AppCompatActivity) {
            androidx.appcompat.app.ActionBar actionBar = ((androidx.appcompat.app.AppCompatActivity) getActivity())
                    .getSupportActionBar();
            if (actionBar != null) {
                actionBar.show();
            }
        }
    }

    private void loadCategories() {
        categories.clear();
        categories.add("All");
        categories.add("Licenses");
        categories.add("IP & Trademark");
        categories.add("Company");
        categories.add("Tax & Compliance");
        categories.add("New Business");
    }

    private void loadAllServices() {
        allServices.clear();

        // Licenses
        addService("GST Registration", "Starts from ₹499", "Licenses", "#E0F2FE", "#0369A1", R.drawable.ic_service_gst);
        addService("MSME Registration", "Starts from ₹699", "Licenses", "#E0F2FE", "#0369A1",
                R.drawable.ic_service_msme);
        addService("Food License (FSSAI)", "Contact for Price", "Licenses", "#E0F2FE", "#0369A1",
                R.drawable.ic_service_fssai);
        addService("Digital Signature", "Starts from ₹847", "Licenses", "#E0F2FE", "#0369A1",
                R.drawable.ic_service_ie_code); // Using IE code style as it fits digital cert
        addService("Trade License", "Starts from ₹999", "Licenses", "#E0F2FE", "#0369A1",
                R.drawable.ic_service_company);
        addService("Import Export Code", "Starts from ₹249", "Licenses", "#E0F2FE", "#0369A1",
                R.drawable.ic_service_ie_code);
        addService("ISO Certification", "Contact for Price", "Licenses", "#E0F2FE", "#0369A1",
                R.drawable.ic_service_iso);

        // IP & Trademark
        addService("Trademark Reg", "Starts from ₹1349", "IP & Trademark", "#F3E8FF", "#7E22CE",
                R.drawable.ic_service_trademark);
        addService("Trademark Objection", "Starts from ₹2999", "IP & Trademark", "#F3E8FF", "#7E22CE",
                R.drawable.ic_service_trademark);
        addService("Copyright Music", "Starts from ₹499", "IP & Trademark", "#F3E8FF", "#7E22CE",
                R.drawable.ic_service_copyright);
        addService("Patent Search", "Starts from ₹1999", "IP & Trademark", "#F3E8FF", "#7E22CE",
                R.drawable.ic_service_patent);
        addService("Patent Registration", "Starts from ₹5999", "IP & Trademark", "#F3E8FF", "#7E22CE",
                R.drawable.ic_service_patent);

        // Company Change
        addService("Change Name", "Contact for Price", "Company", "#DCFCE7", "#15803D", R.drawable.ic_service_company);
        addService("Add Director", "Contact for Price", "Company", "#DCFCE7", "#15803D", R.drawable.ic_person);
        addService("Remove Director", "Contact for Price", "Company", "#DCFCE7", "#15803D", R.drawable.ic_person);
        addService("Change Address", "Contact for Price", "Company", "#DCFCE7", "#15803D",
                R.drawable.ic_service_company);
        addService("Transfer Shares", "Contact for Price", "Company", "#DCFCE7", "#15803D",
                R.drawable.ic_service_ie_code); // Share transfer -> Exchange
        addService("Increase Capital", "Contact for Price", "Company", "#DCFCE7", "#15803D", R.drawable.ic_service_tax); // Capital
                                                                                                                         // ->
                                                                                                                         // Money

        // Tax & Compliance
        addService("ITR Filing", "Contact for Price", "Tax & Compliance", "#FFEDD5", "#C2410C",
                R.drawable.ic_service_tax);
        addService("TDS Return", "Contact for Price", "Tax & Compliance", "#FFEDD5", "#C2410C",
                R.drawable.ic_service_tax);
        addService("GST Filing", "Starts from ₹2999", "Tax & Compliance", "#FFEDD5", "#C2410C",
                R.drawable.ic_service_gst);
        addService("Annual Compliance", "Contact for Price", "Tax & Compliance", "#FFEDD5", "#C2410C",
                R.drawable.ic_document);
        addService("Payroll", "Contact for Price", "Tax & Compliance", "#FFEDD5", "#C2410C",
                R.drawable.ic_service_payroll);
        addService("Due Diligence", "Starts from ₹999", "Tax & Compliance", "#FFEDD5", "#C2410C",
                R.drawable.ic_feature_secure);

        // New Business
        addService("Pvt Ltd Company", "Starts from ₹999", "New Business", "#FFE4E6", "#BE123C",
                R.drawable.ic_service_company);
        addService("LLP Registration", "Starts from ₹1499", "New Business", "#FFE4E6", "#BE123C",
                R.drawable.ic_service_company);
        addService("Sole Proprietorship", "Starts from ₹699", "New Business", "#FFE4E6", "#BE123C",
                R.drawable.ic_person); // Sole -> Person
        addService("One Person Company", "Starts from ₹999", "New Business", "#FFE4E6", "#BE123C",
                R.drawable.ic_person); // OPC -> Person
        addService("Partnership Firm", "Starts from ₹2499", "New Business", "#FFE4E6", "#BE123C",
                R.drawable.ic_service_company);
        addService("Section 8 NGO", "Starts from ₹999", "New Business", "#FFE4E6", "#BE123C",
                R.drawable.ic_service_msme); // NGO -> Institution
    }

    private void addService(String title, String desc, String category, String bgColor, String textColor,
            int iconResId) {
        allServices.add(new ServiceItem(title, desc, category, bgColor, textColor, iconResId));
    }

    private void filterServices(String query) {
        List<ServiceItem> filteredList = new ArrayList<>();
        for (ServiceItem item : allServices) {
            boolean matchesCategory = currentCategory.equals("All") || item.category.equals(currentCategory);
            boolean matchesQuery = item.title.toLowerCase().contains(query.toLowerCase());

            if (matchesCategory && matchesQuery) {
                filteredList.add(item);
            }
        }
        servicesAdapter.updateList(filteredList);
    }

    // --- Model Class ---
    private static class ServiceItem {
        String title;
        String desc;
        String category;
        String bgColor;
        String textColor;
        int iconResId;

        public ServiceItem(String title, String desc, String category, String bgColor, String textColor,
                int iconResId) {
            this.title = title;
            this.desc = desc;
            this.category = category;
            this.bgColor = bgColor;
            this.textColor = textColor;
            this.iconResId = iconResId;
        }
    }

    // --- Categories Adapter ---
    private class CategoriesAdapter extends RecyclerView.Adapter<CategoriesAdapter.CategoryViewHolder> {
        private List<String> categories;
        private OnCategoryClickListener listener;

        public interface OnCategoryClickListener {
            void onCategoryClick(String category);
        }

        public CategoriesAdapter(List<String> categories, OnCategoryClickListener listener) {
            this.categories = categories;
            this.listener = listener;
        }

        @NonNull
        @Override
        public CategoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_category_chip, parent, false);
            return new CategoryViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull CategoryViewHolder holder, int position) {
            String category = categories.get(position);
            holder.tvCategory.setText(category);

            if (category.equals(currentCategory)) {
                holder.tvCategory.setBackgroundResource(R.drawable.bg_chip_selected);
                holder.tvCategory.setTextColor(Color.WHITE);
            } else {
                holder.tvCategory.setBackgroundResource(R.drawable.bg_chip_unselected);
                holder.tvCategory.setTextColor(Color.parseColor("#6B7280"));
            }

            holder.itemView.setOnClickListener(v -> listener.onCategoryClick(category));
        }

        @Override
        public int getItemCount() {
            return categories.size();
        }

        class CategoryViewHolder extends RecyclerView.ViewHolder {
            TextView tvCategory;

            public CategoryViewHolder(@NonNull View itemView) {
                super(itemView);
                tvCategory = itemView.findViewById(R.id.tvCategoryName);
            }
        }
    }

    // --- Services Adapter ---
    private class ServicesAdapter extends RecyclerView.Adapter<ServicesAdapter.ServiceViewHolder> {
        private List<ServiceItem> services;

        public ServicesAdapter(List<ServiceItem> services) {
            this.services = services;
        }

        public void updateList(List<ServiceItem> newList) {
            this.services = newList;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ServiceViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_public_service, parent, false);
            return new ServiceViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ServiceViewHolder holder, int position) {
            ServiceItem item = services.get(position);
            holder.tvTitle.setText(item.title);
            holder.tvDesc.setText(item.desc);
            holder.ivIcon.setImageResource(item.iconResId);

            // Apply Dynamic Colors
            try {
                holder.cardView.setCardBackgroundColor(Color.parseColor(item.bgColor));
                holder.tvTitle.setTextColor(Color.parseColor(item.textColor));
                holder.tvDesc.setTextColor(Color.parseColor(item.textColor));
                holder.ivIcon.setColorFilter(Color.parseColor(item.textColor));
            } catch (Exception e) {
                e.printStackTrace();
            }

            holder.itemView.setOnClickListener(v -> {
                getParentFragmentManager().beginTransaction()
                        .replace(R.id.content_frame, ServiceDetailFragment.newInstance(
                                item.title,
                                "Detailed description for " + item.title,
                                item.category,
                                item.desc))
                        .addToBackStack(null)
                        .commit();
            });
        }

        @Override
        public int getItemCount() {
            return services.size();
        }

        class ServiceViewHolder extends RecyclerView.ViewHolder {
            TextView tvTitle, tvDesc;
            ImageView ivIcon;
            androidx.cardview.widget.CardView cardView;

            public ServiceViewHolder(@NonNull View itemView) {
                super(itemView);
                tvTitle = itemView.findViewById(R.id.tvServiceTitle);
                tvDesc = itemView.findViewById(R.id.tvServiceDesc);
                ivIcon = itemView.findViewById(R.id.imgServiceIcon);
                cardView = itemView.findViewById(R.id.cardService);
            }
        }
    }
}
