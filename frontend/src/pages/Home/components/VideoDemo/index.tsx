import {Title, VideoDemoContainer, VideoWrapper} from "./styles.ts";

export function VideoDemo() {
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