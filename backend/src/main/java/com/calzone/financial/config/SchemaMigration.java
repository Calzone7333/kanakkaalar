package com.calzone.financial.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class SchemaMigration implements ApplicationRunner {
    private static final Logger logger = LoggerFactory.getLogger(SchemaMigration.class);
    private final JdbcTemplate jdbc;

    public SchemaMigration(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        try {
            Integer hasPassword = jdbc.queryForObject(
                    "SELECT COUNT(*) FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='users' AND column_name='password'",
                    Integer.class);
            Integer hasPasswordHash = jdbc.queryForObject(
                    "SELECT COUNT(*) FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='users' AND column_name='password_hash'",
                    Integer.class);

            if (hasPassword != null && hasPassword > 0 && hasPasswordHash != null && hasPasswordHash > 0) {
                logger.info("users table contains both password and password_hash. Migrating values and dropping password column...");
                jdbc.update("UPDATE users SET password_hash = COALESCE(password_hash, password) WHERE password_hash IS NULL OR password_hash = ''");
                jdbc.update("ALTER TABLE users DROP COLUMN password");
                logger.info("Migration completed: dropped password column");
            } else if (hasPassword != null && hasPassword > 0) {
                logger.info("users table contains legacy password column only. Renaming to password_hash...");
                jdbc.update("ALTER TABLE users CHANGE password password_hash VARCHAR(255) NOT NULL");
                logger.info("Renamed password -> password_hash");
            } else if (hasPasswordHash == null || hasPasswordHash == 0) {
                logger.info("users table missing password_hash column. Adding with default empty string...");
                jdbc.update("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT ''");
                logger.info("Added password_hash column");
            } else {
                logger.info("users table password column state OK");
            }
        } catch (Exception e) {
            logger.warn("SchemaMigration failed or not applicable: {}", e.getMessage());
        }
    }
}
