import styled from "styled-components";
import {Drawer, Flex, Layout} from "antd";

const { Sider } = Layout;

export const Container = styled(Flex)`
  //padding: 5rem 0;
  div.userInfo {
    color: white;
  }

    .ant-drawer-body {
        background-color: red;
        color: white;
        width: 100%;
        text-align: center;
    }
`;

export const SiderC = styled(Sider)`
  color: white;

  div.demo-logo-vertical {
    padding: 1rem;
    margin: 2rem 0;
  }

  div.userInfo {
    width: 100%;
    text-align: center;
  }
	
`;

export const DrawerC = styled(Drawer)`
    .ant-drawer-body {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
	    color: white;
	    padding: 12rem;
    }
	.ant-drawer-header-title{
		flex: none;
		margin-right: 1rem;
	}
	.ant-drawer-body .userInfo{
		width: 100%;
		text-align: center;
		margin:2rem 0;
	}
	.ant-drawer-body .menu{
		width: 100%;
		color: white;
		background-color: initial;
		font-size: 1.1rem;
		
	}
;
`
