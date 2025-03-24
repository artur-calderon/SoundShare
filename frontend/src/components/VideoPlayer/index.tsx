import {Player, SpaceContainer} from "./styles.ts";
import {Alert, Empty, Flex} from "antd";
import Marquee from "react-fast-marquee";
import ReactPlayer from "react-player/lazy";
import emptyVideo from "../../../public/emptyVideoWhite.svg";
import {usePlayerStore} from "../../contexts/PlayerContext/usePlayerStore";
import {usePlaylistStore} from "../../contexts/PlayerContext/usePlaylistStore";
import {useRoomStore} from "../../contexts/PlayerContext/useRoomStore";
import {useEffect, useRef, useState} from "react";
import {useSocketStore} from "../../contexts/PlayerContext/useSocketStore";
import {useParams} from "react-router-dom";
import {Simulate} from "react-dom/test-utils";
import playing = Simulate.playing;



export function VideoPlayer() {
	const {isPlaying, volume, mute, play, setPlayed, setDuration, setIsPlaying} = usePlayerStore()
	const {roomState, isHost} = useRoomStore()
	const {socket} = useSocketStore()
	const {nextSong} = usePlaylistStore()

	const playerRef = useRef<ReactPlayer>(null)
	const {id} = useParams()
	console.log(id)
	useEffect(() => {

		//recebe a sincronização do servidor


		// return () => {
		// 	socket?.off('updateRoom')
		// 	socket?.off('updatePlayed')
		// }

	}, [isHost, socket]);


	socket?.on('updatePlayed', ({played})=>{
		console.log(played)
		if(!isHost && playerRef.current){
			playerRef.current.seekTo(played,"fraction")
		}
	})

	console.log(isHost)

	const handleProgress = (state: {played: number}) =>{
		if(isHost){
			socket?.emit('syncTrack', {roomId:id,played: state.played})
		}
		setPlayed(state.played)
	}

	useEffect(() => {
		if(roomState?.playing){
			setIsPlaying(roomState?.playing)
		}
	}, [roomState?.currentTrack]);

	return (
		<SpaceContainer
			direction={"vertical"}
		>
			{isPlaying ? (
				<Alert
					banner
					type="info"
					key={roomState?.currentTrack?.url}
					style={{width: "100%", backgroundColor:'inherit'}}
					showIcon={false}
					message={
						<Marquee pauseOnHover gradient={false}>
							<b>Tocando agora </b>
							<span>
                                {":  " + roomState?.currentTrack?.title}
                            </span>
							<b style={{marginLeft: "15px"}}> Enviado por: </b>
							<span style={{marginRight: "5px"}}>
                                {roomState?.currentTrack?.user?.name}
                            </span>
						</Marquee>
					}
				/>
			) : null}

			<Player>
				{isPlaying ? (
					<ReactPlayer
						ref={playerRef}
						url={roomState?.currentTrack?.url}
						controls={true}
						width={"100%"}
						height={"25rem"}
						autoPlay={true}
						volume={volume}
						muted={mute}
						playing={play}
						onProgress={handleProgress}
						onEnded={nextSong}
						onDuration={setDuration}
					></ReactPlayer>
				) : (
					<Flex style={{width: "100%"}} align="center" justify="center">
						<Empty
							description="Nenhum vídeo adicionado"
							image={emptyVideo}
							style={{color: "black"}}
						/>
					</Flex>
				)}
			</Player>
		</SpaceContainer>
	);
}

