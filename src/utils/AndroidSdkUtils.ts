import ConfigFileParser from "./ConfigFileParser";
import { map, mergeMap, toArray } from "rxjs/operators";
import {
    AVD_CONFIG_KEY_AVD_ID,
    AVD_CONFIG_KEY_AVD_NAME,
    AVD_CONFIG_KEY_DISPLAY_NAME,
    AVD_CONFIG_KEY_GPU_ENABLED,
    AVD_CONFIG_KEY_GPU_MODE,
    AVD_CONFIG_KEY_HEAP_SIZE,
    AVD_CONFIG_KEY_ID,
    AVD_CONFIG_KEY_KEYBOARD,
    AVD_CONFIG_KEY_MAIN_KEYS,
    AVD_CONFIG_KEY_PLAYSTORE,
    AVD_CONFIG_KEY_RAM_SIZE,
    AVD_CONFIG_KEY_RESOLUTION_DENSITY,
    AVD_CONFIG_KEY_RESOLUTION_HEIGHT,
    AVD_CONFIG_KEY_RESOLUTION_WIDTH,
    AVD_CONFIG_KEY_SKIN_NAME,
    AVD_CONFIG_KEY_SYSTEM_IMAGE,
} from "./AvdConfigConstants";
import CreateAvdSpec from "./CreateAvdSpec";
import { runCommand } from "./ProcessUtils";
import { fileExists, getDirList, getFileContent, makeDirRecursive, writeFileContent } from "./FileUtils";
import { globalLog } from "./Logger";
import { getPlatform } from "./Platform";
import * as path from "path";
import { getSetEnvVarCommand } from "./EnvUtils";

const androidSdkDir = (): string => getPlatform().sdkRootDir;
const avdDir = (): string => getPlatform().avdRootDir;
const avdManagerExecutable = (): string => getPlatform().avdManager;
const sdkManagerExecutable = (): string => getPlatform().sdkManager;
const emulatorExecutable = (): string => getPlatform().emulator;

export const androidSdkExists = (): Promise<boolean> => {
    return Promise.all([
        fileExists(avdManagerExecutable()),
        fileExists(sdkManagerExecutable()),
        fileExists(emulatorExecutable()),
    ]).then(() => true);
};

export const getAvds = async (): Promise<AvdConfig[]> => {
    const avdDirRoot = avdDir();

    const observable = getDirList(avdDirRoot).pipe(
        map((dir) => [dir, path.resolve(avdDirRoot, dir, "config.ini")]),
        mergeMap(([dir, configFilename]) => getFileContent(configFilename).pipe(map((content) => [dir, content]))),
        map(([dir, configContent]) => extractAvdConfigFromContent(dir, configContent)),
        toArray(),
        map((avds) => avds.sort((avd1, avd2) => avd1.name.localeCompare(avd2.name)))
    );

    return observable.toPromise();
};

export interface AvdConfig {
    id: string;
    name: string;
    resolution: string;
    target: string;
    api: string;
}

const extractAvdConfigFromContent = (dir: string, configContent: string): AvdConfig => {
    globalLog(`Found avd in dir ${dir}`);
    const config = new ConfigFileParser(configContent);

    const readApi = (): string => {
        const systemImage = config.getValueOrDefault(AVD_CONFIG_KEY_SYSTEM_IMAGE, "");
        const startIndex = systemImage.indexOf("android-") + 8;
        return systemImage.substring(startIndex, systemImage.indexOf("/", startIndex));
    };

    let id = config.getValueOrDefault(AVD_CONFIG_KEY_ID, "NO_ID");
    if (dir.indexOf(".avd") >= 0) {
        id = dir.substring(0, dir.indexOf(".avd"));
    }

    return {
        id: id,
        name: config.getValueOrDefault(AVD_CONFIG_KEY_DISPLAY_NAME, id),
        resolution: `${config.getValueOrDefault(AVD_CONFIG_KEY_RESOLUTION_WIDTH, "")} x ${config.getValueOrDefault(
            AVD_CONFIG_KEY_RESOLUTION_HEIGHT,
            ""
        )} (${config.getValueOrDefault(AVD_CONFIG_KEY_RESOLUTION_DENSITY, "")} dpi)`,
        target: API_TARGETS[readApi()],
        api: readApi(),
    };
};

interface StringDictionary {
    [key: string]: string;
}

const API_TARGETS: StringDictionary = {
    "30": "Android 11",
    "29": "Android 10",
    "28": "Android 9",
    "27": "Android 8.1",
    "26": "Android 8.0",
    "25": "Android 7.1",
    "24": "Android 7.0",
    "23": "Android 6.0",
    "22": "Android 5.1",
    "21": "Android 5.0",
    "19": "Android 4.4.x",
    "18": "Android 4.3.x",
    "17": "Android 4.2.x",
    "16": "Android 4.1.x",
    "15": "Android 4.0.3",
    "14": "Android 4.0.1",
};

