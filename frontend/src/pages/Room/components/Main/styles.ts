import styled from 'styled-components';
import { Layout } from 'antd';

export const MainLayout = styled(Layout)`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	background: #f5f5f5;
`;

export const MainSpace = styled.div`
	flex: 1;
	padding: 0;
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
	
	@media (max-width: 768px) {
		padding: 0;
	}
`;

export const MainTitle = styled.h1`
	font-size: 28px;
	font-weight: 600;
	color: #262626;
	margin: 0 0 32px 0;
	text-align: center;
	
	@media (max-width: 768px) {
		font-size: 24px;
		margin-bottom: 24px;
	}
`;

export const PlayerSearchContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2rem;
	align-items: center;
`;