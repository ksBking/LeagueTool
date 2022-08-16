import { app, Tray, Menu, shell } from 'electron';

import { createMainWnd } from './wnd/mainWnd';
import path from 'path';

let tray: Tray | null = null;

const iconPath = path.join(__dirname, app.isPackaged ? '../favicon.ico' : '../../public/favicon.ico');

// 创建托盘
function createTray() {
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      type: 'separator',
    },
    {
      label: '退出',
      sublabel: '关闭',
      click: () => app.quit(),
    },
  ]);
  tray.on('click', () => {
    console.log('tray click');
  });

  tray.setContextMenu(contextMenu);
  tray.setToolTip(app.name);
}

app.whenReady().then(() => {
  createTray(); // 创建托盘
  createMainWnd(); // 创建主窗口
});

app.on('window-all-closed', () => null);

// 使用默认浏览器打开新窗口链接
app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    setImmediate(() => {
      shell.openExternal(url);
    });
    return { action: 'deny' };
  });
});
