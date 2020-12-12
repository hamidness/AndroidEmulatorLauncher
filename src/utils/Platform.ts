import electron from "electron";
import * as path from "path";

export const isMac = (): boolean => process.platform === "darwin";
export const isWin = (): boolean => process.platform === "win32";

export enum PlatformType {
    MAC_OS,
    WINDOWS,
    UNSUPPORTED,
}

export interface Platform {
    type: PlatformType;
    cmdlineToolsDownloadUrl: string;
    javaDownloadUrl: string;
    sdkRootDir: string;
    avdRootDir: string;
    sdkToolsDir: string;
    avdManager: string;
    sdkManager: string;
    emulator: string;
    jvmTargetPath: string;
    javaHomeRelativeDirAfterUnzip: string;
    getCommandMakeFileExecutable: ((files: string) => string) | undefined;
    getCommandSudoMoveDirToDir: (sourceDir: string, targetDir: string) => string;
}

export const getPlatform = (): Platform => {
    if (isMac()) {
        return MAC_PLATFORM;
    } else if (isWin()) {
        return WIN_PLATFORM;
    } else {
        return UNSUPPORTED_PLATFORM;
    }
};

const HOME_PATH = (electron.app || electron.remote.app).getPath("home");

const MAC_SDK_ROOT = path.resolve(HOME_PATH, "Library", "Android", "sdk");
const MAC_PLATFORM: Platform = {
    type: PlatformType.MAC_OS,
    cmdlineToolsDownloadUrl: "https://dl.google.com/android/repository/commandlinetools-mac-6858069_latest.zip",
    javaDownloadUrl:
        "https://github.com/AdoptOpenJDK/openjdk8-binaries/releases/download/jdk8u275-b01/OpenJDK8U-jdk_x64_mac_hotspot_8u275b01.tar.gz",
    sdkRootDir: MAC_SDK_ROOT,
    avdRootDir: path.resolve(HOME_PATH, ".android", "avd"),
    sdkToolsDir: path.resolve(MAC_SDK_ROOT, "cmdline-tools", "tools"),
    avdManager: path.resolve(MAC_SDK_ROOT, "cmdline-tools", "tools", "bin", "avdmanager"),
    sdkManager: path.resolve(MAC_SDK_ROOT, "cmdline-tools", "tools", "bin", "sdkmanager"),
    emulator: path.resolve(MAC_SDK_ROOT, "emulator", "emulator"),
    jvmTargetPath: "/Library/Java/JavaVirtualMachines",
    javaHomeRelativeDirAfterUnzip: "Contents/Home",

    getCommandMakeFileExecutable: (files: string) => `chmod +x ${files}`,
    getCommandSudoMoveDirToDir: (sourceDir: string, targetDir: string) =>
        `bash -c "mkdir ${targetDir}; mv ${sourceDir} ${targetDir}/"`,
};

const WIN_SDK_ROOT = path.resolve(HOME_PATH, "AppData", "Local", "Android", "sdk");
const WIN_PLATFORM: Platform = {
    type: PlatformType.WINDOWS,
    cmdlineToolsDownloadUrl: "https://dl.google.com/android/repository/commandlinetools-win-6858069_latest.zip",
    javaDownloadUrl:
        "https://github.com/AdoptOpenJDK/openjdk8-binaries/releases/download/jdk8u275-b01/OpenJDK8U-jdk_x64_windows_hotspot_8u275b01.zip",
    sdkRootDir: WIN_SDK_ROOT,
    avdRootDir: path.resolve(HOME_PATH, ".android", "avd"),
    sdkToolsDir: path.resolve(WIN_SDK_ROOT, "tools"),
    avdManager: path.resolve(WIN_SDK_ROOT, "tools", "bin", "avdmanager.bat"),
    sdkManager: path.resolve(WIN_SDK_ROOT, "tools", "bin", "sdkmanager.bat"),
    emulator: path.resolve(WIN_SDK_ROOT, "emulator", "emulator.exe"),
    jvmTargetPath: "C:\\Program Files\\Java",
    javaHomeRelativeDirAfterUnzip: "\\",

    getCommandMakeFileExecutable: undefined,
    getCommandSudoMoveDirToDir: (sourceDir: string, targetDir: string) =>
        `cmd /c "mkdir ${targetDir} & move ${sourceDir} ${targetDir}"`,
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const UNSUPPORTED_PLATFORM: Platform = {
    type: PlatformType.UNSUPPORTED,
};
