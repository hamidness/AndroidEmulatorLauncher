import fs from "fs";
import decompress from "decompress";
import { Observable } from "rxjs";
import { globalLog } from "./Logger";
import { runCommand } from "./ProcessUtils";
import { getPlatform } from "./Platform";
import electron, { app } from "electron";
import rimraf from "rimraf";
import * as path from "path";

export const fileExists = (filename: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        fs.stat(filename, (err, stats: fs.Stats) => {
            if (!err && stats.isFile()) {
                resolve(true);
            } else {
                reject(Error("File " + filename + " does not exists."));
            }
        });
    });
};

export const makeDirRecursive = (dir: string): Promise<undefined> => {
    globalLog("Making dir " + dir);
    return new Promise<undefined>((resolve, reject) => {
        fs.mkdir(dir, { recursive: true }, (error) => {
            if (error) {
                if (error.code === "EEXIST") {
                    globalLog(`Dir ${dir} already exists`);
                    resolve(undefined);
                } else {
                    globalLog(`Error making dir ${dir}: ${error}`);
                    reject(Error("Cannot make dir"));
                }
            } else {
                globalLog(`Making dir ${dir} succeed`);
                resolve(undefined);
            }
        });
    });
};

export const removeDirRecursive = (dir: string): Promise<undefined> => {
    globalLog("Removing dir " + dir);
    return new Promise<undefined>((resolve, reject) => {
        rimraf(dir, (error) => {
            if (error) {
                globalLog(`Error removing dir ${dir}: ${error}`);
                reject(error);
            } else {
                globalLog(`Removing dir ${dir} succeed`);
                resolve(undefined);
            }
        });
    });
};

export const renamePath = (currentPath: string, newPath: string): Promise<undefined> => {
    globalLog(`Renaming ${currentPath} to ${newPath}`);
    return new Promise<undefined>((resolve, reject) => {
        fs.rename(currentPath, newPath, (error) => {
            if (error) {
                globalLog(`Rename failed: ${error}`);
                reject(error);
            } else {
                globalLog(`Rename succeed`);
                resolve(undefined);
            }
        });
    });
};

export const unzipFile = (zipFilename: string, targetDir: string): Promise<string[]> => {
    globalLog(`Unzipping file ${zipFilename} into ${targetDir}`);
    return decompress(zipFilename, targetDir).then(
        (files: decompress.File[]) => {
            globalLog(`Unzipping file succeed`);
            const decompressedFiles = findDecompressedRootPaths(targetDir, files);
            decompressedFiles.forEach((file) => globalLog("Decompressed: " + file));
            return Promise.resolve(decompressedFiles);
        },
        (error) => {
            globalLog(`Error unzipping file: ${error}`);
            return Promise.reject(error);
        }
    );
};

const findDecompressedRootPaths = (targetDir: string, files: decompress.File[]): string[] => {
    const pathSet = new Set<string>();
    files.forEach((file) => {
        const parts = file.path.split(/\\|\//);
        if (parts && parts.length > 0) {
            pathSet.add(parts[0]);
        }
    });

    return Array.from(pathSet).map((extractedFile) => path.resolve(targetDir, extractedFile));
};

export const getDirList = (path: string): Observable<string> => {
    return new Observable<string>((subscriber) => {
        fs.readdir(path, { withFileTypes: true }, (error, files) => {
            if (error) {
                subscriber.error(error);
            }

            files
                .filter((file) => file.isDirectory())
                .map((file) => file.name)
                .forEach((filename) => subscriber.next(filename));
            subscriber.complete();
        });
    });
};

export const getFileContent = (filename: string): Observable<string> => {
    return new Observable<string>((subscriber) => {
        fs.readFile(filename, { encoding: "utf-8" }, (error, data) => {
            if (error) {
                subscriber.error(error);
            } else {
                subscriber.next(data);
                subscriber.complete();
            }
        });
    });
};

export const writeFileContent = (filename: string, content: string): Observable<boolean> => {
    return new Observable<boolean>((subscriber) => {
        fs.writeFile(filename, content, (error) => {
            if (error) {
                subscriber.error(error);
            } else {
                subscriber.next(true);
                subscriber.complete();
            }
        });
    });
};

export const appendFile = (filename: string, content: string): Promise<undefined> => {
    globalLog(`Editing file ${filename}`);
    return new Promise((resolve, reject) => {
        fs.appendFile(filename, content, (error) => {
            if (error) {
                globalLog(`Error editing file ${error}`);
                reject(error);
            } else {
                globalLog(`Editing file succeed.`);
                resolve(undefined);
            }
        });
    });
};

export const makeFilesExecutable = (files: string): Promise<undefined> => {
    globalLog(`Make executable: ${files}`);
    const commandFunc = getPlatform().getCommandMakeFileExecutable;
    if (commandFunc) {
        const command = commandFunc(files);
        if (command) {
            return runCommand(command);
        } else {
            return Promise.resolve(undefined);
        }
    } else {
        return Promise.resolve(undefined);
    }
};

export const getTempPath = (): string => {
    return (app || electron.remote.app).getPath("temp");
};

export const getHomePath = (): string => {
    return (app || electron.remote.app).getPath("home");
};
