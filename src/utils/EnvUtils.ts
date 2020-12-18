import { appendFile } from "./FileUtils";
import * as path from "path";
import { EOL } from "os";
import { isMac, isWin } from "./Platform";
import { runCommand } from "./ProcessUtils";

export const setEnvironmentVariable = (name: string, value: string): Promise<undefined> => {
    process.env[name] = value;

    if (isMac()) {
        const profileFile = path.resolve(process.env.HOME, ".zprofile");
        const data = getSetEnvVarCommand(name, value) + EOL;
        return appendFile(profileFile, data);
    } else if (isWin()) {
        return runCommand(`cmd /c "setx ${name} "${value}""`);
    }
};

export const addToPathEnvironmentVariable = (dir: string): Promise<undefined> => {
    process.env.PATH = `${process.env.PATH}:${dir}`;

    if (isMac()) {
        const profileFile = path.resolve(process.env.HOME, ".zprofile");
        const data = `export PATH=$PATH:${dir}${EOL}`;
        return appendFile(profileFile, data);
    } else if (isWin()) {
        return runCommand(`cmd /c "setx PATH "%PATH%;${dir}""`);
    }
};

export const getSetEnvVarCommand = (key: string, value: string): string => {
    if (isMac()) {
        return `export ${key}="${value}"`;
    } else if (isWin()) {
        return `set ${key}="${value}"`;
    } else {
        return "";
    }
};
