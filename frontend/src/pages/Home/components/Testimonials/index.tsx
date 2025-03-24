import {Rating,Author,Quote,TestimonialItem,TestimonialsContainer,Title} from './styles.ts'
import {Carousel} from "antd";
import {Star} from "lucide-react";

export function Testimonials() {
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
