import styled from "styled-components";

export const BenefitsContainer = styled.section`
  padding: 4rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

export const Title = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors["--clr-surface-a0"]};

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

export const BenefitsList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const BenefitItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

export const BenefitIcon = styled.div`
  color: ${({ theme }) => theme.colors["--clr-primary-a0"]};
  font-size: 2rem;
`;

export const BenefitContent = styled.div``;

export const BenefitTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors["--clr-surface-a0"]};
`;

export const BenefitDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors["--clr-surface-a0"]};
`;