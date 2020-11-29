import React, { useState } from "react";
import "./InitSdkPage.css";
import {
  androidSdkExists,
  installCommandLineTools,
  installEmulator,
} from "../../utils/AndroidSdkUtils";
import CreateProgressPage from "../create-progress/CreateProgressPage";
import { ipcRenderer } from "electron";
import { globalLog } from "../../utils/Logger";

enum SdkInitState {
  STATE_DISPLAY_INIT_MESSAGE,
  STATE_DOWNLOAD_TOOLS,
  STATE_INSTALL_EMULATOR,
  STATE_CONCLUSION_FAILED,
  STATE_CONCLUSION_SUCCEED,
}

export default () => {
  const [initState, setInitState] = useState(
    SdkInitState.STATE_DISPLAY_INIT_MESSAGE
  );
  const [downloadPercent, setDownloadPercent] = useState(0);
  const [installEmulatorLogs, setInstallEmulatorLogs] = useState("");

  const handleDownload = () => {
    setInitState(SdkInitState.STATE_DOWNLOAD_TOOLS);
    installCommandLineTools((percent) => setDownloadPercent(percent)).then(
      () => {
        setInitState(SdkInitState.STATE_INSTALL_EMULATOR);
        handleInstallEmulator();
      },
      (reason: any) => {
        globalLog("Failed: " + reason);
        setInitState(SdkInitState.STATE_CONCLUSION_FAILED);
      }
    );
  };

  const handleInstallEmulator = () => {
    installEmulator((log) =>
      setInstallEmulatorLogs((prevLogs) => prevLogs + log)
    )
      .then(() => androidSdkExists())
      .then(
        () => setInitState(SdkInitState.STATE_CONCLUSION_SUCCEED),
        (reason: any) => {
          setInitState(SdkInitState.STATE_CONCLUSION_FAILED);
        }
      );
  };

  const renderDisplayMessage = () => {
    return (
      <div className="init-message-root">
        <div className="init-message-title">
          Android SDK tools is not installed. Install the SDK tools to start
          using emulators.
        </div>
        <div className="init-message-button" onClick={handleDownload}>
          Install
        </div>
      </div>
    );
  };

  const renderDownloadTools = () => {
    return (
      <div className="init-download-root">
        <div className="init-download-title">
          {downloadPercent < 100 ? downloadPercent + "%" : "Unzipping..."}
        </div>
        <div className="init-download-progress-container">
          <div
            className="init-download-progress"
            style={{ width: `${downloadPercent}%` }}
          />
        </div>
      </div>
    );
  };

  const renderInstallEmulator = () => {
    return <CreateProgressPage logs={installEmulatorLogs} />;
  };

  const handleStart = () => {
    ipcRenderer.send("reload-page");
  };

  const renderConclusionSuccess = () => {
    return (
      <div className="init-message-root">
        <div className="init-message-title">
          Congratulations! Android SDK tools is installed now!
        </div>
        <div className="init-message-button" onClick={handleStart}>
          Start
        </div>
      </div>
    );
  };

  const renderConclusionFailure = () => {
    return (
      <div className="init-message-root">
        <div className="init-message-title">
          Ooops! Cannot install Android SDK tools!
        </div>
        <div className="init-message-button" onClick={handleDownload}>
          Retry
        </div>
      </div>
    );
  };

  const renderPage = () => {
    if (initState === SdkInitState.STATE_DISPLAY_INIT_MESSAGE) {
      return renderDisplayMessage();
    } else if (initState === SdkInitState.STATE_DOWNLOAD_TOOLS) {
      return renderDownloadTools();
    } else if (initState === SdkInitState.STATE_INSTALL_EMULATOR) {
      return renderInstallEmulator();
    } else if (initState === SdkInitState.STATE_CONCLUSION_SUCCEED) {
      return renderConclusionSuccess();
    } else {
      return renderConclusionFailure();
    }
  };

  return <div className="init-sdk-root">{renderPage()}</div>;
};
