package com.bizzfilling.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.Order;
import com.bizzfilling.app.utils.SessionManager;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EmployeeCalendarFragment extends Fragment {

    private RecyclerView rvCalendarGrid;
    private RecyclerView rvEvents;
    private TextView tvMonthName;
    private TextView tvSelectedDate;
    private TextView tvEventCount;
    private TextView tvEmpty;
    private ProgressBar progressBar;
    private ImageView btnPrevMonth;
    private ImageView btnNextMonth;

    private Calendar currentDate = Calendar.getInstance();
    private Calendar selectedDate = Calendar.getInstance();
    private List<Order> allOrders = new ArrayList<>();

    private CalendarAdapter calendarAdapter;
    private EventAdapter eventAdapter; // Simple local adapter or reuse OrderAdapter if suitable
    // We will use a simple internal adapter effectively used for the events list to
    // match the UI perfectly

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_employee_calendar, container, false);

        // Init Views
        rvCalendarGrid = view.findViewById(R.id.rvCalendarGrid);
        rvEvents = view.findViewById(R.id.rvEvents);
        tvMonthName = view.findViewById(R.id.tvMonthName);
        tvSelectedDate = view.findViewById(R.id.tvSelectedDate);
        tvEventCount = view.findViewById(R.id.tvEventCount);
        tvEmpty = view.findViewById(R.id.tvEmpty);
        progressBar = view.findViewById(R.id.progressBar);
        btnPrevMonth = view.findViewById(R.id.btnPrevMonth);
        btnNextMonth = view.findViewById(R.id.btnNextMonth);

        // Setup Calendar Grid
        rvCalendarGrid.setLayoutManager(new GridLayoutManager(getContext(), 7));
        calendarAdapter = new CalendarAdapter();
        rvCalendarGrid.setAdapter(calendarAdapter);

        // Setup Events List
        rvEvents.setLayoutManager(new LinearLayoutManager(getContext()));
        eventAdapter = new EventAdapter();
        rvEvents.setAdapter(eventAdapter);

        // Listeners
        btnPrevMonth.setOnClickListener(v -> {
            currentDate.add(Calendar.MONTH, -1);
            updateCalendar();
        });

        btnNextMonth.setOnClickListener(v -> {
            currentDate.add(Calendar.MONTH, 1);
            updateCalendar();
        });

        // Initial Load
        updateCalendar();
        loadEvents();

        return view;
    }

    private void updateCalendar() {
        // Update Month Text
        SimpleDateFormat sdf = new SimpleDateFormat("MMMM yyyy", Locale.US);
        tvMonthName.setText(sdf.format(currentDate.getTime()).toUpperCase());

        // Calculate Days
        List<DateItem> days = new ArrayList<>();
        Calendar calendar = (Calendar) currentDate.clone();
        calendar.set(Calendar.DAY_OF_MONTH, 1);

        int firstDayOfWeek = calendar.get(Calendar.DAY_OF_WEEK) - 1; // 0=Sun, 6=Sat
        int maxDays = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);

        // Add blanks
        for (int i = 0; i < firstDayOfWeek; i++) {
            days.add(null);
        }

        // Add days
        for (int i = 1; i <= maxDays; i++) {
            days.add(new DateItem(i, (Calendar) calendar.clone()));
            calendar.add(Calendar.DAY_OF_MONTH, 1);
        }

        calendarAdapter.setDays(days);
        updateSelectedDateEvents();
    }

    private void updateSelectedDateEvents() {
        // Filter events for selectedDate
        List<Order> filtered = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.US); // Assuming format
        // Note: Backend typically returns ISO "yyyy-MM-dd'T'HH:mm:ss.SSSX"
        // We will try to match based on Day/Month/Year

        for (Order order : allOrders) {
            try {
                Date orderDate = parseDate(order.getCreatedAt());
                if (orderDate != null && isSameDay(orderDate, selectedDate.getTime())) {
                    filtered.add(order);
                }
            } catch (Exception e) {
                // Ignore parse errors
            }
        }

        SimpleDateFormat displayFormat = new SimpleDateFormat("EEEE, d", Locale.US);
        tvSelectedDate.setText(displayFormat.format(selectedDate.getTime()));
        tvEventCount.setText(filtered.size() + " Events");

        if (filtered.isEmpty()) {
            rvEvents.setVisibility(View.GONE);
            tvEmpty.setVisibility(View.VISIBLE);
        } else {
            rvEvents.setVisibility(View.VISIBLE);
            tvEmpty.setVisibility(View.GONE);
            eventAdapter.setEvents(filtered);
        }

        calendarAdapter.notifyDataSetChanged(); // To update selection UI in grid
    }

    private Date parseDate(String dateStr) {
        if (dateStr == null)
            return null;
        // Try generic parsing or ISO
        // Example: 2024-12-09T10:17:02.000Z
        try {
            SimpleDateFormat iso = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US);
            return iso.parse(dateStr);
        } catch (ParseException e) {
            try {
                SimpleDateFormat simple = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
                return simple.parse(dateStr);
            } catch (Exception ex) {
                return null;
            }
        }
    }

    private boolean isSameDay(Date d1, Date d2) {
        Calendar c1 = Calendar.getInstance();
        c1.setTime(d1);
        Calendar c2 = Calendar.getInstance();
        c2.setTime(d2);
        return c1.get(Calendar.YEAR) == c2.get(Calendar.YEAR) &&
                c1.get(Calendar.MONTH) == c2.get(Calendar.MONTH) &&
                c1.get(Calendar.DAY_OF_MONTH) == c2.get(Calendar.DAY_OF_MONTH);
    }

    private void loadEvents() {
        progressBar.setVisibility(View.VISIBLE);
        SessionManager sm = new SessionManager(requireContext());
        ApiService api = ApiClient.getClient(requireContext()).create(ApiService.class);

        // Assuming we want assigned orders - using getAllOrders for now or listAssigned
        // if available
        // User's previous code used `getAllOrders`, React used `orderAPI.listAssigned`
        // We stick to what compiles/works, assuming ApiService has `getAllOrders`
        api.getAllOrders().enqueue(new Callback<List<Order>>() {
            @Override
            public void onResponse(Call<List<Order>> call, Response<List<Order>> response) {
                if (!isAdded())
                    return;
                progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null) {
                    allOrders = response.body();
                    updateCalendar(); // Refresh dots
                }
            }

            @Override
            public void onFailure(Call<List<Order>> call, Throwable t) {
                if (!isAdded())
                    return;
                progressBar.setVisibility(View.GONE);
                // Toast.makeText(getContext(), "Failed to load events",
                // Toast.LENGTH_SHORT).show();
            }
        });
    }

    // --- Models ---
    private static class DateItem {
        int day;
        Calendar date;

        public DateItem(int day, Calendar date) {
            this.day = day;
            this.date = date;
        }
    }

    // --- Adapters ---

    private class CalendarAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
        private List<DateItem> days = new ArrayList<>();

        void setDays(List<DateItem> days) {
            this.days = days;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_calendar_day, parent, false);
            return new DayViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
            DayViewHolder vh = (DayViewHolder) holder;
            DateItem item = days.get(position);

            if (item == null) {
                vh.tvDay.setVisibility(View.INVISIBLE);
                vh.viewDot.setVisibility(View.GONE);
                return;
            }

            vh.tvDay.setVisibility(View.VISIBLE);
            vh.tvDay.setText(String.valueOf(item.day));

            boolean isSelected = isSameDay(item.date.getTime(), selectedDate.getTime());
            boolean isToday = isSameDay(item.date.getTime(), new Date());

            if (isSelected) {
                vh.tvDay.setBackgroundResource(R.drawable.bg_calendar_day_selected); // Orange Circle
                vh.tvDay.setTextColor(Color.WHITE);
            } else {
                vh.tvDay.setBackgroundResource(R.drawable.bg_calendar_day_default); // Transparent/Ripple
                vh.tvDay.setTextColor(isToday ? Color.parseColor("#F2994A") : Color.parseColor("#374151"));
            }

            // Setup Dot
            boolean hasEvent = false;
            for (Order o : allOrders) {
                Date d = parseDate(o.getCreatedAt());
                if (d != null && isSameDay(d, item.date.getTime())) {
                    hasEvent = true;
                    break;
                }
            }

            if (hasEvent) {
                vh.viewDot.setVisibility(View.VISIBLE);
                // If selected, dot should be white/lighter, if not: orange.
                if (isSelected) {
                    vh.viewDot.setBackgroundTintList(android.content.res.ColorStateList.valueOf(Color.WHITE));
                } else {
                    vh.viewDot.setBackgroundTintList(
                            android.content.res.ColorStateList.valueOf(Color.parseColor("#F2994A")));
                }
            } else {
                vh.viewDot.setVisibility(View.GONE);
            }

            vh.itemView.setOnClickListener(v -> {
                selectedDate = (Calendar) item.date.clone();
                updateCalendar(); // refresh UI to move selection
            });
        }

        @Override
        public int getItemCount() {
            return days.size();
        }

        class DayViewHolder extends RecyclerView.ViewHolder {
            TextView tvDay;
            View viewDot;

            DayViewHolder(View v) {
                super(v);
                tvDay = v.findViewById(R.id.tvDay);
                viewDot = v.findViewById(R.id.viewDot);
            }
        }
    }

    private class EventAdapter extends RecyclerView.Adapter<EventAdapter.EventViewHolder> {
        private List<Order> events = new ArrayList<>();

        void setEvents(List<Order> events) {
            this.events = events;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public EventViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_calendar_event, parent, false);
            return new EventViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull EventViewHolder holder, int position) {
            Order order = events.get(position);
            holder.tvTitle.setText(order.getServiceName() != null ? order.getServiceName() : "Service Order");
            holder.tvDate.setText(order.getStatus() != null ? order.getStatus() : "Pending");

            // Style status
            if ("COMPLETED".equalsIgnoreCase(order.getStatus())) {
                holder.tvDate.setTextColor(Color.parseColor("#10B981")); // Green
            } else {
                holder.tvDate.setTextColor(Color.parseColor("#F59E0B")); // Amber
            }
        }

        @Override
        public int getItemCount() {
            return events.size();
        }

        class EventViewHolder extends RecyclerView.ViewHolder {
            TextView tvTitle, tvDate;

            EventViewHolder(View v) {
                super(v);
                tvTitle = v.findViewById(R.id.tvEventTitle);
                tvDate = v.findViewById(R.id.tvEventDate);
            }
        }
    }
}
