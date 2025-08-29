import styled from "styled-components";

export const Container = styled.div`
	width: 100%;
	margin-top: 24px;
	padding: 24px;
	background: #ffffff;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const StatsTitle = styled.h3`
	font-size: 18px;
	font-weight: 600;
	color: #262626;
	margin: 0 0 20px 0;
	text-align: center;
`;

export const InfoRoom = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

export const StatItem = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
	background: #fafafa;
	border-radius: 8px;
	border: 1px solid #f0f0f0;
`;

export const StatIcon = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	background: #e6f7ff;
	border-radius: 6px;
	color: #1890ff;
`;

export const StatLabel = styled.span`
	font-size: 14px;
	color: #8c8c8c;
	font-weight: 500;
	min-width: 120px;
`;

export const StatValue = styled.span`
	font-size: 14px;
	color: #262626;
	font-weight: 600;
	flex: 1;
`;
