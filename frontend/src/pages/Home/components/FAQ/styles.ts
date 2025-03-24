import styled from "styled-components";
import {Collapse} from "antd";

export const FAQContainer = styled.section`
  padding: 4rem 2rem;
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

export const Title = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors["--clr-surface-a0"]};

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

export const StyledCollapse = styled(Collapse)`
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;