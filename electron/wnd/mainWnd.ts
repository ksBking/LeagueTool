import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let win: BrowserWindow | null = null;

const iconPath = path.join(__dirname, app.isPackaged ? '../favicon.ico' : '../../public/favicon.ico');

export function createMainWnd() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    useContentSize: true,
    resizable: false,
    title: app.name,
    icon: iconPath,
    show: false,
    frame: false,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: !true,
      contextIsolation: !false,
      preload: path.join(__dirname, './preload.js'),
    },
  });

  win.once('ready-to-show', () => {
    win?.show();
  });

  ipcMain.on('set-wnd', (event, value) => {
    if (value === 'minimize') {
      win?.minimize();
    } else if (value === 'close') {
      win?.close();
    }
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../index.html'));
  } else {
    win.loadURL(`http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`);
  }
}
