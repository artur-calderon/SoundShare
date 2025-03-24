import { Container, InfoRoom } from "./styles.ts";
import { BoomBox, Podcast, User } from "lucide-react";
import {useEffect} from "react";

import {useRoomStore} from "../../../../contexts/PlayerContext/useRoomStore";
import {userContext} from "../../../../contexts/UserContext.tsx";
import {useParams,} from "react-router-dom";

export default function RoomStats() {
	const {id} = useParams()
	
	const {getInfoRoom, roomSpecs, roomState} = useRoomStore();
	const {user} = userContext();


	useEffect(() => {
		getInfoRoom(id, user);
	},[getInfoRoom, id, user])


	return (
			<Container>
				<h3>Informações da Sala</h3>
				<InfoRoom>
	        <span>
	          <BoomBox />
	          Nome da Sala: <h3>{roomSpecs.name ? roomSpecs.name : "Carregando..."}</h3>
	        </span>
					<span>
	          {" "}
						<Podcast />
	          Sala: {roomSpecs.online ? "Online" : "Offline"}
	        </span>
					<span>
	          {" "}
						<User />
          Users Online: {" "}{roomState?.listeners}
	        </span>
				</InfoRoom>
			</Container>
	);
}
