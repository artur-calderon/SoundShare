import styled from "styled-components";




export const PlayerControlsContainer = styled.div<{ minimized: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: ${({ theme }) => theme.token.colorBgContainer || "#1c1c1c"};
  border-top: 1px solid ${({ theme }) => theme.token.colorBorder || "#333"};
  z-index: 9999;
  padding: ${({ minimized }) => (minimized ? "0.5rem 1rem" : "1rem 2rem")};
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  transition: all 0.3s ease;

  .ant-progress {
    width: 100%;
    margin-bottom: ${({ minimized }) => (minimized ? "0" : "0.5rem")};

    .ant-progress-outer {
      background-color: ${({ theme }) => theme.token.colorBorderSecondary || "#333"};
    }

    .ant-progress-bg {
      background-color: ${({ theme }) => theme.token.colorPrimary || "#f90"};
    }
  }

  img {
    border-radius: 0.5rem;
    object-fit: cover;
    width: ${({ minimized }) => (minimized ? "2.5rem" : "6rem")};
    height: ${({ minimized }) => (minimized ? "2.5rem" : "6rem")};
    transition: all 0.3s ease;
  }

  span,
  h5 {
    font-size: ${({ minimized }) => (minimized ? "0.75rem" : "1rem")};
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 768px) {
    padding: ${({ minimized }) => (minimized ? "0.3rem 0.5rem" : "0.5rem 1rem")};

    img {
        width: ${({minimized}) => (minimized ? "2rem" : "3.5rem")};
        height: ${({minimized}) => (minimized ? "2rem" : "3.5rem")};
	    display: ${({minimized}) => (minimized ? "none" : "block")};
    }

    span,
    h5 {
      font-size: ${({ minimized }) => (minimized ? "15rem" : "0.9rem")};
	    display: none;
    }
  }
`;