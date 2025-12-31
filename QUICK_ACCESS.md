# Bizzfilling Application - Quick Access Guide

## 1. How to Start the Application
1.  Go to the project folder: `C:\Users\praka\Downloads\Mobileapp_Bizzfilling\Mobileapp_Bizzfilling`
2.  Double-click **`START_APP.bat`**.
3.  Choose an option:
    *   **Press [1]**: To see the server windows (Good for checking if it works).
    *   **Press [2]**: To run it silently in the background (Good for production).

## 2. How to Access the Application
Once the application is running (wait ~1-2 minutes for it to start), you can access it from any device connected to the same network (Wi-Fi/LAN).

### **A. From This Computer (The Server)**
*   **Web App**: [http://localhost:5173](http://localhost:5173)
*   **Backend API**: [http://localhost:8081](http://localhost:8081)

### **B. From Other Devices (Mobile, Laptop, Desktop)**
*   **Web App**: [http://115.97.59.230:5173](http://115.97.59.230:5173)
*   **Backend API**: [http://115.97.59.230:8081](http://115.97.59.230:8081)

## 3. How to Use the Desktop App
1.  Build it first: Open `START_APP.bat` and press **[4]**.
2.  Go to `frontend/release/`.
3.  Run `Bizzfilling Setup 0.1.0.exe` to install it.
4.  Open "Bizzfilling" from your desktop.
    *   It will automatically connect to the server at `115.97.59.230`.

## 4. Troubleshooting
*   **"Site can't be reached"**:
    *   Ensure the server is running (Option 1 or 2).
    *   Ensure your Firewall allows ports **5173** and **8081**.
*   **"Network Error" in App**:
    *   Ensure the backend is running.
    *   Ensure the IP `115.97.59.230` is correct and reachable.
