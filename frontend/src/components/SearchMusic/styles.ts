import styled from "styled-components";
import { Space, Input } from "antd";

export const SpaceContainer = styled(Space)`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const SearchContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	margin-bottom: 1rem;
`;

export const SearchInput = styled(Input.Search)`
	.ant-input-search-button {
		background: #1890ff;
		border-color: #1890ff;
		height: 48px;
		padding: 0 24px;
		font-size: 16px;
		font-weight: 500;
	}
	
	.ant-input {
		height: 48px;
		font-size: 16px;
		border-radius: 8px 0 0 8px;
		border-color: #d9d9d9;
		
		&:focus {
			border-color: #1890ff;
			box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
		}
	}
	
	.ant-input-search-button {
		border-radius: 0 8px 8px 0;
	}
`;

export const ResultsContainer = styled.div`
	position: relative;
	width: 100%;
	max-width: 600px;
	z-index: 1000;
`;

export const ResultsCard = styled.div`
	background: #ffffff;
	border-radius: 12px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	border: 1px solid #f0f0f0;
	max-height: 400px;
	overflow-y: auto;
	overflow-x: hidden;
	width: 100%;
	
	.ant-list {
		width: 100%;
	}
	
	.ant-list-item {
		transition: background-color 0.2s ease;
		width: 100% !important;
		min-width: 0 !important;
		max-width: 100% !important;
		overflow: hidden !important;
		
		&:hover {
			background-color: #fafafa;
		}
		
		&:last-child {
			border-bottom: none;
		}
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
		width: 100% !important;
	}
	
	.ant-list-item-meta-description {
		margin-bottom: 0 !important;
		max-width: 100% !important;
		overflow: hidden !important;
		width: 100% !important;
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
	
	// Garantir que o texto seja sempre visível
	.ant-typography {
		overflow: visible !important;
		text-overflow: unset !important;
		white-space: normal !important;
		word-break: break-word !important;
		display: block !important;
		width: 100% !important;
	}
	
	// Garantir que o título e descrição sejam visíveis
	.ant-list-item-meta-title .ant-typography,
	.ant-list-item-meta-description .ant-typography {
		overflow: visible !important;
		text-overflow: unset !important;
		white-space: normal !important;
		word-break: break-word !important;
		display: block !important;
		width: 100% !important;
	}
	
	// Forçar visibilidade de todos os elementos de texto
	.ant-list-item-meta-title,
	.ant-list-item-meta-description,
	.ant-list-item-meta-title div,
	.ant-list-item-meta-description div {
		overflow: visible !important;
		text-overflow: unset !important;
		white-space: normal !important;
		word-break: break-word !important;
		display: block !important;
		width: 100% !important;
		color: inherit !important;
		visibility: visible !important;
		opacity: 1 !important;
	}
`;
