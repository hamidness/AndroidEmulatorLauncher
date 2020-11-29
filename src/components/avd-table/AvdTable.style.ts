import styled from "styled-components";

export const AvdTableRoot = styled.table`
  width: 100%;

  border: 1px solid #555;
  border-collapse: collapse;
  text-align: left;
`;

export const AvdTableHeader = styled.thead``;

export const AvdTableHeaderRow = styled.tr`
  background-color: #444;
`;

export const AvdTableHeaderCell = styled.th`
  border: 1px solid #555;
  border-collapse: collapse;
  color: #ccc;
  font-size: 12px;
  font-weight: lighter;
  padding: 5px;
  padding-left: 10px;
`;

export const AvdTableBody = styled.tbody``;

export const AvdTableRow = styled.tr``;

export const AvdTableCell = styled.td`
  border: 1px solid #555;
  border-collapse: collapse;
  color: #ccc;
  font-size: 12px;
  font-weight: lighter;
  padding: 15px;
`;

export const AvdTableActionsContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

export const AvdTableActionButton = styled.div`
  width: 20px;
  height: 20px;
  &:hover {
    background-color: #333;
  }
  &:active {
    background-color: #444;
  }
  margin-left: 10px;
  cursor: pointer;
`;
