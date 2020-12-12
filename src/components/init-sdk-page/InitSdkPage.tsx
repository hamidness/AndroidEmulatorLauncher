import React, { useState } from "react";
import "./InitSdkPage.css";
import { androidSdkExists, installEmulator } from "../../utils/AndroidSdkUtils";
import CreateProgressPage from "../create-progress/CreateProgressPage";
import { ipcRenderer } from "electron";
import { globalLog } from "../../utils/Logger";
import { installJava, isJavaInstalled } from "../../utils/installers/JavaInstaller";
import DownloadProgressPage from "../download-progress-page/DownloadProgressPage";
import { installCommandLineTools } from "../../utils/installers/CommandlineToolsInstaller";

enum SdkInitState {
    STATE_DISPLAY_INIT_MESSAGE,
    STATE_DOWNLOAD_TOOLS,
    STATE_INSTALL_JAVA,
    STATE_INSTALL_EMULATOR,
    STATE_CONCLUSION_FAILED,
    STATE_CONCLUSION_SUCCEED,
}

export default () => {
    const [initState, setInitState] = useState(SdkInitState.STATE_DISPLAY_INIT_MESSAGE);
    const [cmdlineDownloadPercent, setCmdlineDownloadPercent] = useState(0);
    const [javaDownloadPercent, setJavaDownloadPercent] = useState(0);
    const [installEmulatorLogs, setInstallEmulatorLogs] = useState("");

    const handleDownloadCommandlineTools = () => {
        setInitState(SdkInitState.STATE_DOWNLOAD_TOOLS);
        installCommandLineTools((percent) => setCmdlineDownloadPercent(percent)).then(
            () => {
                isJavaInstalled().then(
                    () => {
                        setInitState(SdkInitState.STATE_INSTALL_EMULATOR);
                        handleInstallEmulator();
                    },
                    () => {
                        setInitState(SdkInitState.STATE_INSTALL_JAVA);
                        handleInstallJava();
                    }
                );
            },
            (reason: any) => {
                globalLog("Failed: " + reason);
                setInitState(SdkInitState.STATE_CONCLUSION_FAILED);
            }
        );
    };

    const handleInstallJava = () => {
        installJava((percent: number) => setJavaDownloadPercent(percent)).then(
            () => {
                setInitState(SdkInitState.STATE_INSTALL_EMULATOR);
                handleInstallEmulator();
            },
            () => setInitState(SdkInitState.STATE_CONCLUSION_FAILED)
        );
    };

    const handleInstallEmulator = () => {
        installEmulator((log) => setInstallEmulatorLogs((prevLogs) => prevLogs + log))
            .then(() => androidSdkExists())
            .then(
                () => setInitState(SdkInitState.STATE_CONCLUSION_SUCCEED),
                () => {
                    setInitState(SdkInitState.STATE_CONCLUSION_FAILED);
                }
            );
    };

    const renderDisplayMessage = () => {
        return (
            <div className="init-message-root">
                <div className="init-message-title">
                    Android SDK tools is not installed. Install the SDK tools to start using emulators.
                </div>
                <div className="init-message-button" onClick={handleDownloadCommandlineTools}>
                    Install
                </div>
            </div>
        );
    };

    const renderDownloadCmdlineTools = () => {
        return <DownloadProgressPage downloadPercent={cmdlineDownloadPercent} titleAfterComplete="Unzipping..." />;
    };

    const renderInstallJava = () => {
        return <DownloadProgressPage downloadPercent={javaDownloadPercent} titleAfterComplete="Installing..." />;
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
                <div className="init-message-title">Congratulations! Android SDK tools is installed now!</div>
                <div className="init-message-button" onClick={handleStart}>
                    Start
                </div>
            </div>
        );
    };

    const renderConclusionFailure = () => {
        return (
            <div className="init-message-root">
                <div className="init-message-title">Ooops! Cannot install Android SDK tools!</div>
                <div className="init-message-button" onClick={handleDownloadCommandlineTools}>
                    Retry
                </div>
            </div>
        );
    };

    const renderPage = () => {
        if (initState === SdkInitState.STATE_DISPLAY_INIT_MESSAGE) {
            return renderDisplayMessage();
        } else if (initState === SdkInitState.STATE_DOWNLOAD_TOOLS) {
            return renderDownloadCmdlineTools();
        } else if (initState === SdkInitState.STATE_INSTALL_JAVA) {
            return renderInstallJava();
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
