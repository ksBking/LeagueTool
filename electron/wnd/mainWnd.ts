import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { getGameNotice } from '../utils/data-api';

let win: BrowserWindow | null = null;
const iconPath = path.join(__dirname, app.isPackaged ? '../favicon.ico' : '../../public/favicon.ico');
const preloadPath = path.join(__dirname, './preload.js');

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
    backgroundColor: '#1e1e1f',
    webPreferences: {
      preload: preloadPath,
    },
  });

  win.once('ready-to-show', () => {
    win?.show();
  });

  win.on('close', () => {
    win = null;
  });

  win.on('blur', () => {
    win?.webContents.send('main-wnd-status', 'blur');
  });

  win.on('focus', () => {
    win?.webContents.send('main-wnd-status', 'focus');
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../main.html'));
  } else {
    win.loadURL(`http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/main.html`);
  }

  ipcMain.on('main-wnd-set', (event, value) => {
    if (value === 'minimize') {
      win?.minimize();
    } else if (value === 'close') {
      win?.close();
    }
  });

  ipcMain.addListener('main-wnd-close', () => {
    win?.close();
  });

  ipcMain.addListener('main-wnd-lcu-phase', phase => {
    win?.webContents.send('lcu-phase', phase);
  });

  ipcMain.on('get-game-notice', async () => {
    const data = await getGameNotice();
    win?.webContents.send('game-notice', data);
  });
}

ipcMain.addListener('main-wnd-show', () => {
  if (win) {
    win.show();
  } else {
    createMainWnd();
  }
});
