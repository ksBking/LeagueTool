import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { initLcuApi } from '../utils/lcu-api';

let win: BrowserWindow | null = null;
const iconPath = path.join(__dirname, app.isPackaged ? '../favicon.ico' : '../../public/favicon.ico');
const preloadPath = path.join(__dirname, './preload.js');
export const config = {
  checkedForUpdates: false,
};

function checkForUpdates() {
  autoUpdater.logger = log;
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.disableWebInstaller = true;

  autoUpdater.on('checking-for-update', () => {
    // 正在检查更新
  });

  autoUpdater.on('update-not-available', () => {
    // 没有可用更新
    config.checkedForUpdates = true;
    initLcuApi(); // 初始化 LcuApi
  });

  autoUpdater.on('update-available', info => {
    // 检测到新版本
    win?.webContents.send('update-required', info.version);
    autoUpdater.downloadUpdate();
  });

  autoUpdater.on('download-progress', info => {
    // 正在下载
    win?.webContents.send('update-updating', 'downloading', JSON.stringify(info));
  });

  autoUpdater.on('update-downloaded', () => {
    // 下载完成
    win?.webContents.send('update-updating', 'downloaded');
    setTimeout(() => {
      config.checkedForUpdates = true;
      autoUpdater.quitAndInstall();
    }, 2000);
  });

  autoUpdater.on('error', err => {
    config.checkedForUpdates = true;
    dialog
      .showMessageBox(win as never, {
        message: 'LeagueTool 检查更新失败，请检查网络环境或重新安装',
        detail: err.message,
        type: 'error',
        title: app.name,
        noLink: true,
      })
      .then(() => app.quit());
  });

  autoUpdater.checkForUpdates();
}

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

  win.webContents.on('did-finish-load', () => {
    // 加载完成时检查更新
    if (!config.checkedForUpdates) {
      if (app.isPackaged) {
        checkForUpdates();
      } else {
        initLcuApi(); // 初始化 LcuApi
        config.checkedForUpdates = true;
      }
    }
  });

  win.on('close', event => {
    if (config.checkedForUpdates) {
      win = null;
    } else {
      event.preventDefault();
      dialog
        .showMessageBox(win as never, {
          message: '程序正在更新，您确定要关闭吗？',
          type: 'warning',
          buttons: ['取消', '确定'],
          defaultId: 0,
          cancelId: 0,
          title: app.name,
          noLink: true,
        })
        .then(returnValue => {
          if (returnValue.response === 1) app.exit();
        });
    }
  });

  win.on('blur', () => {
    win?.webContents.send('main-wnd-status', 'blur');
  });

  win.on('focus', () => {
    win?.webContents.send('main-wnd-status', 'focus');
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../index.html'));
  } else {
    win.loadURL(`http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`);
  }

  ipcMain.on('main-wnd-set', (event, value) => {
    if (value === 'minimize') {
      win?.minimize();
    } else if (value === 'close') {
      win?.close();
    }
  });

  ipcMain.on('main-wnd-close', () => {
    win?.close();
  });

  ipcMain.on('main-wnd-lcu-phase', (event, phase) => {
    win?.webContents.send('lcu-phase', phase);
  });
}

ipcMain.on('main-wnd-show', () => {
  if (win) {
    win.show();
  } else {
    createMainWnd();
  }
});
