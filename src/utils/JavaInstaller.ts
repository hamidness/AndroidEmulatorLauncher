import { runCommand, runSudoCommand } from "./ProcessUtils";
import { downloadFile, ProgressCallback } from "./DownloadUtils";
import {
  getTempPath,
  makeDirRecursive,
  removeDirRecursive,
  unzipFile,
} from "./FileUtils";
import * as path from "path";
import {
  addToPathEnvironmentVariable,
  setEnvironmentVariable,
} from "./EnvUtils";

export const isJavaInstalled = (): Promise<Boolean> => {
  return runCommand(`java -version`).then(() => true);
};

export const installJava = (progress: ProgressCallback): Promise<undefined> => {
  return downloadJdk(progress)
    .then((zipFilename: string) => extractJdkIntoPath(zipFilename))
    .then((jdkHomePath: string) => {
      return setEnvironmentVariable("JAVA_HOME", jdkHomePath).then(() =>
        addToPathEnvironmentVariable("$JAVA_HOME" + path.sep + "bin")
      );
    });
};

const downloadJdk = (progress: ProgressCallback): Promise<string> => {
  const url =
    "https://github.com/AdoptOpenJDK/openjdk8-binaries/releases/download/jdk8u275-b01/OpenJDK8U-jdk_x64_mac_hotspot_8u275b01.tar.gz";
  return downloadFile(url, progress);
};

const extractJdkIntoPath = (zipFilename: string): Promise<string> => {
  const jdkTempPath = path.resolve(getTempPath(), "jdk8");
  const jdksTargetPath = "/Library/Java/JavaVirtualMachines";

  return removeDirRecursive(jdkTempPath)
    .then(() => makeDirRecursive(jdkTempPath))
    .then(() => unzipFile(zipFilename, jdkTempPath))
    .then((unzippedFiles: string[]) => {
      return runSudoCommand(
        `bash -c "mkdir ${jdksTargetPath}; mv ${unzippedFiles[0]} ${jdksTargetPath}/"`
      ).then(() =>
        path.resolve(
          jdksTargetPath,
          path.basename(unzippedFiles[0]),
          "Contents",
          "Home"
        )
      );
    });
};
