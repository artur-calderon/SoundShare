import styled from "styled-components";

const primary = "#f5c249";
const background = "#141620";
const backgroundDark = "#060606";
const white = "#ffffff";

export const Menu = styled.div`
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
`;
