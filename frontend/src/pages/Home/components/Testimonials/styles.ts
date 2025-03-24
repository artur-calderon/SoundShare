import styled from "styled-components";


export const TestimonialsContainer = styled.section`
  padding: 4rem 2rem;
`;

export const Title = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors["--clr-surface-a0"]};
`;

export const TestimonialItem = styled.div`
  text-align: center;
  padding: 0 2rem;
`;

export const Quote = styled.p`
  font-size: 1.2rem;
  font-style: italic;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors["--clr-surface-a0"]};
`;

export const Author = styled.p`
  font-weight: bold;
  color: ${({ theme }) => theme.colors["--clr-primary-a0"]};
`;

export const Rating = styled.div`
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.colors["--clr-primary-a0"]};
  margin-top: 1rem;
`;