import styled from "styled-components";
import { Carousel } from "antd";
import { Star } from "lucide-react";

const TestimonialsContainer = styled.section`
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.text};
`;

const TestimonialItem = styled.div`
  text-align: center;
  padding: 0 2rem;
`;

const Quote = styled.p`
  font-size: 1.2rem;
  font-style: italic;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Author = styled.p`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const Rating = styled.div`
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 1rem;
`;

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "O Sound Share me ajuda a descobrir novas músicas com meus amigos!",
      author: "Maria S.",
      rating: 5,
    },
    {
      quote: "Adoro criar salas temáticas e compartilhar com minha comunidade.",
      author: "João P.",
      rating: 5,
    },
    {
      quote: "A sincronização em tempo real é incrível para festas virtuais!",
      author: "Ana L.",
      rating: 4,
    },
  ];

  return (
    <TestimonialsContainer>
      <Title>Veja o que estão dizendo</Title>
      <Carousel autoplay>
        {testimonials.map((testimonial, index) => (
          <TestimonialItem key={index}>
            <Quote>"{testimonial.quote}"</Quote>
            <Author>{testimonial.author}</Author>
            <Rating>
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} fill="currentColor" />
              ))}
            </Rating>
          </TestimonialItem>
        ))}
      </Carousel>
    </TestimonialsContainer>
  );
}
