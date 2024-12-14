import styled from "styled-components";
import { Layout } from "antd";

const { Header, Content, Footer } = Layout;

const primary = "#f5c249";
const background = "#141620";
const backgroundDark = "#060606";
const white = "#ffffff";

export const ContainerContent = styled(Content)`
  min-height: 280px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: ${white};
`;

export const MenuDesktop = styled.div`
  font-size: 1rem;
  display: flex;
  flexdirection: row;
  width: 50%;
  gap: 2rem;
  align-items: center;
  ul {
    display: flex;
    flexdirection: row;
    width: 50%;
    gap: 2rem;
    list-style: none;
    cursor: pointer;
  }
  a {
    font-weight: 500;
  }
  a.signup {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    width: 6rem;
    background-color: ${primary};
    padding: 0 0.2rem;
    border-radius: 5rem;
  }
`;

export const MenuMobile = styled.div`
  @media screen and (max-width: 568px) {
    font-size: 1rem;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #fff;
    color: white;
    z-index: 1000;
    ul {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      gap: 2rem;
      list-style: none;
      cursor: pointer;
    }
    a {
      font-weight: 500;
    }
    a.signup {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      width: 6rem;
      background-color: ${primary};
      padding: 0 0.2rem;
      border-radius: 5rem;
    }
  }
  .closeBtn {
    top: 0;
    right: 0;
    position: absolute;
  }
`;

export const HeaderC = styled(Header)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  align-items: center;
  height: 5rem;
  background-color: #fff;
  .mobileMenu {
    display: none;
  }
  ${MenuMobile} {
    display: ${(props) => (props.open ? "flex" : "none")};
  }
  @media screen and (max-width: 568px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 2rem;
    ${MenuDesktop} {
      display: none;
    }
    .mobileMenu {
      display: flex;
    }
    ${MenuMobile} {
      display: ${(props) => (props.open ? "flex" : "none")};
    }
  }
`;
export const HeroSection = styled.div`
  width: 100%;
  font-family: "Inter", sans-serif;
  padding: 6rem 1rem;
  border-radius: 0.3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  h1 {
    font-size: 40px;
    font-weight: bold;
  }
  ul li {
    list-style: none;
    font-size: 1.6rem;
    font-weight: 500;
  }
  ul li img {
    width: 1rem;
  }
  div.text a.signup {
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    width: 10rem;
    background-color: ${primary};
    padding: 1rem 2rem;
    border-radius: 5rem;
  }
  div.animation,
  div.text {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 50%;
  }
  div.animation {
    width: 50rem;
  }

  .cadastre {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  @media screen and (max-width: 568px) {
    flex-direction: column;
    width: 100%;
    padding: 2rem;
    div.text {
      width: 100%;
    }
    h1 {
      font-size: 1.2rem;
    }
    div.animation {
      width: 25rem;
    }
  }
`;

export const FeatureSection = styled.div`
  width: 100%;
  color: #243e63;
  font-family: "Inter", sans-serif;
  padding: 6rem 1rem;
  border-radius: 0.3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 568px) {
    width: 100%;
    h1 {
      font-size: 1.2rem;
    }
  }
`;

export const FooterContainer = styled(Footer)`
  padding: 0 225px;
  background-color: #fff;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 568px) {
    width: 100%;
    padding: 1rem;
  }
`;
