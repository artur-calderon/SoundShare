import {Layout} from 'antd'
import styled from "styled-components";
import {defaultThemeColors} from "../../styles/themes/default.ts";

const {Sider, Content} = Layout

export const RoomContainer = styled(Layout)`
	//height: 100vh;
	background-color: ${defaultThemeColors.colors["--clr-surface-a0"]};
	overflow:hidden;
`

export const SiderContainer = styled(Sider)`
	//width: 280rem !important;
`

export const RoomContent = styled(Content)`
	overflow-y: auto;
`