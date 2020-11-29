import NewWindowSpec from "./NewWindowSpec";
import { ipcRenderer } from "electron";

export const newLogWindowSpec = (): NewWindowSpec => {
  return {
    id: "log-report",
    route: "log-report",
    width: 400,
    height: 800,
    backgroundColor: "#2A2A2A",
  };
};

export const newNewAvdWindow = () => {
  return {
    id: "new-avd",
    route: "new-avd",
    width: 800,
    height: 400,
    backgroundColor: "#2A2A2A",
  };
};

export const openLogWindow = () => {
  if (ipcRenderer) {
    ipcRenderer.send("start-new-window", newLogWindowSpec());
  }
};

export const openNewAvdWindow = () => {
  if (ipcRenderer) {
    ipcRenderer.send("start-new-window", newNewAvdWindow());
  }
};
