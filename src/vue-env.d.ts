/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    mainWnd: {
      setWnd: (value: 'minimize' | 'close') => void;
      onWndStatus: (cb: (event: Electron.IpcRendererEvent, status: 'blur' | 'focus') => void) => void;
      getLcuPhase();
      onLcuPhase(cb: (event: Electron.IpcRendererEvent, phase: string | null) => void);
      getGameNotice: () => void;
      onGameNotice(cb: (event: Electron.IpcRendererEvent, data: any) => void);
    };
    displayWnd: {
      setWnd: (value: 'close') => void;
      onRedirect(cb: (event: Electron.IpcRendererEvent, phase: string) => void);
    };
  };
}
