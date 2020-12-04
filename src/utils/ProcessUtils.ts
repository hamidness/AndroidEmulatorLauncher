import { exec } from "child_process";
import { globalLog } from "./Logger";
import sudo from "sudo-prompt";
import { getAssetPath } from "./AssetUtils";

export const runCommand = async (
  command: string,
  log?: (text: string) => void
): Promise<undefined> => {
  globalLog(`Running command: ${command}`);
  return new Promise((resolve, reject) => {
    const childProcess = exec(command);

    if (childProcess.stdout) {
      childProcess.stdout.setEncoding("utf8");
      childProcess.stdout.on("data", (chunk) => {
        if (log) {
          log(chunk.trimEnd() + "\n");
        }
        globalLog(chunk.trimEnd());
      });
    }
    if (childProcess.stderr) {
      childProcess.stderr.setEncoding("utf8");
      childProcess.stderr.on("data", (chunk) => {
        if (log) {
          log(chunk.trimEnd() + "\n");
        }
        globalLog(chunk.trimEnd());
      });
    }

    childProcess.on("close", (code) => {
      globalLog(`Exit with error code ${code}`);
      if (code === 0) {
        resolve(undefined);
      } else {
        reject(Error(`Exit with error code ${code}`));
      }
    });
  });
};

export const runSudoCommand = (
  command: string,
  log?: (text: string) => void
): Promise<undefined> => {
  globalLog(`Running sudo command: ${command}`);
  return new Promise<undefined>((resolve, reject) => {
    const iconPath = getAssetPath("icon/icon.icns");
    const options = {
      name: "Android Emulator Launcher",
      icns: iconPath,
      encoding: "utf8",
    };
    sudo.exec(command, options, function (error, stdout, stderr) {
      if (stdout) {
        globalLog(stdout.toString());
        if (log) {
          log(stdout.toString());
        }
      }
      if (stderr) {
        globalLog(stderr.toString());
        if (log) {
          log(stderr.toString());
        }
      }
      if (error) {
        globalLog(`Error: ${error}`);
        reject(error);
      } else {
        globalLog(`Succeed.`);
        resolve(undefined);
      }
    });
  });
};
