import styled from "styled-components";
import { Collapse } from "antd";

const { Panel } = Collapse;

const FAQContainer = styled.section`
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

const StyledCollapse = styled(Collapse)`
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export default function FAQ() {
  const faqItems = [
    {
      question: "Posso compartilhar qualquer tipo de música?",
      answer: "Sim, desde que seja aprovada pelo administrador da sala.",
    },
    {
      question: "Como funciona o controle de administrador?",
      answer:
        "O administrador da sala aprova ou rejeita músicas para manter a vibe da sala.",
    },
    {
      question: "O Sound Share é gratuito?",
      answer:
        "Sim, o Sound Share é gratuito para download e uso básico. Temos planos premium com recursos adicionais.",
    },
    {
      question: "Posso usar o Sound Share offline?",
      answer:
        "O Sound Share requer uma conexão com a internet para funcionar, pois se baseia em streaming e compartilhamento em tempo real.",
    },
  ];

  return (
    <FAQContainer>
      <Title>Perguntas Frequentes</Title>
      <StyledCollapse>
        {faqItems.map((item, index) => (
          <Panel header={item.question} key={index}>
            <p>{item.answer}</p>
          </Panel>
        ))}
      </StyledCollapse>
    </FAQContainer>
  );
}
