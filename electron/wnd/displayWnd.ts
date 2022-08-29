import { app, BrowserWindow, dialog, ipcMain, screen } from 'electron';
import path from 'path';

let win: BrowserWindow | null = null;
const iconPath = path.join(__dirname, app.isPackaged ? '../favicon.ico' : '../../public/favicon.ico');
const preloadPath = path.join(__dirname, './preload.js');

export function createDisplayWnd(phase: string) {
  const { height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    x: 0,
    y: (height - 720) / 2,
    width: 320,
    height: 720,
    useContentSize: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    type: 'toolbar',
    title: app.name,
    icon: iconPath,
    show: false,
    frame: false,
    backgroundColor: '#1e1e1f',
    webPreferences: {
      preload: preloadPath,
    },
  });

  win.webContents.once('did-finish-load', () => {
    win?.webContents.send('display-wnd-redirect', phase);
    win?.show();
  });

  win.on('close', () => {
    win = null;
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, `../display.html`));
  } else {
    win.loadURL(`http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/display.html`);
  }

  ipcMain.on('display-wnd-set', (event, value) => {
    if (value === 'close') {
      dialog
        .showMessageBox(win as any, {
          message: '您确定要关闭吗？关闭后客户端状态改变时会重新打开此窗口。',
          type: 'warning',
          buttons: ['取消', '确定'],
          defaultId: 0,
          cancelId: 0,
          title: app.name,
          noLink: true,
        })
        .then(returnValue => {
          if (returnValue.response === 1) win?.close();
        });
    }
  });

  ipcMain.addListener('display-wnd-close', () => win?.close());
}

ipcMain.addListener('display-wnd-show', phase => {
  if (win) {
    win.webContents.send('display-wnd-redirect', phase);
    win.show();
  } else {
    createDisplayWnd(phase);
  }
});
