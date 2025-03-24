import styled from "styled-components";
import { Flex, Layout } from "antd";
const { Content } = Layout;

export const Container = styled(Content)`
  min-height: 280px;
  background-color: #fff;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  .div-illustration {
    width: 50%;
    height: 100%;
    background-color: #faf5ff;
    display: flex;
    justify-content: center;
  }

  @media screen and (max-width: 568px) {
    flex-direction: column;
    width: 100%;
    padding: 2rem;
    .div-illustration {
      display: none;
    }
    #login {
      width: 100% !important;
    }
  }
`;

export const FlexContent = styled(Flex)`
  width: 100%;
  height: 100%;

  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
