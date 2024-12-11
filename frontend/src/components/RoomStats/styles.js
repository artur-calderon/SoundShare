import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding: 1rem 0;
  > h3 {
    text-align: center;
  }
  border-top: 1px solid;
`;

export const InfoRoom = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 1rem;
  gap: 1rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;
