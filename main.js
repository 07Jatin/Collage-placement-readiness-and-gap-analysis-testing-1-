const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

let mainWindow;
let pythonProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'Placify AI - Career Readiness Suite',
    backgroundColor: '#0f172a', // Dark theme background
  });

  // Load the app
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, 'frontend/build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Function to start the Python backend
function startBackend() {
  const pythonPath = path.join(__dirname, '.venv', 'Scripts', 'python.exe');
  const scriptPath = path.join(__dirname, 'backend', 'main.py');
  
  console.log('Starting backend at:', scriptPath);
  
  // In production, we might use a bundled executable instead of python.exe
  pythonProcess = spawn(pythonPath, [scriptPath], {
    cwd: path.join(__dirname, 'backend'),
    env: { ...process.env, PORT: '8000' }
  });

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

app.on('ready', () => {
  // startBackend(); // Uncomment if we want Electron to manage the backend lifecycle
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (pythonProcess) pythonProcess.kill();
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Clean up on exit
app.on('will-quit', () => {
  if (pythonProcess) pythonProcess.kill();
});
