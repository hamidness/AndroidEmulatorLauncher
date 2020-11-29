import React, { createRef, useEffect } from "react";
import "./CreateProgressPage.css";

interface CreateProgressProps {
  logs: string;
}

export default (props: CreateProgressProps) => {
  const bottomElement = createRef<HTMLDivElement>();

  useEffect(() => {
    if (bottomElement.current) {
      bottomElement.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [props.logs]);

  return (
    <div className="create-progress-root">
      <div>Please wait...</div>
      <p className="create-progress-logs">
        {props.logs}
        <div ref={bottomElement} />
      </p>
    </div>
  );
};
