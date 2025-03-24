import {PlayerControlsContainer} from "./styles.ts";
import {usePlayerStore} from "../../../../contexts/PlayerContext/usePlayerStore";
import {Flex, Progress, Slider, Typography} from "antd";
import {ChevronDown, ChevronUp, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX} from "lucide-react";
import Duration from "./Duration";
import {usePlaylistStore} from "../../../../contexts/PlayerContext/usePlaylistStore";
import {useRoomStore} from "../../../../contexts/PlayerContext/useRoomStore";


export function PlayerControls(){
	const {Title} = Typography;

	const {isPlaying, setVolume, setMute, mute, setPlay, play, duration, played
	} = usePlayerStore();
	const {nextSong, beforeSong} = usePlaylistStore()
	const {roomState} = useRoomStore()

	return(
		<PlayerControlsContainer>
			{isPlaying ? <Progress percent={played * 100} status="active" showInfo={false} />: null}

			<Flex>
				<Flex
					style={{ width: "20%" }}
					justify="flex-start"
					align="center"
					horizontal="horizontal"
					gap={10}
				>
					<SkipBack
						strokeWidth={1.5}
						size={25}
						style={{ fontSize: "2.1rem", cursor: "pointer" }}
						onClick={() => beforeSong()}
					/>
					{play ? (
						<Pause
							strokeWidth={1.5}
							size={35}
							style={{ fontSize: "2.2rem", cursor: "pointer" }}
							onClick={() => setPlay()}
						/>
					) : (
						<Play
							strokeWidth={1.5}
							size={35}
							style={{ fontSize: "2.2rem", cursor: "pointer" }}
							onClick={() => setPlay()}
						/>
					)}
					<SkipForward
						strokeWidth={1.5}
						size={25}
						style={{ fontSize: "2.1rem", cursor: "pointer" }}
						onClick={() => nextSong()}
					/>
					<span style={{ width: "7rem" }}>
		            <Duration seconds={duration * played} />/
		            <Duration seconds={duration} />
          </span>
				</Flex>
				<Flex
					horizontal="horizontal"
					gap={20}
					style={{ width: "60%" }}
					align="center"
					justify="center"
				>
					<img
						alt="album cover"
						src={roomState?.currentTrack?.thumbnail ?? ''}
						width="100rem"
					/>
					<Flex vertical="vertical" justify="flex-start" align="flex-start">
						<Title level={5}>{roomState?.currentTrack?.title?? null}</Title>
						<span>{roomState?.currentTrack?.description ?? null}</span>
					</Flex>
				</Flex>
				<Flex
					horizontal="horizontal"
					style={{ width: "20%" }}
					align="center"
					justify="center"
					gap={20}
				>
					<span>Volume</span>
					<Slider
						style={{ width: "inherit" }}
						defaultValue={0.8}
						onChange={(value) => setVolume(value)}
						min={0}
						max={1}
						step={0.01}
						tooltip={{
							formatter: null,
						}}
					/>
					{mute ? (
						<VolumeX
							strokeWidth={1.5}
							style={{ fontSize: "1rem", cursor: "pointer" }}
							onClick={() => setMute()}
						/>
					) : (
						<Volume2
							strokeWidth={1.5}
							style={{ fontSize: "1rem", cursor: "pointer" }}
							onClick={() => setMute()}
						/>
					)}
					{isPlaying ? (
						<ChevronDown
							size={20}
							style={{ cursor: "pointer", marginLeft: "10px" }}
							// onClick={() => changeSearchToPlayer()}
						/>
					) : (
						<ChevronUp
							size={20}
							style={{ cursor: "pointer", marginLeft: "10px" }}
							// onClick={() => changeSearchToPlayer()}
						/>
					)}
				</Flex>
			</Flex>
		</PlayerControlsContainer>
	)
}