import {useNavigate, useParams} from "react-router-dom";
import {ChangeRoomToOnOff,  MenuContainer} from "./styles.ts";
import {Power, PowerOff} from "lucide-react";
import {Switch,  Menu, } from "antd";
import {Header} from "./components/Header";
import {menuItems} from "./menuItens.tsx";
import {darkRoomTheme} from "../../../../styles/themes/roomTheme.ts";
import {useSocketStore} from "../../../../contexts/PlayerContext/useSocketStore";

export function MenuSide() {
	const navigate = useNavigate();
	const {leaveRoom} = useSocketStore()
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
				// changeRoomToOffline(false);
				// localStorage.removeItem("insideRoom");
				leaveRoom(id)
				navigate("/app");
		}
	}
	return (
			<MenuContainer
				vertical={true}
			>
				{/*{roomToOnOrOffline}*/}
				<Header />
				<ChangeRoomToOnOff>
					<PowerOff size={20} color={darkRoomTheme.token.colorPrimary}/>
					<Switch defaultChecked  />
					<Power size={20} color={darkRoomTheme.token.colorPrimary}/>
				</ChangeRoomToOnOff>
				<div
					style={{ padding: "0 1rem", borderBottom: `0.01px solid ${darkRoomTheme.token.colorPrimary}` }}
				></div>
				{/*<SearchMusic/>*/}
				<Menu mode="inline" items={menuItems} onClick={menuClick} />
			</MenuContainer>
	);
}