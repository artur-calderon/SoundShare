import styled from "styled-components";

export const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors["--clr-surface-a0"]};
  color: ${({ theme }) => theme.colors["--clr-light-a0"]};
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

export const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const FooterLinks = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors["--clr-light-a0"]};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
`;

export const SocialIcon = styled.a`
  color: ${({ theme }) => theme.colors["--clr-light-a0"]};
  &:hover {
    color: ${({ theme }) => theme.colors["--clr-primary-a0"]};
  }
`;