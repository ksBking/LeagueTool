import { app, Tray, Menu, shell, ipcMain, session } from 'electron';
import path from 'path';
import { checkForUpdates } from './update';
import { createMainWnd } from './wnd/mainWnd';
import { initLcuApi } from './utils/lcu-api';

// app 单实例
if (!app.requestSingleInstanceLock()) {
  app.exit();
} else {
  app.on('second-instance', () => {
    ipcMain.emit('main-wnd-show');
  });
}

let tray: Tray | null = null;
const iconPath = path.join(__dirname, app.isPackaged ? '../favicon.ico' : '../../public/favicon.ico');

// 创建托盘
function createTray() {
  // 取消窗口默认菜单
  if (app.isPackaged) Menu.setApplicationMenu(null);
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      type: 'separator',
    },
    {
      label: '退出',
      click: () => app.quit(),
    },
  ]);

  tray.on('click', () => {
    ipcMain.emit('main-wnd-show');
  });

  tray.setContextMenu(contextMenu);
  tray.setToolTip(app.name);
}

app.whenReady().then(async () => {
  // 检查更新
  await checkForUpdates();
  // 添加 vue devtool
  if (!app.isPackaged) await session.defaultSession.loadExtension('C:/Users/Bking/AppData/Local/Microsoft/Edge/User Data/Default/Extensions/olofadcdnkkjdfgjcmjaadnlehnnihnl/6.2.1_0');
  createTray(); // 创建托盘
  createMainWnd(); // 创建界面
  initLcuApi(); // 初始化 LcuApi
});

app.on('window-all-closed', () => null);

// 使用默认浏览器打开新窗口链接
app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    setImmediate(() => shell.openExternal(url));
    return { action: 'deny' };
  });
});
