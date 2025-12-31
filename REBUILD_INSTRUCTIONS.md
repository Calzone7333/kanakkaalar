# Final Rebuild Instructions

Your application code is now fully updated with:
1.  **Smart Network Detection**: Automatically connects to Local WiFi or Public Server.
2.  **Back Buttons**: Added to all Native/Desktop screens.
3.  **Crash Fixes**: All dashboards and login pages are repaired.

To apply these changes, you must **REBUILD** the applications.

## 1. Desktop App (Windows .exe)
1.  Run **`START_APP.bat`**.
2.  Select Option **[4] BUILD DESKTOP APPLICATION**.
3.  Wait for the build to finish.
4.  The new installer will be in: `frontend/release/Bizzfilling Setup 0.1.0.exe`.
5.  **Install this new version** to see the changes.

## 2. Mobile App (Android APK)
1.  Run **`START_APP.bat`**.
2.  Select Option **[5] PREPARE MOBILE APP**.
3.  Choose **[A]** to open Android Studio.
4.  In Android Studio:
    *   Wait for "Gradle Sync" to finish.
    *   Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
    *   Install the new APK on your phone.

## 3. Web App
*   No rebuild needed if running locally (it updates automatically).
*   If deploying to a server, run `npm run build` inside the `frontend` folder and copy the `dist` folder to your server.

## Verification
*   **Open the App**: It should now automatically connect without "Connection Refused" errors.
*   **Check Back Button**: You should see the Back Arrow on Login/Signup pages (only on Desktop/Mobile).
