import styled from "styled-components";

export const ManagePageRoot = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  height: 100%;
`;

export const ManagePageToolbar = styled.div`
  height: 80px;
  background-color: #444;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
`;

export const ManagePageLogoContainer = styled.div`
  width: 40px;
  height: 40px;
  margin-left: 20px;
  flex-grow: 0;
`;

export const ManagePageToolbarTitle = styled.div`
  margin-left: 10px;
  color: #ccc;
  font-size: 20px;
  flex-grow: 0;
`;

export const ManagePageToolbarSpace = styled.div`
  flex-grow: 1;
`;

export const ManagePageToolbarButton = styled.div`
  flex-grow: 0;
  background-color: #444;
  width: 80px;
  height: 100%;
  padding: 20px;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
  &:active {
    background-color: #666;
  }
`;

export const ManagePageBody = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  padding: 10px;
  height: 100%;
  overflow: scroll;
`;
