import styled from "styled-components";

export const Header = styled.header`
  display: flex;
  position: relative;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;

  h3 {
    margin-top: 4rem;
  }

  div {
    display: flex;
    gap: 0.2rem;
    cursor: pointer;
  }
  @media screen and (max-width: 568px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const RoomCover = styled.div`
  width: 100%;
  position: relative;
  height: 10rem;
  padding: 1rem;
  display: flex;
  gap: 3rem;
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
  img {
    width: 8rem;
  }

  @media screen and (min-width: 568px) {
    flex-direction: column;
  }
`;

export const SearchResults = styled.div`
  overflow: scroll;
  height: 100%;
`;
