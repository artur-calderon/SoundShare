import {useNavigate, useParams} from "react-router-dom";
import {ChangeRoomToOnOff,  MenuContainer} from "./styles.ts";
import {Power, PowerOff} from "lucide-react";
import {Switch,  Menu, } from "antd";
import {Header} from "./components/Header";
import {menuItems} from "./menuItens.tsx";
import {darkRoomTheme} from "../../../../styles/themes/roomTheme.ts";
import {useSocketStore} from "../../../../contexts/PlayerContext/useSocketStore";
import {useRoomStore} from "../../../../contexts/PlayerContext/useRoomStore";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";

import {motion} from "framer-motion";

export function MenuSide() {
	const navigate = useNavigate();
	const {leaveRoom} = useSocketStore()
	const {changeRoomOnOffline, isHost, roomSpecs} = useRoomStore()
	const [roomOnlinee, setRoomOnline] = useState(roomSpecs.online)
	const {id} = useParams();

	// Estado para controlar o modo do menu
	const [menuMode, setMenuMode] = useState<"inline" | "vertical">("inline");

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
					leaveRoom(id)
					navigate("/app");
				// localStorage.removeItem("insideRoom");
		}
	}

	function  handleChangeRoomOnOff(check: boolean){
		if(isHost){
			changeRoomOnOffline(check, id).then(()=>{
				toast.success(`Sala ${check ? "Online" : "Offline"}`)
				setRoomOnline(check)
			}).catch((e) => {
				toast.error("Erro ao mudar o status da sala")
			})
		}

	}

	return (
			<MenuContainer
				vertical={true}
			>
				<Header />
				<ChangeRoomToOnOff ishost={isHost.toString()}>
					<PowerOff size={20} color={darkRoomTheme.token.colorPrimary}/>
					<motion.div layout transition={{type: 'spring', stiffness: 300, damping: 20}}>
						<Switch
							checked={roomOnlinee}
							onChange={handleChangeRoomOnOff}
							checkedChildren="Online"
							unCheckedChildren="Offline"
						/>
					</motion.div>
					{/*<Switch onChange={handleChangeRoomOnOff} value={roomOnlinee} defaultValue={roomSpecs.online}*/}
					{/*        disabled={!isHost}/>*/}
					<Power size={20} color={darkRoomTheme.token.colorPrimary}/>
				</ChangeRoomToOnOff>
				<div
					style={{padding: "0 1rem", borderBottom: `0.01px solid ${darkRoomTheme.token.colorPrimary}`}}
				></div>
				<Menu mode={menuMode} items={menuItems} onClick={menuClick}/>
			</MenuContainer>
	);
}