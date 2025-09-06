import { useState } from "react";
import { PlayerControlsContainer } from "./styles.ts";
import { usePlayerStore } from "../../../../contexts/PlayerContext/usePlayerStore";
import { useSocketStore } from "../../../../contexts/PlayerContext/useSocketStore";
import { usePlaylistStore } from "../../../../contexts/PlayerContext/usePlaylistStore";
import { useRoomStore } from "../../../../contexts/PlayerContext/useRoomStore";
import { Flex, Progress, Slider, Typography, message } from "antd";

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

import useBreakpoint from "antd/es/grid/hooks/useBreakpoint.js";

export function PlayerControls() {
	const { Title } = Typography;

	const { isPlaying, setVolume, toggleMute, mute, duration, played, volume, currentTrack } = usePlayerStore();
	const { roomState, canModerate } = useRoomStore();
	const { playPause, nextTrack, previousTrack } = useSocketStore();

	const [minimized, setMinimized] = useState(false);
	const screens = useBreakpoint();

	const toggleMinimize = () => setMinimized(!minimized);

	const openPlaylist = () => {
		const event = new Event("openPlaylistDrawer");
		window.dispatchEvent(event);
	}

	// Função para controlar play/pause com verificação de permissões
	const handlePlayPause = () => {
		if (canModerate) {
			playPause(!isPlaying);
		} else {
			message.info("Apenas donos e moderadores podem controlar a reprodução");
		}
	};

	// Função para próxima música com verificação de permissões
	const handleNextTrack = () => {
		if (canModerate) {
			nextTrack();
		} else {
			message.info("Apenas donos e moderadores podem controlar a reprodução");
		}
	};

	// Função para música anterior com verificação de permissões
	const handlePreviousTrack = () => {
		if (canModerate) {
			previousTrack();
		} else {
			message.info("Apenas donos e moderadores podem controlar a reprodução");
		}
	};



	// ✅ NOVO: Se não há música atual, não renderiza nada
	if (!currentTrack && !roomState?.currentTrack) {
		return null;
	}

	// ✅ NOVO: Se está minimizado, mostra apenas a arrow para expandir
	if (minimized) {
		return (
			<PlayerControlsContainer minimized={true}>
				<Flex justify="center" align="center" style={{ padding: "8px" }}>
					<ChevronUp 
						size={20} 
						style={{ 
							cursor: "pointer", 
							color: "#ffffff",
							backgroundColor: "rgba(255,255,255,0.2)", // ✅ CORREÇÃO: Fundo mais claro para visibilidade
							padding: "8px",
							borderRadius: "50%",
							border: "1px solid rgba(255,255,255,0.3)" // ✅ CORREÇÃO: Borda sutil para contraste
						}} 
						onClick={toggleMinimize} 
					/>
				</Flex>
			</PlayerControlsContainer>
		);
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
						style={{ 
							cursor: canModerate ? "pointer" : "not-allowed", 
							opacity: canModerate ? 1 : 0.5,
							color: "#ffffff"
						}}
						onClick={handlePreviousTrack}
					/>

					{isPlaying ? (
						<Pause
							strokeWidth={1.5}
							size={35}
							style={{ 
								cursor: canModerate ? "pointer" : "not-allowed", 
								opacity: canModerate ? 1 : 0.5,
								color: "#1db954"
							}}
							onClick={handlePlayPause}
						/>
					) : (
						<Play
							strokeWidth={1.5}
							size={35}
							style={{ 
								cursor: canModerate ? "pointer" : "not-allowed", 
								opacity: canModerate ? 1 : 0.5,
								color: "#1db954"
							}}
							onClick={handlePlayPause}
						/>
					)}

					<SkipForward
						strokeWidth={1.5}
						size={25}
						style={{ 
							cursor: canModerate ? "pointer" : "not-allowed", 
							opacity: canModerate ? 1 : 0.5,
							color: "#ffffff"
						}}
						onClick={handleNextTrack}
					/>

					{!minimized && (
						<span style={{ 
							width: "7rem",
							color: "#ffffff"
						}}>
							<Duration seconds={duration * played} /> / <Duration seconds={duration} />
						</span>
					)}
				</Flex>

				{/* Info da música */}
				{!minimized && (
					<Flex gap={20} style={{ width: "60%" }} align="center" justify="center">
						<img
							alt="album cover"
							src={currentTrack?.thumbnail || roomState?.currentTrack?.thumbnail || ""}
						/>
						<Flex vertical justify="flex-start" align="flex-start">
							<Title level={5} style={{ color: "#ffffff", margin: 0 }}>
								{currentTrack?.title || roomState?.currentTrack?.title || "Sem título"}
							</Title>
							<span style={{ 
								color: "#e0e0e0",
								fontSize: "12px",
								maxWidth: "300px",
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap"
							}}>
								{currentTrack?.description || roomState?.currentTrack?.description || "Sem descrição"}
							</span>
						</Flex>
					</Flex>
				)}

				{/* Controle de volume */}
				<Flex style={{ width: "20%" }} align="center" justify="center" gap={15}>
					{!minimized && <span style={{ color: "#ffffff" }}>Volume</span>}

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
							style={{ 
								cursor: "pointer",
								color: "#ffffff"
							}}
							onClick={openPlaylist}
						/>
					)}

					{/* Botão de mudo */}
					{mute ? (
						<VolumeX 
							strokeWidth={1.5} 
							style={{ 
								cursor: "pointer",
								color: "#ffffff"
							}} 
							onClick={() => toggleMute()} 
						/>
					) : (
						<Volume2 
							strokeWidth={1.5} 
							style={{ 
								cursor: "pointer",
								color: "#ffffff"
							}} 
							onClick={() => toggleMute()} 
							size={25} 
						/>
					)}

					{/* Botão de minimizar */}
					<ChevronDown 
						size={20} 
						style={{ 
							cursor: "pointer", 
							marginLeft: "10px",
							color: "#ffffff"
						}} 
						onClick={toggleMinimize} 
					/>
				</Flex>
			</Flex>
		</PlayerControlsContainer>
	);
}
