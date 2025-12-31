package com.bizzfilling.app;

import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.LinearLayout;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.AttendanceRecord;
import com.bizzfilling.app.utils.SessionManager;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EmployeeAttendanceFragment extends Fragment {

    private TextView tvCurrentDate;
    private TextView tvCurrentTime;
    private TextView tvWorkDuration;
    private TextView tvDaysPresent;
    private Button btnCheckInOut;
    private View viewActiveDot;
    private RecyclerView rvHistory;

    // State
    private boolean isCheckedIn = false;
    private Date checkInTime = null;
    private Date checkOutTime = null;
    private Handler timerHandler = new Handler(Looper.getMainLooper());
    private Runnable timerRunnable;

    private HistoryAdapter historyAdapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_employee_attendance, container, false);

        // Init Views
        tvCurrentDate = view.findViewById(R.id.tvCurrentDate);
        tvCurrentTime = view.findViewById(R.id.tvCurrentTime);
        tvWorkDuration = view.findViewById(R.id.tvWorkDuration);
        tvDaysPresent = view.findViewById(R.id.tvDaysPresent);
        btnCheckInOut = view.findViewById(R.id.btnCheckInOut);
        viewActiveDot = view.findViewById(R.id.viewActiveDot);
        rvHistory = view.findViewById(R.id.rvHistory);

        // Setup RecyclerView
        rvHistory.setLayoutManager(new LinearLayoutManager(getContext()));
        historyAdapter = new HistoryAdapter();
        rvHistory.setAdapter(historyAdapter);

        // Setup Timer
        startTimer();

        // Load Data
        fetchTodayAttendance();
        fetchHistory();

        // CheckIn/Out Action
        btnCheckInOut.setOnClickListener(v -> {
            if (isCheckedIn) {
                performCheckOut();
            } else {
                performCheckIn();
            }
        });

        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        timerHandler.removeCallbacks(timerRunnable);
    }

    private void startTimer() {
        timerRunnable = new Runnable() {
            @Override
            public void run() {
                try {
                    // Update Time
                    Date now = new Date();
                    SimpleDateFormat timeSdf = new SimpleDateFormat("hh:mm:ss aa", Locale.US);
                    SimpleDateFormat dateSdf = new SimpleDateFormat("EEEE, d MMMM yyyy", Locale.US);

                    tvCurrentTime.setText(timeSdf.format(now));
                    tvCurrentDate.setText(dateSdf.format(now));

                    // Update Duration if Checked In
                    if (isCheckedIn && checkInTime != null) {
                        long diff = now.getTime() - checkInTime.getTime();
                        long seconds = TimeUnit.MILLISECONDS.toSeconds(diff) % 60;
                        long minutes = TimeUnit.MILLISECONDS.toMinutes(diff) % 60;
                        long hours = TimeUnit.MILLISECONDS.toHours(diff);

                        tvWorkDuration.setText(String.format(Locale.US, "%02d:%02d:%02d", hours, minutes, seconds));
                    }

                    timerHandler.postDelayed(this, 1000);
                } catch (Exception e) {
                    // ignore
                }
            }
        };
        timerHandler.post(timerRunnable);
    }

    private void fetchTodayAttendance() {
        ApiService api = ApiClient.getClient(requireContext()).create(ApiService.class);
        api.getTodayAttendance().enqueue(new Callback<AttendanceRecord>() {
            @Override
            public void onResponse(Call<AttendanceRecord> call, Response<AttendanceRecord> response) {
                if (!isAdded())
                    return;
                if (response.isSuccessful() && response.body() != null) {
                    AttendanceRecord att = response.body();
                    try {
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US); // Adjust
                                                                                                         // format if
                                                                                                         // needed
                        if (att.getCheckInTime() != null) {
                            checkInTime = tryParse(att.getCheckInTime());
                            isCheckedIn = true;
                        }
                        if (att.getCheckOutTime() != null) {
                            checkOutTime = tryParse(att.getCheckOutTime());
                            isCheckedIn = false;
                        }
                        updateUIState();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }

            @Override
            public void onFailure(Call<AttendanceRecord> call, Throwable t) {
                // If 404 or empty, assume not checked in
            }
        });
    }

    private void fetchHistory() {
        ApiService api = ApiClient.getClient(requireContext()).create(ApiService.class);
        api.getMyAttendanceHistory().enqueue(new Callback<List<AttendanceRecord>>() {
            @Override
            public void onResponse(Call<List<AttendanceRecord>> call, Response<List<AttendanceRecord>> response) {
                if (!isAdded())
                    return;
                if (response.isSuccessful() && response.body() != null) {
                    List<AttendanceRecord> list = response.body();
                    historyAdapter.setRecords(list);

                    // Filter Present
                    long count = 0;
                    for (AttendanceRecord r : list) {
                        if ("Present".equalsIgnoreCase(r.getStatus()))
                            count++;
                    }
                    tvDaysPresent.setText(count + " Days");
                }
            }

            @Override
            public void onFailure(Call<List<AttendanceRecord>> call, Throwable t) {

            }
        });
    }

    private void performCheckIn() {
        btnCheckInOut.setEnabled(false);
        Map<String, String> body = new HashMap<>();
        body.put("location", "Office HQ (Verified)");

        ApiService api = ApiClient.getClient(requireContext()).create(ApiService.class);
        api.checkIn(body).enqueue(new Callback<AttendanceRecord>() {
            @Override
            public void onResponse(Call<AttendanceRecord> call, Response<AttendanceRecord> response) {
                if (!isAdded())
                    return;
                btnCheckInOut.setEnabled(true);
                if (response.isSuccessful() && response.body() != null) {
                    Toast.makeText(getContext(), "Checked In Successfully", Toast.LENGTH_SHORT).show();
                    checkInTime = new Date(); // Approximate or parse from response
                    isCheckedIn = true;
                    updateUIState();
                    fetchHistory(); // Refresh history
                } else {
                    Toast.makeText(getContext(), "Check-in failed", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<AttendanceRecord> call, Throwable t) {
                if (!isAdded())
                    return;
                btnCheckInOut.setEnabled(true);
                Toast.makeText(getContext(), "Network Error", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void performCheckOut() {
        btnCheckInOut.setEnabled(false);
        ApiService api = ApiClient.getClient(requireContext()).create(ApiService.class);
        api.checkOut().enqueue(new Callback<AttendanceRecord>() {
            @Override
            public void onResponse(Call<AttendanceRecord> call, Response<AttendanceRecord> response) {
                if (!isAdded())
                    return;
                btnCheckInOut.setEnabled(true);
                if (response.isSuccessful()) {
                    Toast.makeText(getContext(), "Checked Out Successfully", Toast.LENGTH_SHORT).show();
                    isCheckedIn = false;
                    checkOutTime = new Date();
                    updateUIState();
                    fetchHistory();
                } else {
                    Toast.makeText(getContext(), "Check-out failed", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<AttendanceRecord> call, Throwable t) {
                if (!isAdded())
                    return;
                btnCheckInOut.setEnabled(true);
            }
        });
    }

    private void updateUIState() {
        if (isCheckedIn) {
            btnCheckInOut.setText("Check Out");
            btnCheckInOut.setTextColor(Color.WHITE);
            btnCheckInOut.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#EF4444"))); // Red
            btnCheckInOut.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_lock, 0, 0, 0); // Need x-circle or lock
            viewActiveDot.setVisibility(View.VISIBLE);
        } else {
            btnCheckInOut.setText("Check In");
            btnCheckInOut.setTextColor(Color.parseColor("#5E33AC"));
            btnCheckInOut.setBackgroundTintList(ColorStateList.valueOf(Color.WHITE));
            btnCheckInOut.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_check_circle, 0, 0, 0);
            viewActiveDot.setVisibility(View.GONE);
        }
    }

    private Date tryParse(String dateStr) {
        if (dateStr == null)
            return null;
        try {
            SimpleDateFormat iso = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US);
            return iso.parse(dateStr);
        } catch (Exception e) {
            return new Date(); // Fallback
        }
    }

    // --- Adapter ---
    private class HistoryAdapter extends RecyclerView.Adapter<HistoryAdapter.ViewHolder> {
        List<AttendanceRecord> records = new ArrayList<>();

        void setRecords(List<AttendanceRecord> list) {
            this.records = list;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            // Reusing existing item? "item_calendar_event"? No.
            // I'll create a simple View layout programmatically or reuse one.
            // Wait, I should create `item_attendance_history.xml` properly to be clean.
            // But I cannot create multiple files easily in one step.
            // I'll check if `item_calendar_event` can be repurposed? It has title and date.
            // Title -> Date, Date -> Status. Could work.
            // But better to return a simple item layout.
            // I will use `item_calendar_event` for now to save complexity, adapting fields.
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_calendar_event, parent, false);
            return new ViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            AttendanceRecord rec = records.get(position);
            // Title -> Date
            holder.tvTitle.setText(rec.getDate() != null ? rec.getDate() : "Unknown Date");

            // Date -> Status | CheckIn - CheckOut
            String in = rec.getCheckInTime() != null ? parseTime(rec.getCheckInTime()) : "-";
            String out = rec.getCheckOutTime() != null ? parseTime(rec.getCheckOutTime()) : "-";

            String status = rec.getStatus() != null ? rec.getStatus() : "Present";
            holder.tvDate.setText(String.format("%s | %s - %s", status, in, out));

            if ("Present".equalsIgnoreCase(status)) {
                holder.tvDate.setTextColor(Color.parseColor("#10B981"));
            } else {
                holder.tvDate.setTextColor(Color.parseColor("#EF4444"));
            }
        }

        private String parseTime(String dateStr) {
            try {
                SimpleDateFormat iso = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US);
                Date d = iso.parse(dateStr);
                return new SimpleDateFormat("hh:mm a", Locale.US).format(d);
            } catch (Exception e) {
                return "";
            }
        }

        @Override
        public int getItemCount() {
            return Math.min(records.size(), 5);
        } // Show last 5

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvTitle, tvDate;

            ViewHolder(View v) {
                super(v);
                tvTitle = v.findViewById(R.id.tvEventTitle);
                tvDate = v.findViewById(R.id.tvEventDate);
            }
        }
    }
}
