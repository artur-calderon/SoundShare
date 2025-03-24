import styled from "styled-components";
import {darkRoomTheme} from "../../../../styles/themes/roomTheme.ts";

export const Container = styled.div`
	color: ${darkRoomTheme.token.colorPrimary};
	width: 100%;
	padding: 1rem;
		
	> h3 {
	   text-align: center;
	  }
	border-top: 1px solid;
	height: 20vh;
`;

export const InfoRoom = styled.div`
	  display: flex;
	  flex-direction: column;
	  justify-content: flex-start;
	  margin-top: 1rem;
	  gap: 1rem;

	  span {
	    display: flex;
	    align-items: center;
	    gap: 0.5rem;
	  }
`;
