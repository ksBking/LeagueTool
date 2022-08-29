import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  mainWnd: {
    setWnd: (value: 'minimize' | 'close') => ipcRenderer.send('main-wnd-set', value),
    onWndStatus: (cb: (event: IpcRendererEvent, status: 'blur' | 'focus') => void) => ipcRenderer.on('main-wnd-status', cb),
    getLcuPhase: () => ipcRenderer.send('get-lcu-phase'),
    onLcuPhase: (cb: (event: IpcRendererEvent, phase: string | null) => void) => ipcRenderer.on('lcu-phase', cb),
    getGameNotice: () => ipcRenderer.send('get-game-notice'),
    onGameNotice: (cb: (event: IpcRendererEvent, data: any) => void) => ipcRenderer.on('game-notice', cb),
  },
  displayWnd: {
    setWnd: (value: 'close') => ipcRenderer.send('display-wnd-set', value),
    onRedirect: (cb: (event: IpcRendererEvent, phase: string) => void) => ipcRenderer.on('display-wnd-redirect', cb),
  },
});
