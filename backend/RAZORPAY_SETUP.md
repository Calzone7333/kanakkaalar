# Razorpay Configuration

To enable Razorpay payments, you must insert your API keys into the `system_configs` database table.

Run the following SQL commands in your MySQL database:

```sql
INSERT INTO system_configs (config_key, config_value) VALUES ('RAZORPAY_KEY_ID', 'rzp_test_YOUR_KEY_ID');
INSERT INTO system_configs (config_key, config_value) VALUES ('RAZORPAY_KEY_SECRET', 'YOUR_KEY_SECRET');
```

Replace `rzp_test_YOUR_KEY_ID` and `YOUR_KEY_SECRET` with your actual Razorpay credentials.

If you do not add these keys, the application will fall back to the values in `application.properties` or fail if those are also missing.
