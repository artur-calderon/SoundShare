import styled from "styled-components";
import {Space, Typography} from "antd";
import {darkRoomTheme} from "../../../../styles/themes/roomTheme.ts";

const {Title} = Typography;

export const PlaylistContainer = styled(Space)`
	padding-top: 3rem;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	//height: 70vh;

`

export const TitlePlaylist = styled(Title)`
	display: flex;
	align-items: center;
	gap: 1rem;
`

export const PlaylistItens = styled.div`
	overflow-y:auto;
	max-height: 50vh;
	scrollbar-color: ${darkRoomTheme.token.colorPrimary} ${darkRoomTheme.token.colorBorder};
	scrollbar-width: thin;
`
