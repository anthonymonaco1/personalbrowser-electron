import { ElectronHandler } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    __TOMORROW__?: {
      renderWidget: () => void;
    };
    electron: ElectronHandler;
    electronAPI: {
      startPythonServer: () => Promise<void>;
      stopPythonServer: () => Promise<void>;
      showGoogleCalendar: () => void;
      hideGoogleCalendar: () => void;
      showFigmaNotes: () => void;
      hideFigmaNotes: () => void;
      showGithub: () => void;
      hideGithub: () => void;
      showGmail: () => void;
      hideGmail: () => void;
      showChefBot: () => void;
      hideChefBot: () => void;
      toggleDarkMode: (enable: boolean) => void;
      send(channel: string, data?: any): void;
      invoke(channel: string, data?: any): Promise<any>;
      on(channel: string, listener: (...args: any[]) => void): void;
    };
  }
}

export {};
