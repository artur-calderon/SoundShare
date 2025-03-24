import {Button} from "antd";
import {HeroContainer,HeroContent,Title,Subtitle,CTAButtons,StyledImage} from './styles.ts'
import notesAnimation from '../../../../../public/Animation_Girl_Music.json';

export function HeroSection(){
	return(
		<HeroContainer>
			<HeroContainer>
				<HeroContent>
					<Title>Compartilhe sua Música. Conecte-se pelo Som.</Title>
					<Subtitle>
						Crie salas de música, convide amigos e ouça juntos em tempo real,
						onde quer que estejam.
					</Subtitle>
					<CTAButtons>
						<Button type="primary" size="large">
							Crie Sua Sala Agora
						</Button>
						<Button size="large">Baixe o App</Button>
					</CTAButtons>
				</HeroContent>
				<StyledImage
					animationData={notesAnimation}
					alt="Sound Share App Mockup"
					width={500}
					height={300}
				/>
			</HeroContainer>
		</HeroContainer>
	)
}