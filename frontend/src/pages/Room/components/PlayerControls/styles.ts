import styled from "styled-components";
import {Layout } from "antd";

import {defaultThemeColors} from "../../../../styles/themes/default";

const{Footer} = Layout

export const PlayerControlsContainer = styled(Footer)`
    text-align: center;
    display:flex;
	background-color: ${defaultThemeColors.colors["--clr-surface-a0"]};
    width:100%;
	height: 10%;
    flex-direction: column;
    justify-content: space-around;
    position: relative;
    z-index: 2;
    overflow:hidden;
`