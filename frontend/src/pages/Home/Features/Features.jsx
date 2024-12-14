import styled from "styled-components";
import { Users, Lock, Music, Headphones } from "lucide-react";

const FeaturesContainer = styled.section`
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.background};

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
`;

export default function Features() {
  const features = [
    {
      icon: <Users />,
      title: "Salas Públicas ou Privadas",
      description:
        "Crie ambientes personalizados para qualquer estilo musical.",
    },
    {
      icon: <Lock />,
      title: "Controle de Administrador",
      description:
        "Apenas os administradores podem aceitar ou rejeitar músicas para garantir a vibe certa.",
    },
    {
      icon: <Music />,
      title: "Gêneros Personalizados",
      description:
        "Cada sala tem um gênero específico para manter a experiência musical única.",
    },
    {
      icon: <Headphones />,
      title: "Ouça Junto em Tempo Real",
      description:
        "Conecte-se com amigos ou novas pessoas e sincronize a música ao vivo.",
    },
  ];

  return (
    <FeaturesContainer>
      <Title>Como o Sound Share Transforma a Forma de Ouvir Música</Title>
      <FeatureGrid>
        {features.map((feature, index) => (
          <FeatureItem key={index}>
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureItem>
        ))}
      </FeatureGrid>
    </FeaturesContainer>
  );
}
