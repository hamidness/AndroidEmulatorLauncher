import React, { useEffect, useState } from "react";
import { CreateAvdPageRoot } from "./CreateAvdPage.style";
import SelectDevicePage from "./select-device/SelectDevicePage";
import { AndroidDevice } from "../../utils/AndroidDevice";
import { AndroidVersion } from "../../utils/AndroidVersion";
import SelectAndroidVersionPage from "./select-android-version/SelectAndroidVersionPage";
import SelectNamePage from "./select-name/SelectNamePage";
import CreateProgressPage from "../create-progress/CreateProgressPage";
import CreateAvdSpec from "../../utils/CreateAvdSpec";
import { createAvd } from "../../utils/AndroidSdkUtils";

const { ipcRenderer } = window.require("electron");

export default () => {
  const [selectedDevice, setSelectedDevice] = useState<AndroidDevice>();
  const [
    selectedAndroidVersion,
    setSelectedAndroidVersion,
  ] = useState<AndroidVersion>();
  const [name, setName] = useState("");
  const [logs, setLogs] = useState("");

  useEffect(() => {
    if (selectedDevice && selectedAndroidVersion && name.length > 0) {
      startCreatingAvd();
    }
  }, [selectedDevice, selectedAndroidVersion, name]);

  const startCreatingAvd = () => {
    if (!selectedDevice || !selectedAndroidVersion || name.length === 0) {
      return;
    }

    const createAvdSpec: CreateAvdSpec = {
      device: selectedDevice,
      androidVersion: selectedAndroidVersion,
      name: name,
    };

    createAvd(createAvdSpec, (text: string) =>
      setLogs((prevLogs) => `${prevLogs}${text}`)
    )
      .then(() => {
        setLogs((prevLogs) => `${prevLogs}\nSuccessfully created!`);
        ipcRenderer.send("close-create-avd-window");
      })
      .catch((reason) =>
        setLogs((prevLogs) => `${prevLogs}\nCannot create because:\n${reason}`)
      );
  };

  const handleSelectDevice = (device: AndroidDevice) => {
    setSelectedDevice(device);
  };

  const handleSelectAndroidVersion = (androidVersion: AndroidVersion) => {
    setSelectedAndroidVersion(androidVersion);
  };

  const handleSelectName = (name: string) => {
    setName(name);
  };

  const step = !selectedDevice
    ? 0
    : !selectedAndroidVersion
    ? 1
    : name.length === 0
    ? 2
    : 3;

  return (
    <CreateAvdPageRoot>
      {step === 0 && <SelectDevicePage onDeviceSelected={handleSelectDevice} />}
      {step === 1 && (
        <SelectAndroidVersionPage
          onAndroidVersionSelected={handleSelectAndroidVersion}
        />
      )}
      {step === 2 && (
        <SelectNamePage
          initialName={
            selectedDevice!.name +
            " Android " +
            selectedAndroidVersion!.versionNumber
          }
          onNameChanged={handleSelectName}
        />
      )}
      {step === 3 && <CreateProgressPage logs={logs} />}
    </CreateAvdPageRoot>
  );
};
