import styled from "styled-components";
import { Clock, Compass, Shield } from "lucide-react";

const BenefitsContainer = styled.section`
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

const BenefitsList = styled.ul`
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

const BenefitItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const BenefitIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
`;

const BenefitContent = styled.div``;

const BenefitTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const BenefitDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

export default function Benefits() {
  const benefits = [
    {
      icon: <Clock />,
      title: "Conexão em tempo real",
      description:
        "Músicas reproduzidas simultaneamente para todos os participantes.",
    },
    {
      icon: <Compass />,
      title: "Descubra novas músicas",
      description:
        "Explore playlists colaborativas ou músicas sugeridas por outros.",
    },
    {
      icon: <Shield />,
      title: "Ambiente musical controlado",
      description:
        "Os administradores mantêm a curadoria das músicas para garantir que o estilo seja respeitado.",
    },
  ];

  return (
    <BenefitsContainer>
      <Title>Por que Sound Share?</Title>
      <BenefitsList>
        {benefits.map((benefit, index) => (
          <BenefitItem key={index}>
            <BenefitIcon>{benefit.icon}</BenefitIcon>
            <BenefitContent>
              <BenefitTitle>{benefit.title}</BenefitTitle>
              <BenefitDescription>{benefit.description}</BenefitDescription>
            </BenefitContent>
          </BenefitItem>
        ))}
      </BenefitsList>
    </BenefitsContainer>
  );
}
