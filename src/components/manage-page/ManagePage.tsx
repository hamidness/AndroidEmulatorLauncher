import React, { useEffect, useState } from "react";
import {
  ManagePageBody,
  ManagePageLogoContainer,
  ManagePageRoot,
  ManagePageToolbar,
  ManagePageToolbarButton,
  ManagePageToolbarSpace,
  ManagePageToolbarTitle,
} from "./ManagePage.style";
import AvdTable from "../avd-table/AvdTable";
import {
  AvdConfig,
  deleteAvd,
  getAvds,
  runAvd,
  wipeDataAndRunAvd,
} from "../../utils/AndroidSdkUtils";
import Icon from "@mdi/react";
import { mdiPlus, mdiRefresh } from "@mdi/js";
import { openLogWindow, openNewAvdWindow } from "../../utils/WindowUtils";

const { ipcRenderer } = window.require("electron");

export default () => {
  const [avds, setAvds] = useState<AvdConfig[]>([]);
  const [logoClickCount, setLogoClickCount] = useState(0);

  const refreshListener = () => {
    reloadAvds();
  };

  useEffect(() => {
    reloadAvds();

    ipcRenderer.on("refresh-avd-list", refreshListener);
    return () => {
      ipcRenderer.removeListener("refresh-avd-list", refreshListener);
    };
  }, []);

  const runEmulator = (avd: AvdConfig) => {
    runAvd(avd);
  };

  const wipeAndRunEmulator = (avd: AvdConfig) => {
    wipeDataAndRunAvd(avd);
  };

  const deleteEmulator = (avd: AvdConfig) => {
    deleteAvd(avd)
      .then(getAvds)
      .then((configs) => setAvds(configs));
  };

  const reloadAvds = () => {
    getAvds().then((configs) => setAvds(configs));
  };

  const addAvd = () => {
    openNewAvdWindow();
  };

  const handleLogoClick = () => {
    if (logoClickCount >= 4) {
      setLogoClickCount(0);
      openLogWindow();
    } else {
      setLogoClickCount((lastCount) => lastCount + 1);
    }
  };

  return (
    <ManagePageRoot>
      <ManagePageToolbar>
        <ManagePageLogoContainer>
          <div onClick={handleLogoClick}>
            <img src="../assets/images/android_robot.svg" alt="Android Logo" />
          </div>
        </ManagePageLogoContainer>
        <ManagePageToolbarTitle>
          Your Android Virtual Devices
        </ManagePageToolbarTitle>
        <ManagePageToolbarSpace />
        <ManagePageToolbarButton onClick={() => reloadAvds()}>
          <Icon path={mdiRefresh} color="#CCC" />
        </ManagePageToolbarButton>
        <ManagePageToolbarButton onClick={() => addAvd()}>
          <Icon path={mdiPlus} color="#86B817" />
        </ManagePageToolbarButton>
      </ManagePageToolbar>

      <ManagePageBody>
        <AvdTable
          avds={avds}
          onRun={(avd) => runEmulator(avd)}
          onWipeAndRun={(avd) => wipeAndRunEmulator(avd)}
          onDeleteAvd={(avd) => deleteEmulator(avd)}
        />
      </ManagePageBody>
    </ManagePageRoot>
  );
};
