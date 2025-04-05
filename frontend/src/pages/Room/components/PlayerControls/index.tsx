import { useState } from "react";
import { PlayerControlsContainer } from "./styles.ts";
import { usePlayerStore } from "../../../../contexts/PlayerContext/usePlayerStore";
import { Flex, Progress, Slider, Typography } from "antd";

import {
	ChevronDown,
	ChevronUp,
	Pause,
	Play,
	SkipBack,
	SkipForward,
	Volume2,
	VolumeX,
	ListMusic
} from "lucide-react";
import Duration from "./Duration";
import { usePlaylistStore } from "../../../../contexts/PlayerContext/usePlaylistStore";
import { useRoomStore } from "../../../../contexts/PlayerContext/useRoomStore";

import useBreakpoint from "antd/es/grid/hooks/useBreakpoint.js";

export function PlayerControls() {
	const { Title } = Typography;

	const { isPlaying, setVolume, toggleMute, mute, togglePlay, play, duration, played, volume } = usePlayerStore();
	const { nextSong, beforeSong } = usePlaylistStore();
	const { roomState } = useRoomStore();

	const [minimized, setMinimized] = useState(false);
	const screens = useBreakpoint();


	const toggleMinimize = () => setMinimized(!minimized);

	const openPlaylist = () => {
		const event = new Event("openPlaylistDrawer");
		window.dispatchEvent(event);
	}


	return (
		<PlayerControlsContainer minimized={minimized}>
			{isPlaying && <Progress percent={played * 100} status="active" showInfo={false} />}

			<Flex align="center" justify="space-between">
				{/* Controles de reprodução */}
				<Flex style={{ width: "20%" }} justify="flex-start" align="center" gap={10}>
					<SkipBack
						strokeWidth={1.5}
						size={25}
						style={{ cursor: "pointer" }}
						onClick={beforeSong}
					/>

					{play ? (
						<Pause
							strokeWidth={1.5}
							size={35}
							style={{ cursor: "pointer" }}
							onClick={() => togglePlay()}
						/>
					) : (
						<Play
							strokeWidth={1.5}
							size={35}
							style={{ cursor: "pointer" }}
							onClick={() => togglePlay()}
						/>
					)}

					<SkipForward
						strokeWidth={1.5}
						size={25}
						style={{ cursor: "pointer" }}
						onClick={nextSong}
					/>

					{!minimized && (
						<span style={{ width: "7rem" }}>
							<Duration seconds={duration * played} /> / <Duration seconds={duration} />
						</span>
					)}
				</Flex>

				{/* Info da música */}
				{!minimized && (
					<Flex gap={20} style={{ width: "60%" }} align="center" justify="center">
						<img
							alt="album cover"
							src={roomState?.currentTrack?.thumbnail || ""}
						/>
						<Flex vertical justify="flex-start" align="flex-start">
							<Title level={5}>{roomState?.currentTrack?.title || "Sem título"}</Title>
							<span>{roomState?.currentTrack?.description || "Sem descrição"}</span>
						</Flex>
					</Flex>
				)}

				{/* Controle de volume */}
				<Flex style={{ width: "20%" }} align="center" justify="center" gap={15}>
					{!minimized && <span>Volume</span>}

					{screens.md && !minimized && (
						<Slider
							style={{ width: "inherit" }}
							value={volume}
							onChange={setVolume}
							min={0}
							max={1}
							step={0.01}
							tooltip={{ formatter: null }}
						/>
					)}
					{/* Botão de abrir a playlist */}
					{!screens.md && (
						<ListMusic
							strokeWidth={1.5}
							size={30}
							style={{ cursor: "pointer" }}
							onClick={openPlaylist}
						/>
					)}

					{/* Botão de mudo */}

					{mute ? (
						<VolumeX strokeWidth={1.5} style={{ cursor: "pointer" }} onClick={() => toggleMute()} />
					) : (
						<Volume2 strokeWidth={1.5} style={{ cursor: "pointer" }} onClick={() => toggleMute()} size={minimized ? 25 : 25} />
					)}

					{/* Botão de minimizar/maximizar */}


					{minimized ? (
						<ChevronUp size={20} style={{ cursor: "pointer", marginLeft: "10px" }} onClick={toggleMinimize} />
					) : (
						<ChevronDown size={20} style={{ cursor: "pointer", marginLeft: "10px" }} onClick={toggleMinimize} />
					)}
				</Flex>
			</Flex>
		</PlayerControlsContainer>
	);
}
