const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    fullscreen: true,
    alwaysOnTop: true,
    kiosk: true, // Kiosk mode prevents exiting with standard shortcuts
    skipTaskbar: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');

  // Register secret exit code: 0955
  let inputBuffer = '';
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown') {
      // Handle numeric keys
      if (input.key >= '0' && input.key <= '9') {
        inputBuffer += input.key;
        if (inputBuffer.length > 4) {
          inputBuffer = inputBuffer.substring(inputBuffer.length - 4);
        }
        
        if (inputBuffer === '0955') {
          app.quit();
        }
      } else {
        // Reset buffer on non-numeric keys if needed, or just let it slide
      }
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  // Prevent typical quit shortcuts
  globalShortcut.register('Alt+F4', () => {
    console.log('Alt+F4 is disabled');
  });

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
