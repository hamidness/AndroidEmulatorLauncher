import { appendFile } from "./FileUtils";
import * as path from "path";
import { EOL } from "os";

export const setEnvironmentVariable = (
  name: string,
  value: string
): Promise<undefined> => {
  process.env[name] = value;

  const profileFile = path.resolve(process.env.HOME, ".zprofile");
  const data = `export ${name}=${value}${EOL}`;
  return appendFile(profileFile, data);
};

export const addToPathEnvironmentVariable = (
  dir: string
): Promise<undefined> => {
  process.env.PATH = `${process.env.PATH}:${dir}`;

  const profileFile = path.resolve(process.env.HOME, ".zprofile");
  const data = `export PATH=$PATH:${dir}${EOL}`;
  return appendFile(profileFile, data);
};
