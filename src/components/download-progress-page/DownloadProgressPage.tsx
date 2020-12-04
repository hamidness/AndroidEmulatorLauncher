import React from "react";
import "./DownloadProgressPage.css";

interface DownloadProgressPageProps {
  downloadPercent: number;
  titleAfterComplete: string | undefined;
}

export default (props: DownloadProgressPageProps) => {
  return (
    <div className="download-root">
      <div className="download-title">
        {props.titleAfterComplete && props.downloadPercent === 100
          ? props.titleAfterComplete
          : props.downloadPercent + "%"}
      </div>
      <div className="download-progress-container">
        <div
          className="download-progress"
          style={{ width: `${props.downloadPercent}%` }}
        />
      </div>
    </div>
  );
};
