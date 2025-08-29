import {VideoPlayer} from "../../../../components/VideoPlayer";
import {SearchMusic} from "../../../../components/SearchMusic";
import {MainLayout, MainSpace, PlayerSearchContainer, MainTitle} from "./styles.ts";
import { useRoomStore } from "../../../../contexts/PlayerContext/useRoomStore";
import { Tag, Space, Row, Col } from "antd";
import RoomStats from "../RoomStats";

export function Main() {
	const { roomState, roomSpecs, isHost, canModerate } = useRoomStore();

	return (
		<MainLayout>
			<MainSpace>
				<MainTitle>
					SoundShare {isHost ? "Admin" : canModerate ? "Moderador" : "Usuário"}
					<Space style={{ marginLeft: "16px" }}>
						<Tag 
							color={roomState?.online ? "green" : "red"}
							style={{ margin: 0 }}
						>
							{roomState?.online ? "🟢 Online" : "🔴 Offline"}
						</Tag>
						{roomState?.listeners && (
							<Tag color="blue" style={{ margin: 0 }}>
								👥 {roomState.listeners} usuários
							</Tag>
						)}
						{roomState?.playlist && (
							<Tag color="purple" style={{ margin: 0 }}>
								🎵 {roomState.playlist.length} músicas
							</Tag>
						)}
					</Space>
				</MainTitle>
				
				<Row gutter={24} style={{ marginTop: "24px" }}>
					{/* Coluna do Player e Busca */}
					<Col xs={24} lg={16}>
						<PlayerSearchContainer>
							<VideoPlayer />
							<SearchMusic />
						</PlayerSearchContainer>
					</Col>
					
					{/* Coluna das Informações da Sala */}
					<Col xs={24} lg={8}>
						<RoomStats />
					</Col>
				</Row>
			</MainSpace>
		</MainLayout>
	);
}
