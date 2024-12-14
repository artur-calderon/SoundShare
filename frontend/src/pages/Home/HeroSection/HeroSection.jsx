import styled from "styled-components";
import { Button } from "antd";

import Lottie from "lottie-react";
import notesAnimation from "../../../../public/Animation_Girl_Music.json";

const HeroContainer = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 2rem 1rem;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  max-width: 50%;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-bottom: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StyledImage = styled(Lottie)`
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;

export default function HeroSection() {
  return (
    <HeroContainer>
      <HeroContainer>
        <HeroContent>
          <Title>Compartilhe sua Música. Conecte-se pelo Som.</Title>
          <Subtitle>
            Crie salas de música, convide amigos e ouça juntos em tempo real,
            onde quer que estejam.
          </Subtitle>
          <CTAButtons>
            <Button type="primary" size="large">
              Crie Sua Sala Agora
            </Button>
            <Button size="large">Baixe o App</Button>
          </CTAButtons>
        </HeroContent>
        <StyledImage
          animationData={notesAnimation}
          alt="Sound Share App Mockup"
          width={500}
          height={300}
        />
      </HeroContainer>
    </HeroContainer>
  );
}
