import {FooterContainer, FooterContent, FooterLink, FooterLinks, SocialIcon, SocialIcons} from "./styles.ts";
import {Facebook, Instagram, Twitter} from "lucide-react";

export function Footer() {
	return (
		<FooterContainer>
			<FooterContent>
				<FooterLinks>
					<FooterLink href="/privacy">Política de Privacidade</FooterLink>
					<FooterLink href="/terms">Termos de Uso</FooterLink>
					<FooterLink href="/contact">Contato</FooterLink>
				</FooterLinks>
				<SocialIcons>
					<SocialIcon
						href="https://facebook.com/soundshare"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Facebook />
					</SocialIcon>
					<SocialIcon
						href="https://twitter.com/soundshare"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Twitter />
					</SocialIcon>
					<SocialIcon
						href="https://instagram.com/soundshare"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Instagram />
					</SocialIcon>
				</SocialIcons>
			</FooterContent>
		</FooterContainer>
	);
}
