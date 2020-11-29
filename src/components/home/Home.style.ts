import styled from "styled-components";

export const App = styled.div`
  height: 100%;
  text-align: center;
`;

export const ParentAppContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #2a2a2a;
`;

export const AppHeader = styled.div`
  grid-area: 1 / 1 / 2 / 7;
  background-image: linear-gradient(#e5e5e5, #cdcdcd);
  border-style: none none solid none;
  border-width: 1px;
  border-color: transparent transparent #b2b2b2 transparent;

  display: grid;
  grid-template-columns: repeat(30, 1fr);
  grid-template-rows: 10px 40px 10px;
`;

export const LeftBar = styled.div`
  grid-area: 2 / 1 / 6 / 2;
  background-color: #f2f2f2;
  border-right: 1px solid #d0d0d0;
`;

export const LeftPanelContainer = styled.div`
  grid-area: 2 / 2 / 6 / 3;
  display: flex;
  flex-flow: column nowrap;
  background-color: #fafafa;
  border-style: none solid none none;
  border-width: 1px;
  border-color: transparent #d0d0d0 transparent transparent;
`;

export const CanvasPanel = styled.div`
  grid-area: 2 / 3 / 6 / 6;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 10px;
  background-color: #f9f9f9;
`;

export const CanvasScreen = styled.div`
  position: relative;
  width: 338px;
  height: 600px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  border-width: 1px;
  border-style: solid;
  border-color: #ddd;
  box-shadow: 0px 0px 4px 2px #ccc;
`;

export const RightPanelContainer = styled.div`
  grid-area: 2 / 6 / 6 / 7;
  background-color: #f2f2f2;
  border-style: none none none solid;
  border-width: 1px;
  border-color: transparent transparent transparent #d0d0d0;
`;

export const PropertiesContainer = styled.div`
  margin: 10px;
`;
