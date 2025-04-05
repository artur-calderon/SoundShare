import styled from "styled-components";
import { Space, Typography } from "antd";

export const PlaylistContainer = styled(Space)`
	width: 100%;
	
	padding: 1rem;
	border-radius: 8px;
	
`;

export const TitlePlaylist = styled(Typography.Title)`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	color: ${({ theme }) => theme.colorPrimary || "#333"};
	font-size: 1.2rem;
	margin-bottom: 1rem;

	svg {
		width: 1.2em;
		height: 1.2em;
	}
`;

export const PlaylistItens = styled.div`
	width: 100%;
	display: flex;
    height: 80vh;
	flex:1;
	flex-direction: column;
	overflow-y: auto;
	padding-right: 8px;
	min-height: 0;

	.ant-list-item {
		border-bottom: 1px solid ${({ theme }) => theme.borderColor || "#d9d9d9"};
		padding: 1rem 0;
		transition: background-color 0.3s;
	}

	.ant-list-item-meta-title {
		font-weight: 600;
		color: ${({ theme }) => theme.primaryText || "#333"};
	}
	
	
}


`;



// import styled from "styled-components";
// import {Space, Typography} from "antd";
// import {darkRoomTheme} from "../../../../styles/themes/roomTheme.ts";
//
// const {Title} = Typography;
//
// export const PlaylistContainer = styled(Space)`
// 	padding-top: 3rem;
// 	align-items: center;
// 	justify-content: flex-start;
// 	width: 100%;
// 	//height: 70vh;
//
// `
//
// export const TitlePlaylist = styled(Title)`
// 	display: flex;
// 	align-items: center;
// 	gap: 1rem;
// `
//
// export const PlaylistItens = styled.div`
// 	overflow-y:auto;
// 	max-height: 50vh;
// 	scrollbar-color: ${darkRoomTheme.token.colorPrimary} ${darkRoomTheme.token.colorBorder};
// 	scrollbar-width: thin;
// `
