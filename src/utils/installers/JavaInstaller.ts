import { runCommand, runSudoCommand } from "../ProcessUtils";
import { downloadFile, ProgressCallback } from "../DownloadUtils";
import { getTempPath, makeDirRecursive, removeDirRecursive, unzipFile } from "../FileUtils";
import * as path from "path";
import { addToPathEnvironmentVariable, setEnvironmentVariable } from "../EnvUtils";
import { getPlatform } from "../Platform";

export const isJavaInstalled = (): Promise<boolean> => {
    return runCommand(`java -version`).then(() => true);
};

export const installJava = (progress: ProgressCallback): Promise<undefined> => {
    return downloadJdk(progress)
        .then((zipFilename: string) => extractJdkIntoPath(zipFilename))
        .then((jdkHomePath: string) => {
            return setEnvironmentVariable("JAVA_HOME", jdkHomePath).then(() =>
                addToPathEnvironmentVariable(path.resolve(jdkHomePath, "bin"))
            );
        });
};

const downloadJdk = (progress: ProgressCallback): Promise<string> => {
    return downloadFile(getPlatform().javaDownloadUrl, progress);
};

const extractJdkIntoPath = (zipFilename: string): Promise<string> => {
    const jdkTempPath = path.resolve(getTempPath(), "jdk8");
    const jvmTargetPath = getPlatform().jvmTargetPath;

    return removeDirRecursive(jdkTempPath)
        .then(() => makeDirRecursive(jdkTempPath))
        .then(() => unzipFile(zipFilename, jdkTempPath))
        .then((unzippedFiles: string[]) => {
            return runSudoCommand(getPlatform().getCommandSudoMoveDirToDir(unzippedFiles[0], jvmTargetPath)).then(() =>
                path.resolve(
                    jvmTargetPath,
                    path.basename(unzippedFiles[0]),
                    getPlatform().javaHomeRelativeDirAfterUnzip
                )
            );
        });
};
