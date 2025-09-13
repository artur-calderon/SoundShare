import styled from "styled-components";




export const PlayerControlsContainer = styled.div<{ $minimized: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: ${({ theme }) => theme.token.colorBgContainer || "#1c1c1c"};
  border-top: 1px solid ${({ theme }) => theme.token.colorBorder || "#333"};
  z-index: 9999;
  padding: ${({ $minimized }) => ($minimized ? "0.5rem 1rem" : "1rem 2rem")};
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  transition: all 0.3s ease;

  /* ✅ CORREÇÃO: Garantir que textos e ícones sejam visíveis */
  color: #ffffff;

  .ant-progress {
    width: 100%;
    margin-bottom: ${({ $minimized }) => ($minimized ? "0" : "0.5rem")};

    .ant-progress-outer {
      background-color: ${({ theme }) => theme.token.colorBorderSecondary || "#333"};
    }

    .ant-progress-bg {
      background-color: ${({ theme }) => theme.token.colorPrimary || "#f90"};
    }
  }

  /* ✅ CORREÇÃO: Estilos para o Slider do Ant Design */
  .ant-slider {
    .ant-slider-rail {
      background-color: #444;
    }
    
    .ant-slider-track {
      background-color: #1db954;
    }
    
    .ant-slider-handle {
      border-color: #1db954;
      background-color: #1db954;
    }
  }

  img {
    border-radius: 0.5rem;
    object-fit: cover;
    width: ${({ $minimized }) => ($minimized ? "2.5rem" : "6rem")};
    height: ${({ $minimized }) => ($minimized ? "2.5rem" : "6rem")};
    transition: all 0.3s ease;
  }

  span,
  h5 {
    font-size: ${({ $minimized }) => ($minimized ? "0.75rem" : "1rem")};
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #ffffff; /* ✅ CORREÇÃO: Cor branca para visibilidade */
  }

  @media (max-width: 768px) {
    padding: ${({ $minimized }) => ($minimized ? "0.3rem 0.5rem" : "0.5rem 1rem")};

    img {
        width: ${({$minimized}) => ($minimized ? "2rem" : "3.5rem")};
        height: ${({$minimized}) => ($minimized ? "2rem" : "3.5rem")};
	display: ${({$minimized}) => ($minimized ? "none" : "block")};
    }

    /* ✅ CORREÇÃO: Não esconder todos os spans e h5s, apenas quando minimizado */
    .ant-flex span,
    .ant-flex h5 {
      font-size: ${({ $minimized }) => ($minimized ? "0.75rem" : "0.9rem")};
      display: ${({ $minimized }) => ($minimized ? "none" : "block")};
      color: #ffffff; /* ✅ CORREÇÃO: Cor branca para visibilidade */
    }
  }
`;