import styled from "styled-components";
import { Space, Typography } from "antd";

const { Title } = Typography;

export const PlaylistContainer = styled(Space)`
	width: 100%;
	height: 100%;
	max-height: 100vh;
	background: #ffffff;
	border-radius: 12px;
	padding: 5px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	
	// ✅ CORREÇÃO: Garantir que o container tenha altura fixa
	& > * {
		width: 100%;
	}
	
	@media (max-width: 768px) {
		padding: 16px;
	}
`;

export const PlaylistHeader = styled.div`
	margin-bottom: 16px;
	padding-bottom: 12px;
	border-bottom: 1px solid #f0f0f0;
	flex-shrink: 0;
`;

export const TitlePlaylist = styled(Title)`
	margin: 0 !important;
	color: #262626 !important;
	font-size: 18px !important;
	font-weight: 600 !important;
	display: flex !important;
	align-items: center !important;
	
	@media (max-width: 768px) {
		font-size: 16px !important;
	}
`;

export const PlaylistItens = styled.div`
	width: 100%;
	flex: 1;
	min-height: 0;
	max-height: 250px;
	overflow-y: auto;
	overflow-x: hidden;
	
	// ✅ CORREÇÃO: Garantir que o scroll funcione
	&::-webkit-scrollbar {
		width: 8px;
	}
	
	&::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 4px;
	}
	
	&::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 4px;
	}
	
	&::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}
	
	// ✅ CORREÇÃO: Scrollbar para Firefox
	scrollbar-width: thin;
	scrollbar-color: #c1c1c1 #f1f1f1;
	
	// ✅ CORREÇÃO: Forçar scroll quando necessário
	&:hover {
		overflow-y: auto;
	}
	
	// Garantir que os itens da lista não quebrem o layout
	.ant-list-item {
		width: 100% !important;
		min-width: 0 !important;
		max-width: 100% !important;
		overflow: hidden !important;
	}
	
	// Garantir que o conteúdo não transborde
	.ant-list-item-meta {
		flex: 1;
		min-width: 0;
		max-width: 100%;
		overflow: hidden;
	}
	
	.ant-list-item-meta-title {
		margin-bottom: 4px !important;
		max-width: 100% !important;
		overflow: hidden !important;
	}
	
	.ant-list-item-meta-description {
		margin-bottom: 0 !important;
		max-width: 100% !important;
		overflow: hidden !important;
	}
	
	// Garantir que as ações não quebrem o layout
	.ant-list-item-action {
		margin-left: 8px !important;
		flex-shrink: 0;
	}
	
	// Garantir que a imagem extra não quebre o layout
	.ant-list-item-extra {
		margin-left: 12px !important;
		flex-shrink: 0;
	}
	
	// Garantir que não haja overflow horizontal
	* {
		max-width: 100% !important;
		box-sizing: border-box !important;
	}
`;

export const EmptyPlaylistContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 48px 24px;
	text-align: center;
	flex: 1;
	
	@media (max-width: 768px) {
		padding: 32px 16px;
	}
`;



// import styled from "styled-components";
// import {Space, Typography} from "antd";
// import {darkRoomTheme} from "../../../../styles/themes/roomTheme.ts";
//
// const {Title} = Typography;
//
// export const PlaylistContainer = styled(Space)`
// 	padding-top: 3rem;
// 	align-items: center;
// 	justify-content: flex-start;
// 	width: 100%;
// 	//height: 70vh;
//
// `
//
// export const TitlePlaylist = styled(Title)`
// 	display: flex;
// 	align-items: center;
// 	gap: 1rem;
// `
//
// export const PlaylistItens = styled.div`
// 	overflow-y:auto;
// 	max-height: 50vh;
// 	scrollbar-color: ${darkRoomTheme.token.colorPrimary} ${darkRoomTheme.token.colorBorder};
// 	scrollbar-width: thin;
// `
