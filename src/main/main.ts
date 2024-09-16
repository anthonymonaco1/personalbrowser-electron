/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import fs from 'fs';
import {
  app,
  BrowserWindow,
  WebContentsView,
  shell,
  ipcMain,
  session,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import './dockerService';
// import { authenticateGmail, setupGmailListeners } from './gmailService';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let calendarView: WebContentsView | null = null;
let gmailView: WebContentsView | null = null;
let figmaView: WebContentsView | null = null;
let githubView: WebContentsView | null = null;
let chefbotView: WebContentsView | null = null;

let darkModeEnabled = false;
let darkModeCssHandle: string | null = null;


ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      webviewTag: true, // Enable the <webview> tag
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // Handle IPC calls
  ipcMain.on('show-google-calendar', async () => {
    if (!mainWindow) return;

    // If calendarView already exists, just make it visible
    if (calendarView) {
      calendarView.setVisible(true);
      return;
    }

    // Create the WebContentsView with the shared session
    calendarView = new WebContentsView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        session: session.fromPartition('persist:google'), // Shared session
      },
    });

    // Add the WebContentsView to the main window's contentView
    mainWindow.contentView?.addChildView(calendarView);
    calendarView.webContents.loadURL(
      'https://calendar.google.com/calendar/u/0/r',
    );

    // Set initial bounds for the embedded Google Calendar
    adjustWebContentsViewBounds(calendarView);

    calendarView.webContents.on('did-finish-load', () => {
      let cssPath: string;

      if (app.isPackaged) {
        cssPath = path.join(process.resourcesPath, 'assets', 'dark-theme.css');
      } else {
        cssPath = path.join(__dirname, 'assets', 'dark-theme.css');
      }

      fs.readFile(cssPath, 'utf8', (err: Error | null, css: string) => {
        if (err) {
          console.error('Failed to read dark-theme.css:', err);
          return;
        }
        if (darkModeEnabled) {
          calendarView?.webContents.insertCSS(css).then((handle) => {
            darkModeCssHandle = handle;
            console.log('Dark theme applied to Google Calendar.');
          }).catch((error: Error) => {
            console.error('Failed to inject dark theme CSS:', error);
          });
        }
      });

      // Open DevTools if in debug mode
      // if (isDebug) {
      //   calendarView?.webContents.openDevTools({ mode: 'detach' });
      // }
    });

    // Prevent navigation to unauthorized URLs
    calendarView.webContents.on('will-navigate', (event, url) => {
      if (!url.startsWith('https://calendar.google.com')) {
        event.preventDefault();
      }
    });
  });

  ipcMain.on('hide-google-calendar', () => {
    if (calendarView) {
      calendarView.setVisible(false);
    }
  });

  ipcMain.on('toggle-dark-mode', (event, enable: boolean) => {
    darkModeEnabled = enable;
    if (calendarView) {
      if (darkModeEnabled) {
        const cssPath = app.isPackaged
          ? path.join(process.resourcesPath, 'assets', 'dark-theme.css')
          : path.join(__dirname, 'assets', 'dark-theme.css');

        fs.readFile(cssPath, 'utf8', (err, css) => {
          if (err) {
            console.error('Failed to read dark-theme.css:', err);
            return;
          }
          calendarView?.webContents.insertCSS(css).then((handle) => {
            darkModeCssHandle = handle;
            console.log('Dark theme applied to Google Calendar.');
          }).catch((error) => {
            console.error('Failed to inject dark theme CSS:', error);
          });
        });
      } else if (darkModeCssHandle) {
        calendarView.webContents.removeInsertedCSS(darkModeCssHandle).then(() => {
          darkModeCssHandle = null;
          console.log('Dark theme removed from Google Calendar.');
        }).catch((error) => {
          console.error('Failed to remove dark theme CSS:', error);
        });
      }
    }
  });

  ipcMain.on('show-gmail', async () => {
    if (!mainWindow) return;

    // If gmailView already exists, just make it visible
    if (gmailView) {
      gmailView.setVisible(true);
      return;
    }

    // Create the WebContentsView with the shared session
    gmailView = new WebContentsView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        session: session.fromPartition('persist:google'), // Shared session
      },
    });

    // Add the WebContentsView to the main window's contentView
    mainWindow.contentView?.addChildView(gmailView);
    gmailView.webContents.loadURL('https://mail.google.com/mail/u/0/#inbox');

    // Set initial bounds for the embedded Google Calendar
    adjustWebContentsViewBounds(gmailView);

    // Prevent navigation to unauthorized URLs
    gmailView.webContents.on('will-navigate', (event, url) => {
      if (!url.startsWith('https://mail.google.com')) {
        event.preventDefault();
      }
    });
  });

  ipcMain.on('hide-gmail', () => {
    if (gmailView) {
      gmailView.setVisible(false);
    }
  });

  // IPC handler to show Figma Notes
  ipcMain.on('show-figma-notes', () => {
    if (!mainWindow) return;

    // If figmaView already exists, just make it visible
    if (figmaView) {
      figmaView.setVisible(true);
      return;
    }

    // Create the WebContentsView for Figma Notes with the shared session
    figmaView = new WebContentsView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        // Use the same or a different partition based on your requirements
        session: session.fromPartition('persist:figma'), // Separate session for Figma
      },
    });

    // Add the WebContentsView to the main window's contentView
    mainWindow.contentView?.addChildView(figmaView);
    figmaView.webContents.loadURL(
      'https://www.figma.com/board/rAglTyqpoY8QKSdkKLdHwo/Notes?t=9DY86r5RwL97TbpA-0',
    );

    // Set initial bounds for the embedded Figma Notes
    adjustWebContentsViewBounds(figmaView);

    // Prevent navigation to unauthorized URLs
    figmaView.webContents.on('will-navigate', (event, url) => {
      const allowedDomain = 'https://www.figma.com';
      if (!url.startsWith(allowedDomain)) {
        event.preventDefault();
      }
    });
  });

  // IPC handler to hide Figma Notes
  ipcMain.on('hide-figma-notes', () => {
    if (figmaView) {
      figmaView.setVisible(false);
    }
  });

  // IPC handler to show Github
  ipcMain.on('show-github', () => {
    if (!mainWindow) return;

    // If githubView already exists, just make it visible
    if (githubView) {
      githubView.setVisible(true);
      return;
    }

    // Create the WebContentsView for github Notes with the shared session
    githubView = new WebContentsView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        // Use the same or a different partition based on your requirements
        session: session.fromPartition('persist:github'), // Separate session for github
      },
    });

    // Add the WebContentsView to the main window's contentView
    mainWindow.contentView?.addChildView(githubView);
    githubView.webContents.loadURL('https://github.com/anthonymonaco1');
    // githubView.webContents.openDevTools({ mode: 'detach' });

    // Set initial bounds for the embedded github Notes
    adjustWebContentsViewBounds(githubView);

    // Prevent navigation to unauthorized URLs
    githubView.webContents.on('will-navigate', (event, url) => {
      const allowedDomain = 'https://github.com';
      if (!url.startsWith(allowedDomain)) {
        event.preventDefault();
      }
    });

    // Handle GitHub authentication redirects if necessary
    githubView.webContents.on('did-navigate', (event, url) => {
      console.log(`GitHub WebContents navigated to: ${url}`);
      // Implement any additional logic if needed
    });
  });

  // IPC handler to hide github Notes
  ipcMain.on('hide-github', () => {
    if (githubView) {
      githubView.setVisible(false);
    }
  });

  // IPC handler to show Github
  ipcMain.on('show-chefbot', () => {
    if (!mainWindow) return;

    // If chefbotView already exists, just make it visible
    if (chefbotView) {
      chefbotView.setVisible(true);
      return;
    }

    // Create the WebContentsView for github Notes with the shared session
    chefbotView = new WebContentsView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        // Use the same or a different partition based on your requirements
        session: session.fromPartition('persist:vercel'), // Separate session for github
      },
    });

    // Add the WebContentsView to the main window's contentView
    mainWindow.contentView?.addChildView(chefbotView);
    chefbotView.webContents.loadURL('https://gourmetchefbot.vercel.app/');
    // chefbotView.webContents.openDevTools({ mode: 'detach' });

    // Set initial bounds for the embedded github Notes
    adjustWebContentsViewBounds(chefbotView);

    // Handle GitHub authentication redirects if necessary
    chefbotView.webContents.on('did-navigate', (event, url) => {
      console.log(`GitHub WebContents navigated to: ${url}`);
      // Implement any additional logic if needed
    });
  });

  // IPC handler to hide github Notes
  ipcMain.on('hide-chefbot', () => {
    if (chefbotView) {
      chefbotView.setVisible(false);
    }
  });

  mainWindow.on('ready-to-show', async () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      try {
        // await authenticateGmail();
        mainWindow.show();
      } catch (error) {
        console.error('Authentication failed:', error);
      }
    }
  });

  // Listen for window resize to adjust WebContentsView bounds
  mainWindow.on('resize', () => {
    adjustWebContentsViewBounds(calendarView);
    adjustWebContentsViewBounds(figmaView);
    adjustWebContentsViewBounds(githubView);
    adjustWebContentsViewBounds(gmailView);
    adjustWebContentsViewBounds(chefbotView);
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (calendarView) {
      calendarView = null;
    }
    if (figmaView) {
      figmaView = null;
    }
    if (githubView) {
      githubView = null;
    }
    if (gmailView) {
      gmailView = null;
    }
    if (chefbotView) {
      chefbotView = null;
    }
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Adjusts the bounds of the given WebContentsView based on the current window size and view type.
 * @param view The WebContentsView instance to adjust.
 */
function adjustWebContentsViewBounds(view: WebContentsView | null) {
  if (!mainWindow || !view) return;

  const [windowWidth, windowHeight] = mainWindow.getSize();
  const navbarHeight = 64; // Assuming sidebar is 1/6th of the window
  const mainAreaHeight = windowHeight - navbarHeight;

  let bounds: { x: number; y: number; width: number; height: number };
  bounds = {
    x: 0,
    y: navbarHeight,
    width: windowWidth,
    height: mainAreaHeight,
  };

  view.setBounds(bounds);
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('window-all-closed', () => {
  // On macOS, it's common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // Re-create a window in the app when the dock icon is clicked (macOS)
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
