-- Create table for Consulting Services if it doesn't exist
CREATE TABLE IF NOT EXISTS consulting_services (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    time VARCHAR(100),
    plans JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Data
INSERT INTO consulting_services (id, name, time, plans) VALUES 
(44, 'Due Diligence', NULL, '{"standard": {"price": 2500, "features": []}, "premium": {"price": 2500, "features": []}, "elite": {"price": 2500, "features": []}}'),
(45, 'Pitch Deck Service', NULL, '{"standard": {"price": 7500, "features": []}, "premium": {"price": 7500, "features": []}, "elite": {"price": 7500, "features": []}}'),
(59, 'NDA', NULL, '{"standard": null, "premium": null, "elite": null}'),
(60, 'Master Service Agreement', NULL, '{"standard": {"price": 2000, "features": []}, "premium": {"price": 2000, "features": []}, "elite": {"price": 2000, "features": []}}'),
(61, 'Franchise Agreement', NULL, '{"standard": {"price": 2000, "features": []}, "premium": {"price": 2000, "features": []}, "elite": {"price": 2000, "features": []}}'),
(62, 'Joint Venture Agreement', NULL, '{"standard": {"price": 2000, "features": []}, "premium": {"price": 2000, "features": []}, "elite": {"price": 2000, "features": []}}'),
(63, 'Founders Agreements', NULL, '{"standard": {"price": 2000, "features": []}, "premium": {"price": 2000, "features": []}, "elite": {"price": 2000, "features": []}}'),
(64, 'Consultancy Services Agreement', NULL, '{"standard": {"price": 1000, "features": []}, "premium": {"price": 1000, "features": []}, "elite": {"price": 1000, "features": []}}'),
(65, 'Employment Agreement', NULL, '{"standard": {"price": 1000, "features": []}, "premium": {"price": 1000, "features": []}, "elite": {"price": 1000, "features": []}}'),
(66, 'Employment Contract', NULL, '{"standard": {"price": 1000, "features": []}, "premium": {"price": 1000, "features": []}, "elite": {"price": 1000, "features": []}}'),
(67, 'Service Contract', NULL, '{"standard": {"price": 1000, "features": []}, "premium": {"price": 1000, "features": []}, "elite": {"price": 1000, "features": []}}'),
(68, 'Legal Notice', NULL, '{"standard": {"price": 1499, "features": ["Drafting of Legal Notice", "Chat & Email Support", "Free Legal Advice"]}, "premium": {"price": 2499, "features": ["Scrutinization of Legal Notice", "Drafting a Legal notice/ Reply to opposite party", "Chat & Email Support", "Free Legal Advice"]}, "elite": null}'),
(69, 'Cheque Bounce Notice', NULL, '{"standard": {"price": 2500, "features": ["Drafting of Legal Notice", "Chat & Email Support", "Free Legal Advice"]}, "premium": {"price": 3500, "features": ["Scrutinization of Legal Notice", "Drafting a Legal notice/ Reply to opposite party", "Chat & Email Support", "Free Legal Advice"]}, "elite": null}'),
(70, 'Recovery of Dues', NULL, '{"standard": {"price": 1000, "features": []}, "premium": {"price": 1000, "features": []}, "elite": {"price": 1000, "features": []}}'),
(71, 'Terms of Service and Privacy Policy', NULL, '{"standard": {"price": 1500, "features": []}, "premium": {"price": 1500, "features": []}, "elite": {"price": 1500, "features": []}}')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name), 
    time = VALUES(time), 
    plans = VALUES(plans);
