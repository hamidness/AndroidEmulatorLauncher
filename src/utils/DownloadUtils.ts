import { globalLog } from "./Logger";
import { ipcRenderer } from "electron";
import { getTempPath } from "./FileUtils";

export type ProgressCallback = (percent: number) => void;

export const downloadFile = (url: string, progressCallback: ProgressCallback): Promise<string> => {
    globalLog(`Downloading ${url}`);

    return new Promise<string>((resolve) => {
        const tempPath = getTempPath();
        ipcRenderer.send("download", {
            url: url,
            properties: { directory: tempPath },
        });

        globalLog(`Download into ${tempPath}`);
        globalLog("Sending download command: " + url);

        ipcRenderer.on("download-progress", (event, progress) => {
            progressCallback(Math.round(progress.percent * 100));
        });

        ipcRenderer.on("download-complete", (event, file) => {
            resolve(file);
        });
    });
};
