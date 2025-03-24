import styled from "styled-components";
import Lottie from 'lottie-react'


export const HeroContainer = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4rem 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 2rem 1rem;
    text-align: center;
  }
`;

export const HeroContent = styled.div`
  max-width: 50%;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-bottom: 2rem;
  }
`;

export const Title = styled.h1`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const StyledImage = styled(Lottie)`
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;