import {FeaturesContainer,FeatureDescription,FeatureIcon,FeatureItem,FeatureTitle,Title,FeatureGrid} from './styles.ts'
import {Users, Lock,  Music, Headphones} from "lucide-react";


export function Features() {
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
