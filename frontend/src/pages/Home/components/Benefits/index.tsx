import {BenefitDescription,BenefitContent,BenefitIcon,BenefitItem,BenefitsContainer,BenefitsList,BenefitTitle,Title} from './styles.ts'
import {Clock,Compass,Shield} from 'lucide-react'
export function Benefits() {
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
