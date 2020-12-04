import electron, { app } from "electron";
import * as path from "path";
import isDev from "electron-is-dev";

export const getAssetPath = (name: string): string => {
  if (isDev) {
    return path.resolve(
      (app || electron.remote.app).getAppPath(),
      "src",
      "assets",
      name
    );
  } else {
    return path.resolve(__dirname, "..", "assets", name);
  }
};
