# Bizzfilling Project Manual

This is the complete guide to running, building, and managing the Bizzfilling Application.

## 1. Project Overview
The Bizzfilling application consists of three main parts:
1.  **Backend**: A Java Spring Boot server that handles data, logic, and the database.
2.  **Web Application**: A React-based website for users to access the service via a browser.
3.  **Desktop Application**: A Windows executable (.exe) that wraps the web app for a native desktop experience.

## 2. Prerequisites
Before running the application, ensure your system has:
-   **Java 21**: For running the backend.
-   **Node.js (v18 or higher)**: For running the frontend and building the desktop app.
-   **Maven**: For building the backend (if you need to recompile Java code).

## 3. Quick Start (Using the Manager)
We have provided a single script to manage everything: **`START_APP.bat`**.
Double-click this file in the project root folder to see the menu:

-   **[1] START PRODUCTION**: Launches both the Backend and Web App. This is what you use to run the server.
-   **[2] BUILD DESKTOP APPLICATION**: Creates the `.exe` file for Windows users.
-   **[3] START BACKEND ONLY**: Useful if you are debugging the server.
-   **[4] START WEB APP ONLY**: Useful if you are working on the UI.

## 4. Configuration
The application is currently configured to run on your **Public IP**: `115.97.59.230`.

### Changing the IP Address
If your IP changes or you want to move to a different server:
1.  **Frontend**: Edit `frontend/.env.production`.
    ```env
    VITE_API_URL=http://NEW_IP_ADDRESS:8081
    ```
2.  **Backend**: Edit `backend/src/main/resources/application.properties` (if database settings change).
3.  **CORS**: Edit `backend/src/main/java/com/calzone/financial/config/WebConfig.java` to allow the new IP.

**Important**: After changing the IP in `frontend/.env.production`, you must **Rebuild the Desktop App** (Option [2] in `START_APP.bat`) for the changes to apply to the `.exe`.

## 5. Desktop Application
The desktop application is built using Electron.
-   **Build**: Use Option [2] in `START_APP.bat`.
-   **Location**: After building, files are in `frontend/release/`.
    -   `Bizzfilling Setup 0.1.0.exe`: Installer file.
    -   `win-unpacked/Bizzfilling.exe`: Portable executable.

## 6. Troubleshooting

### "Network Error" in Desktop App
-   Ensure the Backend is running (Option [3] or [1]).
-   Ensure the IP in `frontend/.env.production` is correct.
-   If you changed the IP, did you rebuild the desktop app?

### "Port already in use"
-   If the script fails saying port 8081 or 5173 is in use, you may have an old instance running.
-   Close any open command prompt windows named "Bizzfilling Backend" or "Bizzfilling Web App".
-   Open Task Manager and kill `java.exe` or `node.exe` if necessary.

### Backend fails to start
-   Check if MySQL database is running.
-   Check `backend/src/main/resources/application.properties` for correct database username/password.
