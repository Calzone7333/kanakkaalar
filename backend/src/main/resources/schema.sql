-- Workflow Events Table
CREATE TABLE IF NOT EXISTS workflow_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    stage VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    details LONGTEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_stage (stage),
    INDEX idx_created_at (created_at),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Workflow Alerts Table
CREATE TABLE IF NOT EXISTS workflow_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(500),
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    resolved_by VARCHAR(255),
    INDEX idx_order_id (order_id),
    INDEX idx_alert_type (alert_type),
    INDEX idx_resolved (resolved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Extended Orders Table with workflow status
ALTER TABLE orders ADD COLUMN IF NOT EXISTS workflow_status VARCHAR(50) DEFAULT 'WEB';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS assigned_to BIGINT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS assigned_employee VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS value DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'MEDIUM';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS expected_completion_date TIMESTAMP NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE orders ADD INDEX IF NOT EXISTS idx_workflow_status (workflow_status);
ALTER TABLE orders ADD INDEX IF NOT EXISTS idx_assigned_to (assigned_to);

-- Sample data for testing (optional)
INSERT INTO workflow_events (order_id, stage, status, description, created_at, updated_at) VALUES
(1002, 'WEB', 'COMPLETED', 'Lead captured from website form', NOW(), NOW()),
(1002, 'CRM', 'COMPLETED', 'Lead scored and routed to sales team', NOW(), NOW()),
(1002, 'SALES', 'COMPLETED', 'Customer approved quote and made payment', NOW(), NOW()),
(1002, 'ONBD', 'IN_PROGRESS', 'Documents being uploaded and verified', NOW(), NOW())

ON DUPLICATE KEY UPDATE updated_at = NOW();
