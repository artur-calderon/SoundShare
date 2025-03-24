import {StyledImage,AppPreview,ButtonContainer,StoreButton,CTAContainer,Title} from './styles.ts'
import {AppleIcon, Smartphone} from 'lucide-react'

export function Download() {
	return (
		<CTAContainer>
			<Title>Junte-se à Comunidade Sound Share Agora</Title>
			<ButtonContainer>
				<StoreButton type="primary" size="large" icon={<AppleIcon />}>
					App Store
				</StoreButton>
				<StoreButton type="primary" size="large" icon={<Smartphone />}>
					Google Play
				</StoreButton>
			</ButtonContainer>
			<AppPreview>
				<StyledImage
					src="/placeholder.svg"
					alt="Sound Share App Store Preview"
					width={200}
					height={400}
				/>
				<StyledImage
					src="/placeholder.svg"
					alt="Sound Share Google Play Preview"
					width={200}
					height={400}
				/>
			</AppPreview>
		</CTAContainer>
	);
}
