const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const CANDIDATE_URLS = [
  'http://115.97.59.230:5173', // Public Static IP
  'http://192.168.1.2:5173',   // Local Network IP (Common)
  'http://192.168.1.3:5173',   // Local Network IP (Current)
  'http://192.168.1.4:5173',   // Local Network IP (Alternative)
  'http://localhost:5173'      // Localhost
];

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  const loadApp = async () => {
    for (const url of CANDIDATE_URLS) {
      try {
        console.log(`Trying to load: ${url}`);
        await win.loadURL(url);
        console.log(`Successfully loaded: ${url}`);
        return;
      } catch (err) {
        console.log(`Failed to load ${url}:`, err.message);
      }
    }
    // If all fail
    console.log('All candidate URLs failed. Loading offline page.');
    win.loadFile(path.join(__dirname, 'offline.html'));
  };

  // Initial load
  loadApp();

  // Handle load failures that happen during navigation
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log('Page failed to load:', errorCode, errorDescription);
    // Only show offline page if it's a main frame navigation failure
    if (errorCode !== -3) { // -3 is ABORTED, usually safe to ignore
      // We don't immediately jump to offline here because our loop handles initial connection.
      // But if it drops later:
      if (win.webContents.getURL() === '') {
        win.loadFile(path.join(__dirname, 'offline.html'));
      }
    }
  });

  // Listen for retry attempts from the offline page
  ipcMain.on('retry-connection', () => {
    loadApp();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
