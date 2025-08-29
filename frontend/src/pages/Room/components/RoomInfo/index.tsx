import { Avatar, Typography, Button, Space, Tag, Divider, message } from "antd";
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import { useRoomStore } from "../../../../contexts/PlayerContext/useRoomStore";
import { useSocketStore } from "../../../../contexts/PlayerContext/useSocketStore";
import { useParams } from "react-router-dom";
import { RoomInfoContainer, RoomInfoSection, RoomInfoTitle, RoomInfoItem, MembersList, MemberItem, MemberAvatar, MemberName, OnlineStatus } from "./styles";
import RoomStats from "../RoomStats";

const { Text, Title } = Typography;

export function RoomInfo() {
	const { roomState, roomSpecs, isHost, canModerate } = useRoomStore();
	const { kickUser, toggleModerator } = useSocketStore();
	const { id } = useParams();

	// Função para expulsar usuário
	const handleKickUser = (userId: string, reason?: string) => {
		if (canModerate) {
			kickUser(userId, reason);
			message.success("Usuário expulso com sucesso");
		} else {
			message.info("Apenas donos e moderadores podem expulsar usuários");
		}
	};

	// Função para adicionar/remover moderador
	const handleToggleModerator = (userId: string, isModerator: boolean) => {
		if (isHost) {
			toggleModerator(userId, isModerator);
			message.success(`Usuário ${isModerator ? 'promovido a' : 'removido de'} moderador`);
		} else {
			message.info("Apenas o dono da sala pode gerenciar moderadores");
		}
	};

	// Função para convidar membros (placeholder)
	const handleInviteMembers = () => {
		message.info("Funcionalidade de convite em desenvolvimento");
	};

	// Formatar data de criação (se disponível)
	const formatCreationDate = (dateString?: string) => {
		if (!dateString) return "Data não disponível";
		try {
			return new Date(dateString).toLocaleDateString('pt-BR');
		} catch {
			return "Data não disponível";
		}
	};

	// Formatar última atividade
	const formatLastActivity = () => {
		// Por enquanto, mostra "Agora" se a sala estiver online
		return roomState?.online ? "Agora" : "Offline";
	};

	return (
		<RoomInfoContainer>
			{/* RoomStats - Informações da Sala */}
			<RoomInfoSection>
				<RoomStats />
			</RoomInfoSection>

			<Divider style={{ margin: "24px 0" }} />

			{/* Membros Online */}
			<RoomInfoSection>
				<RoomInfoTitle level={5}>Membros online ({roomState?.listeners || 0})</RoomInfoTitle>
				
				<MembersList>
					{roomState?.users && roomState.users.length > 0 ? (
						roomState.users.map((member) => (
							<MemberItem key={member.id}>
								<MemberAvatar>
									<Avatar 
										src={member.image} 
										size="small"
										icon={<UserOutlined />}
									/>
								</MemberAvatar>
								<MemberName>
									<Text>{member.name}</Text>
									<Tag 
										color={
											member.role === 'owner' ? 'gold' : 
											member.role === 'moderator' ? 'blue' : 'default'
										}
										style={{ marginLeft: "8px", fontSize: "10px" }}
									>
										{member.role === 'owner' ? '👑 Dono' : 
										 member.role === 'moderator' ? '🛡️ Mod' : '👤 Usuário'}
									</Tag>
								</MemberName>
								<OnlineStatus>
									<span style={{ 
										display: "inline-block", 
										width: "8px", 
										height: "8px", 
										background: "#52c41a", 
										borderRadius: "50%" 
									}} />
								</OnlineStatus>
								
								{/* Ações de moderação */}
								{canModerate && member.id !== roomSpecs?.owner && (
									<Space size="small" style={{ marginLeft: "auto" }}>
										{/* Adicionar/Remover moderador (apenas dono) */}
										{isHost && member.role !== 'owner' && (
											<Button
												size="small"
												type={member.role === 'moderator' ? 'default' : 'primary'}
												onClick={() => handleToggleModerator(
													member.id, 
													member.role !== 'moderator'
												)}
												style={{ fontSize: "10px", padding: "0 4px" }}
											>
												{member.role === 'moderator' ? '❌ Remover Mod' : '🛡️ Tornar Mod'}
											</Button>
										)}
										
										{/* Expulsar usuário */}
										<Button
											size="small"
											type="text"
											danger
											onClick={() => handleKickUser(member.id, 'Expulso pelo moderador')}
											style={{ fontSize: "10px", padding: "0 4px" }}
										>
											🚪 Expulsar
										</Button>
									</Space>
								)}
							</MemberItem>
						))
					) : (
						<Text type="secondary" style={{ textAlign: "center", display: "block" }}>
							Nenhum membro online
						</Text>
					)}
				</MembersList>
				
				<Button 
					type="primary" 
					icon={<UserAddOutlined />}
					onClick={handleInviteMembers}
					style={{ 
						width: "100%", 
						marginTop: "16px",
						borderRadius: "8px",
						height: "40px"
					}}
				>
					Convidar membros
				</Button>
			</RoomInfoSection>
		</RoomInfoContainer>
	);
}
