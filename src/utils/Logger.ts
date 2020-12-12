import { BrowserWindow, ipcMain, ipcRenderer } from "electron";
import { Observable } from "rxjs";

export const logIpcWriteChannel = "logWriteGlobal";
export const logIpcReadChannel = "logReadGlobal";
export const logIpcClearChannel = "logClearGlobal";

const MAX_LOGS_LENGTH = 50000;

export const globalLog = (log: string): void => {
    ipcRenderer.send(logIpcWriteChannel, log);
};

export const clearLog = (): void => {
    ipcRenderer.send(logIpcClearChannel);
};

export const listenGlobalLogs = (): Observable<string> => {
    return new Observable<string>((subscriber) => {
        const listener = (event: any, logs: any) => {
            subscriber.next(logs);
        };

        ipcRenderer.on(logIpcReadChannel, listener);
        ipcRenderer.send(logIpcWriteChannel, "");
        return () => {
            ipcRenderer.removeListener(logIpcReadChannel, listener);
        };
    });
};

export const registerLogDispatchListener = (openWindows: () => BrowserWindow[]): void => {
    let globalLogs = "";

    ipcMain.on(logIpcWriteChannel, (event, log) => {
        globalLogs = appendLog(globalLogs, log);
        openWindows().forEach((window: BrowserWindow) => {
            window.webContents.send(logIpcReadChannel, globalLogs);
        });
    });

    ipcMain.on(logIpcClearChannel, () => {
        globalLogs = "";
        openWindows().forEach((window: BrowserWindow) => {
            window.webContents.send(logIpcReadChannel, globalLogs);
        });
    });
};

const appendLog = (currentLogs: string, log: string): string => {
    if (log.length === 0 || log[log.length - 1] === "\n" || log[log.length - 1] === "\r") {
        currentLogs += log;
    } else {
        currentLogs += log + "\n";
    }

    if (currentLogs.length >= MAX_LOGS_LENGTH) {
        currentLogs = currentLogs.substring(currentLogs.length - MAX_LOGS_LENGTH);
    }

    return currentLogs;
};
