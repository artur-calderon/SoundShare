import styled from "styled-components";
import {darkRoomTheme} from "../../styles/themes/roomTheme";
// import { lightTheme } from "../../themes/lightTheme.js";

export const SpaceContainer = styled.div`
  width: 100%;
  padding: 10px;
  height: 100%;
	overflow-y:  scroll;
    scrollbar-color: ${darkRoomTheme.token.colorPrimary} ${darkRoomTheme.token.colorBorder};
    scrollbar-width: thin;
  div.list {
	  width: 100%;
	  height: 10rem;
	  padding: 3rem 0 3rem 0;
      
  }
`;
