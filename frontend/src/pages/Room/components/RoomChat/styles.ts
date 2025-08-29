import styled from 'styled-components';

export const ChatContainer = styled.div`
	background: #ffffff;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	height: 600px;
	width: 350px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	border: 1px solid #f0f0f0;

	@media (max-width: 768px) {
		height: 500px;
		width: 100%;
		margin-top: 16px;
	}
`;

export const ChatHeader = styled.div`
	padding: 16px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	border-radius: 12px 12px 0 0;
	
	.ant-typography {
		color: white !important;
	}
	
	.ant-badge-count {
		background: rgba(255, 255, 255, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.3);
	}
`;

export const UserList = styled.div`
	padding: 12px 16px;
	background: #fafafa;
	border-bottom: 1px solid #f0f0f0;
	max-height: 120px;
	overflow-y: auto;
	
	&::-webkit-scrollbar {
		width: 4px;
	}
	
	&::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 2px;
	}
	
	&::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 2px;
	}
	
	&::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}
	
	.ant-typography {
		color: #595959 !important;
	}
`;

export const UserItem = styled.div`
	display: flex;
	align-items: center;
	padding: 4px 0;
	
	&:hover {
		background: rgba(0, 0, 0, 0.02);
		border-radius: 4px;
	}
	
	.ant-avatar {
		margin-right: 8px;
		flex-shrink: 0;
	}
	
	.ant-typography {
		color: #262626 !important;
		font-size: 12px;
		margin: 0;
		line-height: 1.2;
	}
`;

export const ChatMessages = styled.div`
	flex: 1;
	overflow-y: auto;
	padding: 16px;
	background: #ffffff;
	
	&::-webkit-scrollbar {
		width: 6px;
	}
	
	&::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 3px;
	}
	
	&::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 3px;
	}
	
	&::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}
	
	.ant-list {
		max-height: 100%;
		overflow-y: auto;
	}
	
	.ant-list-item {
		padding: 8px 0;
		border-bottom: none !important;
		
		&:hover {
			background: rgba(0, 0, 0, 0.02);
			border-radius: 8px;
		}
	}
	
	/* Forçar layout horizontal para List.Item.Meta */
	.ant-list-item-meta {
		display: flex !important;
		flex-direction: row !important;
		align-items: flex-start !important;
		width: 100% !important;
	}
	
	.ant-list-item-meta-avatar {
		flex-shrink: 0 !important;
		margin-right: 12px !important;
		align-self: flex-start !important;
	}
	
	.ant-list-item-meta-content {
		flex: 1 !important;
		min-width: 0 !important;
		display: flex !important;
		flex-direction: column !important;
	}
`;

export const MessageContent = styled.div`
	position: relative;
	width: 100%;
	
	.ant-typography {
		word-break: break-word;
		line-height: 1.4;
	}
`;

export const MessageTime = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	font-size: 10px;
	color: #8c8c8c;
	background: rgba(255, 255, 255, 0.8);
	padding: 2px 6px;
	border-radius: 10px;
	white-space: nowrap;
`;

export const MessageActions = styled.div`
	position: absolute;
	bottom: 0;
	right: 0;
	opacity: 0;
	transition: opacity 0.2s ease;
	
	.ant-btn {
		padding: 2px 4px;
		height: auto;
		font-size: 12px;
	}
`;

export const MessageItem = styled.div`
	.ant-list-item-meta-avatar {
		margin-right: 12px;
		flex-shrink: 0;
		align-self: flex-start !important;
	}
	
	.ant-avatar {
		border: 2px solid #f0f0f0;
	}
	
	.ant-list-item-meta {
		align-items: flex-start !important;
		display: flex !important;
		flex-direction: row !important;
		width: 100% !important;
	}
	
	.ant-list-item-meta-content {
		flex: 1 !important;
		min-width: 0 !important;
	}
	
	.ant-list-item-meta-title {
		margin-bottom: 4px !important;
		color: #262626 !important;
		line-height: 1.2;
		display: block !important;
		text-align: left !important;
		
		.ant-typography {
			color: #262626 !important;
			font-size: 12px;
			margin: 0;
		}
	}
	
	.ant-list-item-meta-description {
		width: 100%;
		color: #595959 !important;
		line-height: 1.4;
		display: block !important;
		text-align: left !important;
		
		.ant-typography {
			color: #595959 !important;
			font-size: 13px;
			margin: 0;
		}
	}
	
	&:hover ${MessageActions} {
		opacity: 1;
	}
`;

export const ChatInput = styled.div`
	padding: 16px;
	background: #fafafa;
	border-top: 1px solid #f0f0f0;
	border-radius: 0 0 12px 12px;
	
	.ant-space-compact {
		width: 100%;
	}
	
	.ant-input {
		border-radius: 0;
		border-left: none;
		border-right: none;
		
		&:focus {
			border-color: #d9d9d9;
			box-shadow: none;
		}
	}
	
	.ant-btn:first-child {
		border-radius: 6px 0 0 6px;
		border-right: none;
	}
	
	.ant-btn:last-child {
		border-radius: 0 6px 6px 0;
		border-left: none;
	}
	
	.ant-btn-primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-color: #667eea;
		
		&:hover {
			background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
			border-color: #5a6fd8;
		}
	}
`;

// Estilos responsivos
export const ResponsiveContainer = styled.div`
	@media (max-width: 768px) {
		${ChatContainer} {
			height: 400px;
		}
		
		${ChatHeader} {
			padding: 12px;
		}
		
		${ChatMessages} {
			padding: 12px;
		}
		
		${ChatInput} {
			padding: 12px;
		}
		
		${UserList} {
			max-height: 80px;
		}
	}
`;
