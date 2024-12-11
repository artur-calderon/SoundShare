import styled from "styled-components";
import {Layout } from "antd";

const{Footer} = Layout

export const PlayerControlsContainer = styled(Footer)`
    text-align: center;
    display:flex;
    width:100%;
    height: 100%;
    flex-direction: column;
    justify-content: space-around;
    position: relative;
    //bottom:20px;
    z-index: 2;
    overflow:hidden;
`