export const runAvd = (avd: AvdConfig): void => {
    const setPathCommand = getSetEnvVarCommand("ANDROID_SDK_ROOT", androidSdkDir());
    const runAvdParams = "-no-snapshot-load";
    const runAvdCommand = `${emulatorExecutable()} @${avd.id} ${runAvdParams}`;
    const commandToRun = `${setPathCommand} && ${runAvdCommand}`;
    runCommand(commandToRun);
};

export const wipeDataAndRunAvd = (avd: AvdConfig): void => {
    const params = "-wipe-data";
    const commandToRun = `${emulatorExecutable()} @${avd.id} ${params}`;
    runCommand(commandToRun);
};

export const deleteAvd = async (avd: AvdConfig): Promise<boolean> => {
    const commandToRun = `${avdManagerExecutable()} delete avd -n "${avd.id}"`;
    return runCommand(commandToRun).then(
        () => true,
        () => false
    );
};

export const createAvd = async (spec: CreateAvdSpec, log?: (text: string) => void): Promise<undefined> => {
    const sanitizedName = spec.name.replace(/ /g, "_").replace(/-/g, "_");
    const createAvdCommand = `echo no | ${avdManagerExecutable()} create avd --name "${sanitizedName}" --abi "google_apis_playstore/x86" --package "${
        spec.androidVersion.systemImage
    }"`;
    return installPackage(spec.androidVersion.systemImage, log)
        .then(() => runCommand(createAvdCommand, log))
        .then(() => {
            if (log) {
                log("\nApplying configurations...\n");
            }
            globalLog("\nApplying configurations...\n");
            return changeAvdConfigs(sanitizedName, spec);
        });
};

const changeAvdConfigs = async (avdName: string, spec: CreateAvdSpec): Promise<undefined> => {
    const configFilename = `${avdDir()}/${avdName}.avd/config.ini`;

    return getFileContent(configFilename)
        .pipe(
            map((configFileContent) => new ConfigFileParser(configFileContent)),
            map((config) => {
                config.setValue(AVD_CONFIG_KEY_ID, avdName);
                config.setValue(AVD_CONFIG_KEY_PLAYSTORE, "true");
                config.setValue(AVD_CONFIG_KEY_AVD_ID, avdName);
                config.setValue(AVD_CONFIG_KEY_AVD_NAME, avdName);
                config.setValue(AVD_CONFIG_KEY_DISPLAY_NAME, spec.name);
                config.setValue(AVD_CONFIG_KEY_RESOLUTION_WIDTH, spec.device.resolutionWidth.toString());
                config.setValue(AVD_CONFIG_KEY_RESOLUTION_HEIGHT, spec.device.resolutionHeight.toString());
                config.setValue(
                    AVD_CONFIG_KEY_SKIN_NAME,
                    `${spec.device.resolutionWidth.toString()}x${spec.device.resolutionHeight.toString()}`
                );
                config.setValue(AVD_CONFIG_KEY_RESOLUTION_DENSITY, spec.device.density.toString());
                config.setValue(AVD_CONFIG_KEY_KEYBOARD, "yes");
                config.setValue(AVD_CONFIG_KEY_MAIN_KEYS, "no");
                config.setValue(AVD_CONFIG_KEY_RAM_SIZE, "1024M");
                config.setValue(AVD_CONFIG_KEY_HEAP_SIZE, "256M");
                config.setValue(AVD_CONFIG_KEY_GPU_ENABLED, "yes");
                config.setValue(AVD_CONFIG_KEY_GPU_MODE, "auto");
                return config.toString();
            }),
            mergeMap((newConfigContent: string) => writeFileContent(configFilename, newConfigContent))
        )
        .toPromise()
        .then(() => undefined);
};

export const installPackage = (packageName: string, log?: (text: string) => void): Promise<undefined> => {
    const installPackageCommand = `echo y | ${sdkManagerExecutable()} --install "${packageName}"`;
    return runCommand(installPackageCommand, log);
};

export const installEmulator = (log?: (text: string) => void): Promise<undefined> => {
    return installPackage("platform-tools", log)
        .then(() => installPackage("emulator", log))
        .then(() => installPackage("extras;intel;Hardware_Accelerated_Execution_Manager", log))
        .then(() => makeDirRecursive(path.resolve(androidSdkDir(), "platforms")))
        .then(() => undefined);
};
