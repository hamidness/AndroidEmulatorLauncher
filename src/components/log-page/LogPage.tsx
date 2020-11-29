import React, { createRef, useEffect, useState } from "react";
import "./LogPage.css";
import { listenGlobalLogs, clearLog } from "../../utils/Logger";
import Icon from "@mdi/react";
import { mdiContentCopy, mdiDelete } from "@mdi/js";
import { clipboard } from "electron";

export default () => {
  const [logs, setLogs] = useState("");
  const bottomElement = createRef<HTMLDivElement>();

  useEffect(() => {
    const subscription = listenGlobalLogs().subscribe((logs) => {
      setLogs(logs);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (bottomElement.current) {
      bottomElement.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const handleCopy = () => {
    clipboard.writeText(logs);
  };

  const handleDelete = () => {
    clearLog();
  };

  return (
    <div className="log-report-root">
      <div className="log-report-logs">
        {logs}
        <div ref={bottomElement} />
      </div>

      <div className="log-report-overlay">
        <div className="log-report-button" onClick={handleCopy}>
          <Icon path={mdiContentCopy} color="#999" />
        </div>
        <div className="log-report-button" onClick={handleDelete}>
          <Icon path={mdiDelete} color="#999" />
        </div>
      </div>
    </div>
  );
};
