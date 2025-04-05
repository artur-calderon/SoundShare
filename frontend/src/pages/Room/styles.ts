import { Layout } from 'antd'
import styled from "styled-components";
import { defaultThemeColors } from "../../styles/themes/default.ts";

const { Sider, Content } = Layout

export const RoomContainer = styled(Layout)`
    background-color: ${defaultThemeColors.colors['--clr-surface-a0']};
    overflow: hidden;
    height: 100vh;

    @media (max-width: 768px) {
        flex-direction: column;
	    height:100%;
    }
`;

export const RoomInnerWrapper = styled.div`
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

export const SiderContainer = styled(Sider)`
    width: 180px !important;

    @media (max-width: 1024px) {
        width: 80px !important;
        .flex {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }

    @media (max-width: 768px) {
        width: 100% !important;
        bottom: auto;
        left: auto;
        right: auto;
        background: ${defaultThemeColors.colors['--clr-surface-a0']};
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
`;

export const RoomContent = styled(Content)`
    overflow-y: auto;

    @media (max-width: 768px) {
        padding-bottom: 60px;
    }
`;




// import {Layout} from 'antd'
// import styled from "styled-components";
// import {defaultThemeColors} from "../../styles/themes/default.ts";
//
// const {Sider, Content} = Layout
//
// export const RoomContainer = styled(Layout)`
// 	//height: 100vh;
// 	background-color: ${defaultThemeColors.colors["--clr-surface-a0"]};
// 	overflow:hidden;
// `
//
// export const SiderContainer = styled(Sider)`
// 	//width: 280rem !important;
// `
//
// export const RoomContent = styled(Content)`
// 	overflow-y: auto;
// `