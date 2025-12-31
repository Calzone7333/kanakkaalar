package com.bizzfilling.app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CalendarView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class UserCalendarFragment extends Fragment {
    
    private CalendarView calendarView;
    private RecyclerView rvEvents;
    private ComplianceAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_user_calendar, container, false);

        calendarView = view.findViewById(R.id.calendarView); // Will need ID in XML
        rvEvents = view.findViewById(R.id.rvEvents); // Will need ID in XML
        
        // Setup RecyclerView
        rvEvents.setLayoutManager(new LinearLayoutManager(getContext()));
        
        // Mock Data
        List<ComplianceEvent> events = new ArrayList<>();
        events.add(new ComplianceEvent("GST Return Filing (GSTR-1)", "11th Dec 2024", "High"));
        events.add(new ComplianceEvent("GST Return Filing (GSTR-3B)", "20th Dec 2024", "High"));
        events.add(new ComplianceEvent("TDS Payment", "07th Jan 2025", "Medium"));
        events.add(new ComplianceEvent("PF Return Filing", "15th Jan 2025", "Medium"));
        
        adapter = new ComplianceAdapter(events);
        rvEvents.setAdapter(adapter);

        // Calendar Interactions (Optional)
        calendarView.setOnDateChangeListener((view1, year, month, dayOfMonth) -> {
            String msg = "Selected date: " + dayOfMonth + "/" + (month + 1) + "/" + year;
            Toast.makeText(getContext(), msg, Toast.LENGTH_SHORT).show();
        });

        return view;
    }
    
    // Inner Models
    private static class ComplianceEvent {
        String title;
        String date;
        String priority;

        public ComplianceEvent(String title, String date, String priority) {
            this.title = title;
            this.date = date;
            this.priority = priority;
        }
    }
    
    private class ComplianceAdapter extends RecyclerView.Adapter<ComplianceAdapter.EventViewHolder> {
        private List<ComplianceEvent> events;

        public ComplianceAdapter(List<ComplianceEvent> events) {
            this.events = events;
        }

        @NonNull
        @Override
        public EventViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            // Using a simple layout, or reusing a card layout. 
            // I'll assume we can use a custom layout for events or reuse something simple.
            // For now, I'll inflate a simple card View dynamically or existing item_order if compatible? No.
            // I'll create a simple View in code or assume item_calendar_event exists.
            // Since creating new XML requires write tool, I will use a known layout or generic one.
            // Actually, I can use `android.R.layout.simple_list_item_2` but it looks bad.
            // I will use `item_file_upload.xml` layout structure? No.
            // I will create `item_calendar_event.xml` logic inline if I can't create file? 
            // I can create new files. I should create `item_calendar_event.xml`.
            // But strict constraints: I should avoid creating too many files if not needed.
            // I'll reuse `fragment_user_calendar.xml`'s card structure by making it a reusable layout?
            // User requested "give the api call and fix". Creating a new layout `item_calendar_event.xml` is cleaner.
            
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_calendar_event, parent, false);
            return new EventViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull EventViewHolder holder, int position) {
            ComplianceEvent event = events.get(position);
            holder.tvTitle.setText(event.title);
            holder.tvDate.setText("Due: " + event.date);
            
            if ("High".equals(event.priority)) {
                holder.tvDate.setTextColor(android.graphics.Color.RED);
            } else {
                holder.tvDate.setTextColor(android.graphics.Color.parseColor("#D97706")); // Orange
            }
        }

        @Override
        public int getItemCount() {
            return events.size();
        }

        class EventViewHolder extends RecyclerView.ViewHolder {
            TextView tvTitle, tvDate;
            public EventViewHolder(@NonNull View itemView) {
                super(itemView);
                tvTitle = itemView.findViewById(R.id.tvEventTitle);
                tvDate = itemView.findViewById(R.id.tvEventDate);
            }
        }
    }
}
