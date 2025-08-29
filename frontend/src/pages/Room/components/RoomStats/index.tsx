import { Container, InfoRoom, StatsTitle, StatItem, StatIcon, StatLabel, StatValue } from "./styles.ts";
import { BoomBox, Podcast, User, Shield, Crown } from "lucide-react";
import { useEffect } from "react";

import { useRoomStore } from "../../../../contexts/PlayerContext/useRoomStore";
import { userContext } from "../../../../contexts/UserContext.tsx";
import { useParams } from "react-router-dom";

export default function RoomStats() {
	const { id } = useParams()

	const { getInfoRoom, roomSpecs, roomState, isHost, isModerator, canModerate } = useRoomStore();
	const { user } = userContext();

	useEffect(() => {
		getInfoRoom(id, user);
	}, [getInfoRoom, id, user])

	return (
		<Container>
			<StatsTitle>Informações da Sala</StatsTitle>
			<InfoRoom>
				<StatItem>
					<StatIcon>
						<BoomBox size={20} />
					</StatIcon>
					<StatLabel>Nome da Sala:</StatLabel>
					<StatValue>{roomSpecs.name ? roomSpecs.name : "Carregando..."}</StatValue>
				</StatItem>
				
				<StatItem>
					<StatIcon>
						<Podcast size={20} />
					</StatIcon>
					<StatLabel>Status:</StatLabel>
					<StatValue style={{ 
						color: roomState?.online ? "#52c41a" : "#ff4d4f",
						fontWeight: "500"
					}}>
						{roomState?.online ? "🟢 Online" : "🔴 Offline"}
					</StatValue>
				</StatItem>
				
				<StatItem>
					<StatIcon>
						<User size={20} />
					</StatIcon>
					<StatLabel>Usuários Online:</StatLabel>
					<StatValue>{roomState?.listeners || 0}</StatValue>
				</StatItem>

				<StatItem>
					<StatIcon>
						<Crown size={20} />
					</StatIcon>
					<StatLabel>Dono da Sala:</StatLabel>
					<StatValue style={{ 
						color: isHost ? "#faad14" : "#8c8c8c",
						fontWeight: isHost ? "600" : "400"
					}}>
						{isHost ? "👑 Você" : roomSpecs.owner ? "Usuário" : "Carregando..."}
					</StatValue>
				</StatItem>

				<StatItem>
					<StatIcon>
						<Shield size={20} />
					</StatIcon>
					<StatLabel>Moderador:</StatLabel>
					<StatValue style={{ 
						color: isModerator ? "#1890ff" : "#8c8c8c",
						fontWeight: isModerator ? "600" : "400"
					}}>
						{isModerator ? "🛡️ Sim" : "Não"}
					</StatValue>
				</StatItem>

				<StatItem>
					<StatIcon>
						<Shield size={20} />
					</StatIcon>
					<StatLabel>Pode Moderar:</StatLabel>
					<StatValue style={{ 
						color: canModerate ? "#52c41a" : "#8c8c8c",
						fontWeight: canModerate ? "600" : "400"
					}}>
						{canModerate ? "✅ Sim" : "❌ Não"}
					</StatValue>
				</StatItem>

				{/* Informações da playlist */}
				{roomState?.playlist && (
					<StatItem>
						<StatIcon>
							<BoomBox size={20} />
						</StatIcon>
						<StatLabel>Músicas na Playlist:</StatLabel>
						<StatValue>{roomState.playlist.length}</StatValue>
					</StatItem>
				)}

				{/* Música atual */}
				{roomState?.currentTrack && (
					<StatItem>
						<StatIcon>
							<Podcast size={20} />
						</StatIcon>
						<StatLabel>Música Atual:</StatLabel>
						<StatValue style={{ 
							color: "#1890ff",
							fontWeight: "500",
							fontSize: "12px"
						}}>
							{roomState.currentTrack.title}
						</StatValue>
					</StatItem>
				)}

				{/* Estado de reprodução */}
				<StatItem>
					<StatIcon>
						<Podcast size={20} />
					</StatIcon>
					<StatLabel>Reproduzindo:</StatLabel>
					<StatValue style={{ 
						color: roomState?.playing ? "#52c41a" : "#8c8c8c",
						fontWeight: "500"
					}}>
						{roomState?.playing ? "▶️ Sim" : "⏸️ Não"}
					</StatValue>
				</StatItem>
			</InfoRoom>
		</Container>
	);
}
