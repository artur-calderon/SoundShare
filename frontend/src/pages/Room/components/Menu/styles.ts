import styled from "styled-components";
import { Flex } from "antd";

export const MenuContainer = styled(Flex)`
	height: 100%;
	width: 100%;

	// Mobile
	@media (max-width: 768px) {
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		padding: 0.5rem 0;

		.ant-menu {
			border: none;
			display: flex;
			
			flex-direction: column;
			width: 100%;
			justify-content: space-around;
			background: transparent;
			

			.ant-menu-item {
				margin-inline: 0;
				padding: 0 1rem;
				justify-content: center;
				width: auto;

				
			}
		}
	}

	// Tablet
	//@media (max-width: 1024px) {
	//	.ant-menu {
	//		.ant-menu-title-content {
	//			display: none; // opcional: esconder texto no tablet
	//		}
	//	}
	//}
`;

export const ChangeRoomToOnOff = styled(Flex)`
	width: 100%;
	padding: 1rem 0;
	justify-content: center;
	align-items: center;
	flex-direction: row;
	gap: 1rem;
	display: ${(props: { ishost: string }) => (props.ishost === 'true' ? "flex" : "none")};

	// Mobile
	@media (max-width: 768px) {
		width: auto;
		padding: 0;
	}
`;



// import styled from "styled-components";
// import {Flex} from "antd";
//
// export const MenuContainer = styled(Flex)`
// 	height: 100%;
// `
//
// export const ChangeRoomToOnOff = styled(Flex)`
// 	width: 100%;
// 	padding: 1rem 0;
// 	justify-content: center;
// 	align-items: center;
// 	flex-direction: row;
// 	gap: 1rem;
// 	display: ${(props: { ishost: string }) => (props.ishost === 'true' ? "flex" : "none")};
// `