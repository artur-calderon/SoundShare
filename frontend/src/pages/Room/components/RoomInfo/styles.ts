import styled from "styled-components";
import { Typography, Space } from "antd";

const { Title } = Typography;

export const RoomInfoContainer = styled.div`
	width: 100%;
	margin-top: 0;
	padding: 0;
	background: transparent;
	border: none;
	border-radius: 0;
	box-shadow: none;
`;

export const RoomInfoSection = styled.div`
	margin-bottom: 24px;
	
	&:last-child {
		margin-bottom: 0;
	}
`;

export const RoomInfoTitle = styled(Title)`
	margin: 0 0 16px 0 !important;
	color: #262626 !important;
	font-size: 16px !important;
	font-weight: 600 !important;
`;

export const RoomInfoItem = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 12px;
	padding: 8px 12px;
	background: #ffffff;
	border-radius: 8px;
	border: 1px solid #f0f0f0;
	
	&:last-child {
		margin-bottom: 0;
	}
	
	// Garantir que o texto seja visível
	.ant-typography {
		color: #262626 !important;
	}
	
	.ant-typography-secondary {
		color: #595959 !important;
	}
`;

export const MembersList = styled.div`
	width: 100%;
	margin-bottom: 16px;
`;

export const MemberItem = styled.div`
	display: flex;
	align-items: center;
	padding: 12px;
	background: #ffffff;
	border: 1px solid #f0f0f0;
	border-radius: 8px;
	margin-bottom: 8px;
	
	&:last-child {
		margin-bottom: 0;
	}
	
	&:hover {
		background: #f8f9fa;
		border-color: #d9d9d9;
	}
	
	// Garantir que o texto seja visível
	.ant-typography {
		color: #262626 !important;
	}
	
	.ant-tag {
		color: #ffffff !important;
	}
`;

export const MemberAvatar = styled.div`
	margin-right: 12px;
`;

export const MemberName = styled.div`
	flex: 1;
	
	// Garantir que o nome seja visível
	.ant-typography {
		color: #262626 !important;
		font-weight: 500 !important;
	}
`;

export const OnlineStatus = styled.div`
	margin-left: 8px;
`;
