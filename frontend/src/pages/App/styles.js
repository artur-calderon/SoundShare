import styled from "styled-components";
import { Flex, Layout } from "antd";

const { Sider } = Layout;

export const Container = styled(Flex)`
  //padding: 5rem 0;
  div.userInfo {
    color: white;
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
