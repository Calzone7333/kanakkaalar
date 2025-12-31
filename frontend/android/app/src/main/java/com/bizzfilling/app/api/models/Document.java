package com.bizzfilling.app.api.models;

import com.google.gson.annotations.SerializedName;

public class Document {
    private String id;

    @SerializedName("filename")
    private String name;

    @SerializedName("contentType")
    private String type;

    @SerializedName("sizeBytes")
    private long sizeBytes;

    @SerializedName("createdAt")
    private String createdAt;

    // Getters
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public long getSizeBytes() {
        return sizeBytes;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    // Helper for formatting size
    public String getFormattedSize() {
        if (sizeBytes <= 0)
            return "0 B";
        final String[] units = new String[] { "B", "KB", "MB", "GB", "TB" };
        int digitGroups = (int) (Math.log10(sizeBytes) / Math.log10(1024));
        return String.format("%.1f %s", sizeBytes / Math.pow(1024, digitGroups), units[digitGroups]);
    }
}
