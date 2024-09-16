// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

contextBridge.exposeInMainWorld('electronAPI', {
  startPythonServer: () => ipcRenderer.invoke('start-python-server'),
  stopPythonServer: () => ipcRenderer.invoke('stop-python-server'),
  showGoogleCalendar: () => ipcRenderer.send('show-google-calendar'),
  hideGoogleCalendar: () => ipcRenderer.send('hide-google-calendar'),
  showFigmaNotes: () => ipcRenderer.send('show-figma-notes'),
  hideFigmaNotes: () => ipcRenderer.send('hide-figma-notes'),
  showGithub: () => ipcRenderer.send('show-github'),
  hideGithub: () => ipcRenderer.send('hide-github'),
  showGmail: () => ipcRenderer.send('show-gmail'),
  hideGmail: () => ipcRenderer.send('hide-gmail'),
  showChefBot: () => ipcRenderer.send('show-chefbot'),
  hideChefBot: () => ipcRenderer.send('hide-chefbot'),
  toggleDarkMode: (enable: boolean) => ipcRenderer.send('toggle-dark-mode', enable),
  send: (channel: string, data?: any) => {
    ipcRenderer.send(channel, data);
  },
  invoke: (channel: string, data?: any) => {
    return ipcRenderer.invoke(channel, data);
  },
  on: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (event, ...args) => listener(...args));
  },
});

export type ElectronHandler = typeof electronHandler;
