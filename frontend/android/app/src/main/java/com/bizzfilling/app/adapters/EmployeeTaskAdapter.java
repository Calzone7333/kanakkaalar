package com.bizzfilling.app.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bizzfilling.app.R;
import com.bizzfilling.app.api.models.Order;
import java.util.List;

public class EmployeeTaskAdapter extends RecyclerView.Adapter<EmployeeTaskAdapter.TaskViewHolder> {

    private List<Order> tasks;

    public EmployeeTaskAdapter(List<Order> tasks) {
        this.tasks = tasks;
    }

    public void updateData(List<Order> newTasks) {
        this.tasks = newTasks;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public TaskViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_order, parent, false);
        return new TaskViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull TaskViewHolder holder, int position) {
        Order task = tasks.get(position);
        holder.tvOrderId.setText("#" + task.getId());
        holder.tvServiceName.setText(task.getServiceName());
        holder.tvCustomerEmail.setText("Customer: " + task.getCustomerEmail()); // Assuming customer email is more
                                                                                // relevant here if available, or
                                                                                // fallback
        holder.tvAmount.setText("₹" + (task.getTotalAmount() != null ? task.getTotalAmount().toString() : "0"));
        holder.tvStatus.setText(task.getStatus() != null ? task.getStatus() : "UNKNOWN");

        // Simple status color logic
        String status = task.getStatus();
        if ("COMPLETED".equals(status)) {
            holder.tvStatus.setTextColor(holder.itemView.getContext().getColor(android.R.color.holo_green_dark));
        } else if ("IN_PROGRESS".equals(status)) {
            holder.tvStatus.setTextColor(holder.itemView.getContext().getColor(android.R.color.holo_blue_dark));
        } else {
            holder.tvStatus.setTextColor(holder.itemView.getContext().getColor(android.R.color.darker_gray));
        }
    }

    @Override
    public int getItemCount() {
        return tasks != null ? tasks.size() : 0;
    }

    static class TaskViewHolder extends RecyclerView.ViewHolder {
        TextView tvOrderId, tvServiceName, tvCustomerEmail, tvAmount, tvStatus;

        public TaskViewHolder(@NonNull View itemView) {
            super(itemView);
            tvOrderId = itemView.findViewById(R.id.tvOrderId);
            tvServiceName = itemView.findViewById(R.id.tvServiceName);
            tvCustomerEmail = itemView.findViewById(R.id.tvCustomerEmail);
            tvAmount = itemView.findViewById(R.id.tvAmount);
            tvStatus = itemView.findViewById(R.id.tvStatus);
        }
    }
}
