import { Layout } from 'antd'
import styled from "styled-components";
import { defaultThemeColors } from "../../styles/themes/default.ts";

const { Sider, Content } = Layout

export const RoomContainer = styled(Layout)`
    background-color: #f5f5f5;
    overflow: hidden;
    height: 100vh;
    min-height: 100vh;

    @media (max-width: 768px) {
        flex-direction: column;
        height: 100%;
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
    &.ant-layout-sider {
        background: ${props => props.theme === 'dark' ? '#000000' : '#ffffff'} !important;
        border-right: ${props => props.theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #f0f0f0'} !important;
    }

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
    background: #f5f5f5;
    padding: 24px;
    overflow-y: auto;
    min-height: calc(100vh - 80px);

    @media (max-width: 768px) {
        padding: 16px;
        padding-bottom: 60px;
    }
`;