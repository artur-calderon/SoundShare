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
import {useState} from "react";

export function MenuSide() {
	const navigate = useNavigate();
	const {leaveRoom} = useSocketStore()
	const {changeRoomOnOffline, isHost, roomSpecs} = useRoomStore()
	const [roomOnlinee, setRoomOnline] = useState(roomSpecs.online)
	const {id} = useParams();
	// const [alert, setAlert] = useState(true);
	// const { changeRoomToOffline, roomSpecs } = useStore();
	// useEffect(() => {
	// 	if (roomSpecs.online === true) {
	// 		setAlert(true);
	// 	} else setAlert(false);
	// }, [roomSpecs]);
	//
	// const roomToOnOrOffline = useMemo(() => {
	// 	return <Alert msm={alert ? "Sala Online" : "Sala Offiline"} type="info" />;
	// }, [alert]);

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
					<Switch onChange={handleChangeRoomOnOff} value={roomOnlinee} defaultValue={roomSpecs.online} disabled={!isHost}/>
					<Power size={20} color={darkRoomTheme.token.colorPrimary}/>
				</ChangeRoomToOnOff>
				<div
					style={{ padding: "0 1rem", borderBottom: `0.01px solid ${darkRoomTheme.token.colorPrimary}` }}
				></div>
				<Menu mode="inline" items={menuItems} onClick={menuClick} />
			</MenuContainer>
	);
}