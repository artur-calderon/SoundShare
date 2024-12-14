import styled from "styled-components";

const VideoDemoContainer = styled.section`
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.background};

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

const VideoWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  aspect-ratio: 16 / 9;
`;

export default function VideoDemo() {
  return (
    <VideoDemoContainer>
      <Title>Como funciona o Sound Share</Title>
      <VideoWrapper>
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Sound Share Demo Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </VideoWrapper>
    </VideoDemoContainer>
  );
}
