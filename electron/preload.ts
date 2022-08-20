import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  update: {
    onUpdateRequired: (callback: (event: Electron.IpcRendererEvent, version: string) => void) => ipcRenderer.on('update-required', callback),
    onUpdating: (callback: (event: Electron.IpcRendererEvent, status: string, info: unknown) => void) => ipcRenderer.on('update-updating', callback),
  },
  mainWnd: {
    setWnd: (value: 'minimize' | 'close') => ipcRenderer.send('main-wnd-set', value),
    onWndStatus: (callback: (event: Electron.IpcRendererEvent, status: 'blur' | 'focus') => void) => ipcRenderer.on('main-wnd-status', callback),
    getLcuPhase: () => ipcRenderer.send('get-lcu-phase'),
    onLcuPhase: (callback: (event: Electron.IpcRendererEvent, phase: string | null) => void) => ipcRenderer.on('lcu-phase', callback),
  },
  displayWnd: {
    setWnd: (value: 'close') => ipcRenderer.send('display-wnd-set', value),
  },
});
