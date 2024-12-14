import styled from "styled-components";

const IntegrationsContainer = styled.section`
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

const LogoGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const LogoWrapper = styled.div`
  width: 100px;
  height: 100px;
  position: relative;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

export default function Integrations() {
  const platforms = [
    { name: "Spotify", logo: "/spotify-logo.png" },
    { name: "Apple Music", logo: "/apple-music-logo.png" },
    { name: "Deezer", logo: "/deezer-logo.png" },
    { name: "YouTube Music", logo: "/youtube-music-logo.png" },
  ];

  return (
    <IntegrationsContainer>
      <Title>Conecte-se com suas plataformas favoritas</Title>
      <LogoGrid>
        {platforms.map((platform) => (
          <LogoWrapper key={platform.name}>
            <img src={platform.logo} alt={`${platform.name} logo`} />
          </LogoWrapper>
        ))}
      </LogoGrid>
    </IntegrationsContainer>
  );
}
