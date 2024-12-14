import styled from "styled-components";
import { Facebook, Twitter, Instagram } from "lucide-react";

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.background};
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const FooterContent = styled.div`
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

const FooterLinks = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.background};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  color: ${({ theme }) => theme.colors.background};
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLinks>
          <FooterLink href="/privacy">Política de Privacidade</FooterLink>
          <FooterLink href="/terms">Termos de Uso</FooterLink>
          <FooterLink href="/contact">Contato</FooterLink>
        </FooterLinks>
        <SocialIcons>
          <SocialIcon
            href="https://facebook.com/soundshare"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook />
          </SocialIcon>
          <SocialIcon
            href="https://twitter.com/soundshare"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter />
          </SocialIcon>
          <SocialIcon
            href="https://instagram.com/soundshare"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram />
          </SocialIcon>
        </SocialIcons>
      </FooterContent>
    </FooterContainer>
  );
}
