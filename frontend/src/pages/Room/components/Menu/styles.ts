import styled from "styled-components";
import { Space } from "antd";

export const MenuContainer = styled.div`
	height: 100%;
	background: #000000;
	color: #ffffff;
	padding: 0;
	display: flex;
	flex-direction: column;
`;

export const LogoContainer = styled.div`
	display: flex;
	align-items: center;
	padding: 24px 20px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	margin-bottom: 16px;
`;

export const LogoImage = styled.img`
	width: 32px;
	height: 32px;
	margin-right: 12px;
	background: #1890ff;
	border-radius: 8px;
	padding: 4px;
`;

export const LogoText = styled.div`
	font-size: 18px;
	font-weight: 600;
	color: #ffffff;
	margin-bottom: 4px;
`;

export const AdminBadge = styled.div`
	font-size: 12px;
	color: #8c8c8c;
	font-weight: 500;
`;

export const ChangeRoomToOnOff = styled.div<{ ishost: string }>`
	display: ${props => props.ishost === "true" ? "flex" : "none"};
	align-items: center;
	justify-content: space-between;
	padding: 16px 20px;
	margin-bottom: 16px;
	background: rgba(255, 255, 255, 0.05);
	border-radius: 8px;
	margin: 0 20px 16px 20px;
`;