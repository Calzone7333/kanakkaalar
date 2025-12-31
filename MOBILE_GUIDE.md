# Mobile App Build Guide (Android & iOS)

This guide explains how to turn your Bizzfilling project into a mobile app (APK/IPA).

## Prerequisites
*   **Android**: You must have **Android Studio** installed.
*   **iOS**: You must have a Mac with **Xcode** installed.

## Step 1: Prepare the Project
1.  Run **`START_APP.bat`**.
2.  Select Option **[5] PREPARE MOBILE APP**.
3.  This will:
    *   Build the latest website code.
    *   Sync it to the `android` and `ios` folders.
    *   Ask you to open Android Studio or Xcode.

## Step 2: Build Android APK
1.  When Android Studio opens, wait for "Gradle Sync" to finish (bottom right bar).
2.  **To Run on Emulator/Phone**:
    *   Connect your phone via USB (Enable USB Debugging) OR select an Emulator from the top dropdown.
    *   Click the green **Play (▶)** button in the top toolbar.
3.  **To Build APK File**:
    *   Go to menu: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
    *   Wait for the notification "APK(s) generated successfully".
    *   Click "locate" to find your `.apk` file.

## Step 3: Build iOS App (Mac Only)
1.  When Xcode opens, wait for indexing to finish.
2.  Select your connected iPhone or Simulator from the top bar.
3.  Click the **Play (▶)** button to run.
4.  To archive for App Store: **Product > Archive**.

## Troubleshooting
*   **"Cleartext Traffic Not Permitted"**:
    *   We have already enabled `usesCleartextTraffic="true"` in `AndroidManifest.xml`. This allows the app to talk to your HTTP server (`http://115.97.59.230`).
*   **"Connection Refused"**:
    *   Ensure your backend is running (`START_APP.bat` > Option 1 or 2).
    *   Ensure your phone is on the Internet (WiFi/Data) so it can reach the public IP.
