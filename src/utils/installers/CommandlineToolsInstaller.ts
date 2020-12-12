import { globalLog } from "../Logger";
import { makeDirRecursive, makeFilesExecutable, renamePath, unzipFile } from "../FileUtils";
import { downloadFile, ProgressCallback } from "../DownloadUtils";
import { getPlatform } from "../Platform";
import * as path from "path";

export const installCommandLineTools = async (progressCallback: (percent: number) => void): Promise<undefined> => {
    return downloadCommandLineTools(progressCallback)
        .then((zipFilename) => extractCommandLineTools(zipFilename))
        .then(() => makeCommandLineToolsExecutable());
};

const downloadCommandLineTools = (progressCallback: ProgressCallback): Promise<string> => {
    return downloadFile(getPlatform().cmdlineToolsDownloadUrl, progressCallback);
};

const extractCommandLineTools = async (zipFilename: string): Promise<undefined> => {
    globalLog("Extracting command line tools");
    const toolsParentDir = path.dirname(getPlatform().sdkToolsDir);
    return makeDirRecursive(toolsParentDir)
        .then(() => unzipFile(zipFilename, toolsParentDir))
        .then((unzippedFiles: string[]) =>
            renamePath(path.resolve(toolsParentDir, unzippedFiles[0]), getPlatform().sdkToolsDir)
        )
        .then(() => undefined);
};

const makeCommandLineToolsExecutable = (): Promise<undefined> => {
    return makeFilesExecutable(`${path.resolve(getPlatform().sdkToolsDir, "bin")}/*`).then(() => undefined);
};
