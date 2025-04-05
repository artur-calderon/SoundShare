import styled from "styled-components";
import {Space} from "antd";


export const SpaceContainer = styled(Space)`
    width:100%;
    height: 80vh;
	
	@media (max-width: 768px) {
		height: 100%;
		width: 26rem;
		
		.alert-player{
			margin-top: 2rem;	
		}
	}
`

export const Player = styled.div`
    width: 100%;
    position: relative;

    //padding-top: 56.25%; /* Proporção 16:9 */

    iframe, video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
	
    .player-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        /* Para impedir interações */
        pointer-events: all;
    }

`

	// ${props => !props.$changeplayertosearch ? "block" : "none"};