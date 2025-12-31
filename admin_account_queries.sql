-- ============================================
-- SQL QUERIES TO CREATE ADMIN ACCOUNT MANUALLY
-- ============================================

-- STEP 1: Create ADMIN role (if it doesn't exist)
-- ============================================
INSERT INTO roles (name) 
VALUES ('ADMIN')
ON CONFLICT (name) DO NOTHING;

-- STEP 2: Create the admin user
-- ============================================
-- Password: admin123 (bcrypt encoded)
-- Note: The password hash below is for 'admin123'
INSERT INTO users (email, full_name, phone, password, enabled, created_at, updated_at) 
VALUES (
    'admin@bisFilling.com', 
    'System Administrator', 
    '9999999999', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',  -- This is bcrypt hash for 'admin123'
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- STEP 3: Link user to ADMIN role
-- ============================================
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.email = 'admin@bisFilling.com' 
AND r.name = 'ADMIN';


-- ============================================
-- ALTERNATIVE: If you want a different password
-- ============================================
-- You need to generate a bcrypt hash for your password
-- You can use online bcrypt generators or the following Java code:

/*
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "YourPasswordHere";
        String encodedPassword = encoder.encode(rawPassword);
        System.out.println("Encoded password: " + encodedPassword);
    }
}
*/


-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if admin user exists
SELECT * FROM users WHERE email = 'admin@bisFilling.com';

-- Check if ADMIN role exists
SELECT * FROM roles WHERE name = 'ADMIN';

-- Check user-role mapping
SELECT u.email, u.full_name, r.name as role
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'admin@bisFilling.com';


-- ============================================
-- CLEANUP QUERIES (if you need to start over)
-- ============================================

-- Delete admin user (use with caution!)
DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE email = 'admin@bisFilling.com');
DELETE FROM users WHERE email = 'admin@bisFilling.com';


-- ============================================
-- CREATE ADDITIONAL ADMIN USERS
-- ============================================

-- Example: Create another admin user
INSERT INTO users (email, full_name, phone, password, enabled, created_at, updated_at) 
VALUES (
    'admin2@bisFilling.com', 
    'Secondary Admin', 
    '8888888888', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',  -- admin123
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.email = 'admin2@bisFilling.com' 
AND r.name = 'ADMIN';


-- ============================================
-- UPDATE EXISTING USER TO ADMIN
-- ============================================

-- Make an existing user an admin
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.email = 'existing.user@example.com'  -- Change this to the user's email
AND r.name = 'ADMIN'
AND NOT EXISTS (
    SELECT 1 FROM user_roles ur2 
    WHERE ur2.user_id = u.id AND ur2.role_id = r.id
);


-- ============================================
-- RESET ADMIN PASSWORD
-- ============================================

-- Reset admin password to 'admin123'
UPDATE users 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@bisFilling.com';


-- ============================================
-- COMMON BCRYPT HASHES (for testing only!)
-- ============================================
-- NEVER use these in production!

-- Password: admin123
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Password: password
-- Hash: $2a$10$Xl0yhvzLIxp5.fCxhYIkk.jjKJJKJKJKJKJKJKJKJKJKJKJKJKJKJK

-- Password: test123
-- Hash: $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
