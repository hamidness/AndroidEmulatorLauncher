import React, { useState } from "react";
import {
  ANDROID_DEVICE_TEMPLATES,
  AndroidDevice,
} from "../../../utils/AndroidDevice";
import "./SelectDevice.css";

interface SelectDeviceProps {
  onDeviceSelected: (selectedDevice: AndroidDevice) => void;
}

export default (props: SelectDeviceProps) => {
  const [selectedDevice, setSelectedDevice] = useState<AndroidDevice>();

  const handleNextClick = () => {
    if (selectedDevice) {
      props.onDeviceSelected(selectedDevice);
    }
  };

  const handleRowClick = (deviceTemplate: AndroidDevice) => {
    setSelectedDevice(deviceTemplate);
  };

  const renderDeviceItem = (deviceTemplate: AndroidDevice) => {
    const className =
      deviceTemplate === selectedDevice
        ? "select-device-cell-selected"
        : "select-device-cell";
    return (
      <tr onClick={() => handleRowClick(deviceTemplate)}>
        <td className={className}>{deviceTemplate.name}</td>
        <td className={className}>{deviceTemplate.size}"</td>
        <td className={className}>
          {deviceTemplate.resolutionWidth} x {deviceTemplate.resolutionHeight}
        </td>
      </tr>
    );
  };

  return (
    <div className="select-device-root">
      <div className="select-device-bottom-bar">
        <div
          className={
            "select-device-button" + (selectedDevice ? " active" : " inactive")
          }
          onClick={handleNextClick}
        >
          <p>Next</p>
        </div>
      </div>

      <div className="select-device-table-body-container">
        <table className="select-device-table">
          <tbody>
            {ANDROID_DEVICE_TEMPLATES.map((elem) => renderDeviceItem(elem))}
          </tbody>
        </table>
      </div>

      <div>
        <table className="select-device-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Resolution</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};
