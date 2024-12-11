import styled from "styled-components";

export const Card = styled.div`
  width: 484px;
  height: 504px;

  div.header {
    width: 100%;
    position: relative;
    height: 10rem;
    padding: 1rem;
    display: flex;
    z-index: 2;
    margin-bottom: 0.5rem;

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url(${(props) => props.$cover}) no-repeat center/cover;
      filter: blur(2px);
      z-index: -1;
    }

    div.cover {
      width: 30%;
      height: auto;
      border: 1px solid #fff;
      background: url(${(props) => props.$cover}) no-repeat center/contain;
    }

    div.info {
      color: #ffffff;
      width: 70%;
      padding: 0.3rem 1rem;
      display: flex;
      flex-direction: column;
      background-color: #343750;
      opacity: 0.9;
      border-radius: 2px;
      .editIcon {
        cursor: pointer;
      }
      .title {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.2rem;
      }
      .badges-vip {
        img {
          width: auto;
          object-fit: fill;
        }
      }
    }
  }

  div.descriptionHeader {
    width: 100%;
    display: flex;
    flex-direction: column;

    span {
      width: 5rem;
      background-color: #f0f0f0;
      font-weight: bold;
      color: #989595;
      text-align: center;
      padding: 0.1rem;
      border-radius: 0.2rem;
      margin-bottom: 0.2rem;
    }

    div {
      width: 100%;
      background-color: #f0f0f0;
      height: 8rem;
      padding: 1rem;
      margin-bottom: 0.2rem;
      border-radius: 0.2rem;
    }
  }

  div.badges {
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 0.2rem;

    span {
      width: 5rem;
      background-color: #f0f0f0;
      font-weight: bold;
      color: #989595;
      text-align: center;
      padding: 0.1rem;
      border-radius: 0.2rem;
      margin-bottom: 0.2rem;
    }
  }
`;
