import styled from "styled-components";
import { Button } from "antd";
import { AppleIcon, SmartphoneIcon as AndroidIcon } from "lucide-react";

const CTAContainer = styled.section`
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StoreButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 200px;
  }
`;

const AppPreview = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

const StyledImage = styled.img`
  @media (max-width: 768px) {
    width: 80%;
    height: auto;
  }
`;

export default function DownloadCTA() {
  return (
    <CTAContainer>
      <Title>Junte-se à Comunidade Sound Share Agora</Title>
      <ButtonContainer>
        <StoreButton type="primary" size="large" icon={<AppleIcon />}>
          App Store
        </StoreButton>
        <StoreButton type="primary" size="large" icon={<AndroidIcon />}>
          Google Play
        </StoreButton>
      </ButtonContainer>
      <AppPreview>
        <StyledImage
          src="/placeholder.svg"
          alt="Sound Share App Store Preview"
          width={200}
          height={400}
        />
        <StyledImage
          src="/placeholder.svg"
          alt="Sound Share Google Play Preview"
          width={200}
          height={400}
        />
      </AppPreview>
    </CTAContainer>
  );
}
