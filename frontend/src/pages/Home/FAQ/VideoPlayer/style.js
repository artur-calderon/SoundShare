import styled from "styled-components";
import {Space} from "antd";


export const SpaceContainer = styled(Space)`
    width:100%;
    display: ${props => !props.$changeplayertosearch ? "block" : "none"};
    height: 80vh;
    
`

export const Player = styled.div`
    width: 100%;
    height: 100%;

`