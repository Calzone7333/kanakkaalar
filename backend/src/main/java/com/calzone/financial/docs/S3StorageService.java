package com.calzone.financial.docs;

import org.springframework.stereotype.Service;
import java.time.Duration;

/**
 * Stub S3 storage service.
 *
 * This project no longer uses AWS S3 for document storage. Keep a minimal service
 * so any remaining code that autowires S3StorageService does not fail at startup.
 * Methods throw UnsupportedOperationException to make misuse obvious.
 */
@Service
public class S3StorageService {

    public boolean isEnabled() {
        return false;
    }

    public String presignUpload(String key, String contentType, long contentLength, Duration expires) {
        throw new UnsupportedOperationException("S3 storage is disabled in this deployment");
    }

    public String presignDownload(String key, Duration expires) {
        throw new UnsupportedOperationException("S3 storage is disabled in this deployment");
    }
}