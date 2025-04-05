import styled, { keyframes } from "styled-components";
import { darkRoomTheme } from "../../../../styles/themes/roomTheme.ts";

// Animação de entrada suave
const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const Container = styled.div`
    color: ${darkRoomTheme.token.colorPrimary};
    width: 100%;
    padding: 1rem;
    border-top: 1px solid;
    height: auto;
    animation: ${fadeInUp} 0.6s ease forwards;

    > h3 {
        text-align: center;
        font-size: clamp(1rem, 2vw, 1.5rem);
        margin-bottom: 1rem;
    }

`;

export const InfoRoom = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1 1 45%; // Responsivo: dois por linha, ajusta em mobile
    min-width: 200px;
    font-size: clamp(0.9rem, 1.5vw, 1rem);
    animation: ${fadeInUp} 0.6s ease forwards;

    svg {
      width: clamp(16px, 2vw, 24px);
      height: clamp(16px, 2vw, 24px);
      flex-shrink: 0;
    }

    h3 {
      margin: 0;
      font-size: inherit;
      font-weight: 500;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    span {
      flex: 1 1 100%;
    }
  }
`;


// import styled from "styled-components";
// import {darkRoomTheme} from "../../../../styles/themes/roomTheme.ts";
//
// export const Container = styled.div`
// 	color: ${darkRoomTheme.token.colorPrimary};
// 	width: 100%;
// 	padding: 1rem;
//
// 	> h3 {
// 	   text-align: center;
// 	  }
// 	border-top: 1px solid;
// 	height: 20vh;
// `;
//
// export const InfoRoom = styled.div`
// 	  display: flex;
// 	  flex-direction: column;
// 	  justify-content: flex-start;
// 	  margin-top: 1rem;
// 	  gap: 1rem;
//
// 	  span {
// 	    display: flex;
// 	    align-items: center;
// 	    gap: 0.5rem;
// 	  }
// `;
