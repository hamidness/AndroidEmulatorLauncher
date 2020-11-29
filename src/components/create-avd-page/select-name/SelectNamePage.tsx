import React, { useEffect, useState } from "react";
import "./SelectNamePage.css";

interface SelectNameProps {
  initialName: string;
  onNameChanged: (name: string) => void;
}

export default (props: SelectNameProps) => {
  const [name, setName] = useState(props.initialName);

  useEffect(() => {
    setName(props.initialName);
  }, [props.initialName]);

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleNextClick = () => {
    props.onNameChanged(name);
  };

  return (
    <div className="select-case-root">
      <div className="select-case-bottom-bar">
        <div
          className={
            "select-case-button" + (name.length > 0 ? " active" : " inactive")
          }
          onClick={handleNextClick}
        >
          <p>Next</p>
        </div>
      </div>

      <div className="select-case-table-body-container">
        <div>
          <p>Name:</p>
          <input type="text" value={name} onChange={handleNameChange} />
        </div>
      </div>
    </div>
  );
};
