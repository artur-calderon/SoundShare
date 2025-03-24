import {FAQContainer,StyledCollapse,Title} from  './styles.ts'
import {Collapse} from "antd";


export function FAQ() {
const { Panel } = Collapse;
	const faqItems = [
		{
			question: "Posso compartilhar qualquer tipo de música?",
			answer: "Sim, desde que seja aprovada pelo administrador da sala.",
		},
		{
			question: "Como funciona o controle de administrador?",
			answer:
				"O administrador da sala aprova ou rejeita músicas para manter a vibe da sala.",
		},
		{
			question: "O Sound Share é gratuito?",
			answer:
				"Sim, o Sound Share é gratuito para download e uso básico. Temos planos premium com recursos adicionais.",
		},
		{
			question: "Posso usar o Sound Share offline?",
			answer:
				"O Sound Share requer uma conexão com a internet para funcionar, pois se baseia em streaming e compartilhamento em tempo real.",
		},
	];

	return (
		<FAQContainer>
			<Title>Perguntas Frequentes</Title>
			<StyledCollapse>
				{faqItems.map((item, index) => (
					<Panel header={item.question} key={index}>
						<p>{item.answer}</p>
					</Panel>
				))}
			</StyledCollapse>
		</FAQContainer>
	);
}