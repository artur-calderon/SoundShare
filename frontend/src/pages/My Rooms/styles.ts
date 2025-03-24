import styled from "styled-components";

import { Space, Flex, Modal } from "antd";

export const Container = styled(Space)`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  align-items: flex-start;
`;

export const RoomContainer = styled(Flex)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem !important;

  width: 100%;
`;

export const ModalCreateRoom = styled(Modal)`
  background-color: red;
`;
