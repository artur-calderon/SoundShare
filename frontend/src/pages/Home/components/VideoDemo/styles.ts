import styled from "styled-components";

export const VideoDemoContainer = styled.section`
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors["--clr-surface-a0"]};
  color: ${({ theme }) => theme.colors["--clr-light-a0"]};

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

export const Title = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

export const VideoWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  aspect-ratio: 16 / 9;
`;