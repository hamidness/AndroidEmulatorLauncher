import React, { useState } from "react";
import "./SelectAndroidVersionPage.css";
import {
  ANDROID_VERSIONS,
  AndroidVersion,
} from "../../../utils/AndroidVersion";

interface SelectAndroidVersionProps {
  onAndroidVersionSelected: (selectedAndroidVersion: AndroidVersion) => void;
}

export default (props: SelectAndroidVersionProps) => {
  const [
    selectedAndroidVersion,
    setSelectedAndroidVersion,
  ] = useState<AndroidVersion>();

  const handleNextClick = () => {
    if (selectedAndroidVersion) {
      props.onAndroidVersionSelected(selectedAndroidVersion);
    }
  };

  const handleRowClick = (androidVersion: AndroidVersion) => {
    setSelectedAndroidVersion(androidVersion);
  };

  const renderAndroidVersionItem = (androidVersion: AndroidVersion) => {
    const className =
      androidVersion === selectedAndroidVersion
        ? "select-android-cell-selected"
        : "select-android-cell";
    return (
      <tr onClick={() => handleRowClick(androidVersion)}>
        <td className={className}>{androidVersion.name}</td>
        <td className={className}>{androidVersion.versionNumber}</td>
        <td className={className}>{androidVersion.api}</td>
      </tr>
    );
  };

  return (
    <div className="select-android-root">
      <div className="select-android-bottom-bar">
        <div
          className={
            "select-android-button" +
            (selectedAndroidVersion ? " active" : " inactive")
          }
          onClick={handleNextClick}
        >
          <p>Next</p>
        </div>
      </div>

      <div className="select-android-table-body-container">
        <table className="select-android-table">
          <tbody>
            {ANDROID_VERSIONS.map((elem) => renderAndroidVersionItem(elem))}
          </tbody>
        </table>
      </div>

      <div>
        <table className="select-android-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Version</th>
              <th>API</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};
