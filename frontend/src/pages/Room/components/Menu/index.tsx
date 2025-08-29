import {useNavigate, useParams} from "react-router-dom";
import {ChangeRoomToOnOff,  MenuContainer, LogoContainer, LogoImage, LogoText, AdminBadge} from "./styles.ts";
import {Power, PowerOff} from "lucide-react";
import {Switch,  Menu, message} from "antd";
import {menuItems} from "./menuItens.tsx";
import {darkRoomTheme} from "../../../../styles/themes/roomTheme.ts";
import {useSocketStore} from "../../../../contexts/PlayerContext/useSocketStore";
import {useRoomStore} from "../../../../contexts/PlayerContext/useRoomStore";
import {useEffect, useState} from "react";

import {motion} from "framer-motion";

export function MenuSide() {
	const navigate = useNavigate();
	const {leaveRoom, toggleRoomStatus} = useSocketStore();
	const {roomSpecs, isHost, canModerate, roomState} = useRoomStore();
	const [roomOnline, setRoomOnline] = useState(roomState?.online || false);
	const {id} = useParams();

	// Estado para controlar o modo do menu
	const [menuMode, setMenuMode] = useState<"inline" | "vertical">("inline");

	// Sincronizar estado local com o estado da sala
	useEffect(() => {
		if (roomState?.online !== undefined) {
			setRoomOnline(roomState.online);
		}
	}, [roomState?.online]);

	useEffect(() => {
		// Função para verificar a largura da tela e definir o modo do menu
		const handleResize = () => {
			if (window.innerWidth <= 768) {
				setMenuMode("vertical");
			} else {
				setMenuMode("inline");
			}
		};

		// Verifica ao carregar o componente
		handleResize();

		// Adiciona o event listener
		window.addEventListener("resize", handleResize);

		// Remove o event listener ao desmontar
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	function menuClick(click: { key: any; }) {
		const { key } = click;
		switch (key) {
			case "sair":
				if (id) {
					leaveRoom();
					navigate("/app");
				}
				break;
			default:
				break;
		}
	}

	function handleChangeRoomOnOff(check: boolean) {
		if (isHost && id) {
			// Usar a nova funcionalidade de socket
			toggleRoomStatus(check);
			setRoomOnline(check);
			
			if (check) {
				message.success("Sala ativada com sucesso");
			} else {
				message.success("Sala desativada com sucesso");
			}
		} else if (!isHost) {
			message.info("Apenas o dono da sala pode ativar/desativar a sala");
		} else {
			message.error("Erro ao alterar status da sala");
		}
	}

	// Verificar se o usuário tem permissão para controlar a sala
	const canControlRoom = isHost;

	return (
		<MenuContainer>
			{/* Logo e Header */}
			<LogoContainer>
				<LogoImage src="/Logo Sound Share ico.svg" alt="SoundShare" />
				<div>
					<LogoText>SoundShare</LogoText>
					<AdminBadge>
						{isHost ? "👑 Admin" : canModerate ? "🛡️ Moderador" : "👤 Usuário"}
					</AdminBadge>
				</div>
			</LogoContainer>
			
			{/* Controle de status da sala */}
			<ChangeRoomToOnOff ishost={canControlRoom.toString()}>
				<PowerOff size={20} color={darkRoomTheme.token.colorPrimary}/>
				<motion.div layout transition={{type: 'spring', stiffness: 300, damping: 20}}>
					<Switch
						checked={roomOnline}
						onChange={handleChangeRoomOnOff}
						checkedChildren="Online"
						unCheckedChildren="Offline"
						disabled={!canControlRoom}
					/>
				</motion.div>
				<Power size={20} color={darkRoomTheme.token.colorPrimary}/>
			</ChangeRoomToOnOff>
			
			<div
				style={{padding: "0 1rem", borderBottom: `0.01px solid ${darkRoomTheme.token.colorPrimary}`}}
			></div>
			
			<Menu mode={menuMode} items={menuItems} onClick={menuClick}/>
		</MenuContainer>
	);
}