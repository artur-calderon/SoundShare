import styled from "styled-components";
import {Button} from 'antd'

export const CTAContainer = styled.section`
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors["--clr-primary-a0"]};
  color: ${({ theme }) => theme.colors["--clr-light-a0"]};
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

export const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const StoreButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 200px;
  }
`;

export const AppPreview = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

export const StyledImage = styled.img`
  @media (max-width: 768px) {
    width: 80%;
    height: auto;
  }
`;