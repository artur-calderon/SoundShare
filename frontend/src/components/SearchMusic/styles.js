import styled from "styled-components";
import { Space } from "antd";
import { darkRoomTheme, primary, border } from "../../themes/darkRoomTheme.js";
import { lightTheme } from "../../themes/lightTheme.js";

const theme = true;
export const SpaceContainer = styled(Space)`
  width: 100%;
  display: ${(props) => (props.$changeplayertosearch ? "grid" : "none")};
  padding: 20px 20px 2rem 20px;
  background-color: ${theme
    ? darkRoomTheme.components.Space.bgcolor
    : lightTheme.components.Space.bgcolor};
  height: 100%;
  div.list {
    height: 80vh;
    overflow-y: scroll;
    padding: 3rem 0 3rem 0;
    scrollbar-width: thin;
    scrollbar-color: ${primary} ${border};
  }
`;
