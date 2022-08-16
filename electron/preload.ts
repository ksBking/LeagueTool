import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  setWnd: (value: string) => ipcRenderer.send('set-wnd', value),
});
