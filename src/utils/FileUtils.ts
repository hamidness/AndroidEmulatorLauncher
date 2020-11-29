import fs from "fs";
import AdmZip from "adm-zip";
import { Observable } from "rxjs";
import { globalLog } from "./Logger";
import { runCommand } from "./ProcessUtils";
import { isWin } from "./Platform";

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
        globalLog(`Error making dir ${dir}: ${error}`);
        reject(Error("Cannot make dir"));
      } else {
        globalLog(`Making dir ${dir} succeed`);
        resolve(undefined);
      }
    });
  });
};

export const renamePath = (
  currentPath: string,
  newPath: string
): Promise<undefined> => {
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

export const unzipFile = (
  zipFilename: string,
  targetDir: string
): Promise<undefined> => {
  globalLog(`Unzipping file ${zipFilename} into ${targetDir}`);
  return new Promise<undefined>((resolve, reject) => {
    const admZip = new AdmZip(zipFilename);
    admZip.extractAllToAsync(targetDir, true, (error) => {
      if (error) {
        globalLog(`Error unzipping file: ${error}`);
        reject(error);
      } else {
        globalLog(`Unzipping file succeed`);
        resolve(undefined);
      }
    });
  });
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

export const writeFileContent = (
  filename: string,
  content: string
): Observable<boolean> => {
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

export const makeFilesExecutable = (files: string): Promise<undefined> => {
  globalLog(`Make executable: ${files}`);
  if (!isWin()) {
    return runCommand(`chmod +x ${files}`);
  } else {
    return Promise.resolve(undefined);
  }
};
