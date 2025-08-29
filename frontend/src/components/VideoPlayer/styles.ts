import styled from "styled-components";
import { Space } from "antd";

export const SpaceContainer = styled(Space)`
	width: 100%;
	max-width: 800px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const PlayerContainer = styled.div`
	width: 100%;
	max-width: 800px;
	background: #ffffff;
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	overflow: hidden;
`;

export const Player = styled.div`
	width: 100%;
	height: 450px;
	position: relative;
	background: #000000;
	border-radius: 12px;
	overflow: hidden;

	.react-player {
		border-radius: 12px;
	}

	@media (max-width: 768px) {
		height: 300px;
	}
`;

export const PlayerOverlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 10;
	background: transparent;
	cursor: not-allowed;
	
	// ✅ PROTEÇÃO: Impede cliques diretos no player
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: transparent;
		z-index: 1;
	}
	
	// ✅ MENSAGEM CENTRAL: Ícone de bloqueio no centro
	&::after {
		content: '🔒';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 48px;
		opacity: 0.3;
		transition: opacity 0.3s ease;
		pointer-events: none;
		z-index: 2;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
	}
	
	// ✅ HOVER: Mostra mensagem completa ao passar o mouse
	&:hover::after {
		content: '🔒 Use os controles abaixo';
		font-size: 13px;
		font-weight: 500;
		background: rgba(0, 0, 0, 0.9);
		color: white;
		padding: 10px 20px;
		border-radius: 25px;
		white-space: nowrap;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		opacity: 1;
	}
	
	// ✅ CURSOR: Mostra que não é clicável
	&:hover {
		cursor: not-allowed;
	}
`;

export const EmptyStateContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80px 40px;
	text-align: center;
	background: #fafafa;
	min-height: 450px;
`;

export const EmptyStateIcon = styled.div`
	margin-bottom: 24px;
`;

export const EmptyStateText = styled.h3`
	font-size: 18px;
	font-weight: 500;
	color: #595959;
	margin: 0 0 12px 0;
`;

export const EmptyStateDescription = styled.p`
	font-size: 14px;
	color: #8c8c8c;
	margin: 0;
	line-height: 1.5;
	max-width: 400px;
`;