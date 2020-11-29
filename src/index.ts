import { app, BrowserWindow, ipcMain, Menu, MenuItem } from "electron";
import NewWindowSpec from "./utils/NewWindowSpec";
import { download } from "electron-dl";
import { registerLogDispatchListener } from "./utils/Logger";
import { createApplicationMenu, MENU_ID_SHOW_LOGS } from "./Menu";
import { newLogWindowSpec } from "./utils/WindowUtils";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

let mainWindow: BrowserWindow | null;

interface WindowDictionary {
  [key: string]: BrowserWindow;
}

const openWindows: WindowDictionary = {};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 400,
    resizable: false,
    backgroundColor: "#2A2A2A",
    show: true,
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  registerNewAvdDialogListener();
  registerCloseCreateAvdWindowListener();
  registerDownloadListener();
  registerReloadPageListener();
  registerLogDispatchListener(() => Object.values(openWindows));
};

app.on("ready", () => {
  setupMenu();
  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function registerNewAvdDialogListener() {
  ipcMain.on("start-new-window", (event, state) => {
    openNewWindow(state);
  });
}

const openNewWindow = (newWindowSpec: NewWindowSpec) => {
  if (Object.keys(openWindows).indexOf(newWindowSpec.id) >= 0) {
    return;
  }

  const width = newWindowSpec.width;
  const height = newWindowSpec.height;
  const x =
    mainWindow != null
      ? mainWindow.getBounds().x + mainWindow.getBounds().width / 2 - width / 2
      : 0;
  const y =
    mainWindow != null
      ? mainWindow.getBounds().y +
        mainWindow.getBounds().height / 2 -
        height / 2
      : 0;

  const newWindow: BrowserWindow = new BrowserWindow({
    width: width,
    height: height,
    resizable: false,
    show: true,
    parent: mainWindow ? mainWindow : undefined,
    x: x,
    y: y,
    modal: false,
    center: true,
    fullscreenable: false,
    minimizable: false,
    maximizable: false,
    backgroundColor: newWindowSpec.backgroundColor,
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true,
      enableRemoteModule: true,
    },
  });

  newWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#/${newWindowSpec.route}`);
  newWindow.on("closed", () => {
    delete openWindows[newWindowSpec.id];
  });
  openWindows[newWindowSpec.id] = newWindow;
};

function registerCloseCreateAvdWindowListener() {
  ipcMain.on("close-create-avd-window", (event, state) => {
    if (openWindows["new-avd"]) {
      openWindows["new-avd"].close();
      delete openWindows["new-avd"];
    }
    if (mainWindow) {
      mainWindow.webContents.send("refresh-avd-list");
    }
  });
}

function registerDownloadListener() {
  ipcMain.on("download", (event, state) => {
    if (mainWindow) {
      state.properties.onProgress = (status: any) => {
        if (mainWindow) {
          mainWindow.webContents.send("download-progress", status);
        }
      };

      download(mainWindow, state.url, state.properties).then((dl) => {
        if (mainWindow) {
          mainWindow.webContents.send("download-complete", dl.getSavePath());
        }
      });
    }
  });
}

function registerReloadPageListener() {
  ipcMain.on("reload-page", (event, state) => {
    if (mainWindow) {
      mainWindow.reload();
    }
  });
}

process.on("unhandledRejection", (error) => {
  if (error) {
    console.log("unhandledRejection", error.toString());
  }
});

const setupMenu = () => {
  const appMenu = createApplicationMenu((menuItem: MenuItem) => {
    if (menuItem.id === MENU_ID_SHOW_LOGS) {
      openNewWindow(newLogWindowSpec());
    }
  });
  Menu.setApplicationMenu(appMenu);
};
