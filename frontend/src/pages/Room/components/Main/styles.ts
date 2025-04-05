import styled from 'styled-components';
import { Layout } from 'antd';

export const MainLayout = styled(Layout)`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
`;

export const MainSpace = styled.div`
	flex: 1;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	width: 100%;
	
	@media (max-width: 768px) {
		padding: 0;
	}
	
`;

export const PlayerSearchContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1.5rem;

	@media (max-width: 1024px) {
		grid-template-columns: 1fr;
	}
`;



// import styled from "styled-components";
// import {Layout} from "antd";
//
//
// export const MainLayout = styled(Layout)`
// 	height: 100%;
// 	width: 100%;
// 	display: flex;
// 	flex-direction: row;
//
//
// `
//
// export const MainSpace = styled.div`
//     display: flex;
// 	flex-direction: column;
//     height: 100%;
//     width: 100%;
//     padding: 1rem;
//
//
// `