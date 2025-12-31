package com.bizzfilling.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.bizzfilling.app.api.ApiClient;
import com.bizzfilling.app.api.ApiService;
import com.bizzfilling.app.api.models.Order;

import java.util.List;

import retrofit2.Response;

public class DraftNotificationWorker extends Worker {

    private static final String CHANNEL_ID = "draft_notifications";
    private static final int NOTIFICATION_ID = 1001;

    public DraftNotificationWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        try {
            ApiService apiService = ApiClient.getClient(getApplicationContext()).create(ApiService.class);
            Response<List<Order>> response = apiService.getAllOrders().execute(); // Synchronous call

            if (response.isSuccessful() && response.body() != null) {
                int draftCount = 0;
                for (Order order : response.body()) {
                    String status = order.getStatus();
                    if ("DRAFT".equalsIgnoreCase(status) ||
                        "DOCUMENTS_PENDING".equalsIgnoreCase(status) ||
                        "PENDING_PAYMENT".equalsIgnoreCase(status)) {
                        draftCount++;
                    }
                }

                if (draftCount > 0) {
                    sendNotification(draftCount);
                }
            }
            return Result.success();
        } catch (Exception e) {
            e.printStackTrace();
            return Result.retry();
        }
    }

    private void sendNotification(int count) {
        Context context = getApplicationContext();
        createNotificationChannel(context);

        Intent intent = new Intent(context, DashboardActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        intent.putExtra("NAVIGATE_TO", "DRAFTS");

        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_notification) // Ensure this exists
                .setContentTitle("Incomplete Applications")
                .setContentText("You have " + count + " draft application(s) pending. Complete them now!")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true);

        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(NOTIFICATION_ID, builder.build());
    }

    private void createNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Draft Notifications";
            String description = "Notifications for incomplete applications";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);
            
            NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }
}
