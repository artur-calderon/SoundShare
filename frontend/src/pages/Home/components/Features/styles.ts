import styled from "styled-components";


export const FeaturesContainer = styled.section`
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
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors["--clr-primary-a0"]};
`;

export const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

export const FeatureDescription = styled.p`
  font-size: 1rem;
`;