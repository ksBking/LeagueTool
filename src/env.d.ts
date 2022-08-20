/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    update: {
      onUpdateRequired(callback: (event: Electron.IpcRendererEvent, version: string) => void);
      onUpdating(callback: (event: Electron.IpcRendererEvent, status: string, info: string) => void);
    };
    mainWnd: {
      setWnd: (value: 'minimize' | 'close') => void;
      onWndStatus: (callback: (event: Electron.IpcRendererEvent, status: 'blur' | 'focus') => void) => void;
      getLcuPhase();
      onLcuPhase(callback: (event: Electron.IpcRendererEvent, phase: string | null) => void);
    };
    displayWnd: {
      setWnd: (value: 'close') => void;
    };
  };
}
