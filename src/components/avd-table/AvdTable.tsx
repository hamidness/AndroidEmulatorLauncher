import React from "react";
import {
  AvdTableActionButton,
  AvdTableActionsContainer,
  AvdTableBody,
  AvdTableCell,
  AvdTableHeader,
  AvdTableHeaderCell,
  AvdTableHeaderRow,
  AvdTableRoot,
  AvdTableRow,
} from "./AvdTable.style";
import { AvdConfig } from "../../utils/AndroidSdkUtils";
import { mdiBroom, mdiDelete, mdiPlay } from "@mdi/js";
import Icon from "@mdi/react";

interface AvdTableProps {
  avds: AvdConfig[];
  onRun: (avd: AvdConfig) => void;
  onWipeAndRun: (avd: AvdConfig) => void;
  onDeleteAvd: (avd: AvdConfig) => void;
}

export default (props: AvdTableProps) => {
  const renderAvdRow = (avd: AvdConfig) => {
    return (
      <AvdTableRow key={avd.name}>
        <AvdTableCell>{avd.name}</AvdTableCell>
        <AvdTableCell>{avd.resolution}</AvdTableCell>
        <AvdTableCell>{avd.api}</AvdTableCell>
        <AvdTableCell>{avd.target}</AvdTableCell>
        <AvdTableCell>
          <AvdTableActionsContainer>
            <AvdTableActionButton onClick={() => props.onRun(avd)}>
              <Icon path={mdiPlay} color="#0A0" />
            </AvdTableActionButton>
            <AvdTableActionButton onClick={() => props.onWipeAndRun(avd)}>
              <Icon path={mdiBroom} color="#AAA" />
            </AvdTableActionButton>
            <AvdTableActionButton onClick={() => props.onDeleteAvd(avd)}>
              <Icon path={mdiDelete} color="#AAA" />
            </AvdTableActionButton>
          </AvdTableActionsContainer>
        </AvdTableCell>
      </AvdTableRow>
    );
  };

  return (
    <AvdTableRoot>
      <AvdTableHeader>
        <AvdTableHeaderRow>
          <AvdTableHeaderCell>Name</AvdTableHeaderCell>
          <AvdTableHeaderCell style={{ width: "200px" }}>
            Resolution
          </AvdTableHeaderCell>
          <AvdTableHeaderCell style={{ width: "40px" }}>API</AvdTableHeaderCell>
          <AvdTableHeaderCell style={{ width: "150px" }}>
            Target
          </AvdTableHeaderCell>
          <AvdTableHeaderCell style={{ width: "130px" }}>
            Actions
          </AvdTableHeaderCell>
        </AvdTableHeaderRow>
      </AvdTableHeader>

      <AvdTableBody>
        {props.avds.map((elem) => renderAvdRow(elem))}
      </AvdTableBody>
    </AvdTableRoot>
  );
};
