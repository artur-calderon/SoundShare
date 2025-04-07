import { Player, SpaceContainer } from "./styles.ts";
import { Alert, Empty, Flex } from "antd";
import Marquee from "react-fast-marquee";
import ReactPlayer from "react-player/lazy";
import emptyVideo from "../../../public/emptyVideoWhite.svg";
import { usePlayerStore } from "../../contexts/PlayerContext/usePlayerStore";
import { usePlaylistStore } from "../../contexts/PlayerContext/usePlaylistStore";
import { useRoomStore } from "../../contexts/PlayerContext/useRoomStore";
import { useEffect, useRef, useCallback } from "react";
import { useSocketStore } from "../../contexts/PlayerContext/useSocketStore";
import { useParams } from "react-router-dom";
import RoomStats from "../../pages/Room/components/RoomStats";

import useBreakpoint from "antd/es/grid/hooks/useBreakpoint.js";

export function VideoPlayer() {
	const { isPlaying, volume, mute, play, setPlayed, setDuration, setIsPlaying } = usePlayerStore();
	const { roomState, isHost,  played } = useRoomStore();
	const { socket } = useSocketStore();
	const { nextSong } = usePlaylistStore();

	const playerRef = useRef<ReactPlayer>(null);
	const { id } = useParams();

	const screens = useBreakpoint();
	
	// // Sincroniza o progresso do vídeo
	useEffect(() => {
		if(play && !isHost){
			if (played && playerRef.current) {
				playerRef.current.seekTo(played, "fraction");
			}
		}
	}, [play, isHost]);

	// Função otimizada para emitir o progresso do vídeo
	const handleProgress = useCallback((state: { played: number }) => {
		if (isHost) {
			requestAnimationFrame(() => {
				socket?.emit("syncTrack", { roomId: id, played: state.played });
			});
		}
		setPlayed(state.played);
	}, [isHost, socket, id, setPlayed]);

	// Atualiza o estado de reprodução apenas se houver mudança
	useEffect(() => {
		if (roomState?.playing !== isPlaying) {
			setIsPlaying(roomState?.playing);
		}
	}, [roomState?.playing, isPlaying, setIsPlaying]);

	return (
		<SpaceContainer direction={"vertical"}>
			{isPlaying && (
				<Alert
					banner
					type="info"
					className={"alert-player"}
					key={roomState?.currentTrack?.url}
					style={{ width: "100%", backgroundColor: "inherit" }}
					showIcon={false}
					message={
						<Marquee pauseOnHover gradient={false}>
							<b>Tocando agora </b>
							<span>{":  " + roomState?.currentTrack?.title}</span>
							<b style={{ marginLeft: "15px" }}> Enviado por: </b>
							<span style={{ marginRight: "5px" }}>{roomState?.currentTrack?.user?.name}</span>
						</Marquee>
					}
				/>
			)}

			<Player>
				<div className='player-overlay' />
				{isPlaying ? (
					<ReactPlayer
						ref={playerRef}
						url={roomState?.currentTrack?.url}
						controls={false}
						width={"100%"}
						// height={"25rem"}
						autoPlay={true}
						volume={volume}
						muted={mute}
						playing={play}
						onProgress={handleProgress}
						onEnded={() => nextSong && nextSong()}
						onDuration={setDuration}
					/>
				) : (
					<Flex style={{ width: "100%" }} align="center" justify="center">
						<Empty description="Nenhum vídeo adicionado" image={emptyVideo} style={{ color: "black" }} />
					</Flex>
				)}
			</Player>
			{screens.md && (
				<RoomStats/>
			)}
		</SpaceContainer>
	);
}
