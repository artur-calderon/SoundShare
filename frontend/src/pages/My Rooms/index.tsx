import {
	Input,
	Flex,
	Card,
	Button,
	Modal,
	Form,
	Select,
	Upload,
	Spin,
} from "antd";
// import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
// 	storage,
// 	uploadBytes,
// 	ref,
// 	getDownloadURL,
// } from "../../Services/firebase.js";
// import { RoomProfile } from "../roomCardProfile/RoomProfile.jsx";
// import { Loading } from "../Loading.jsx";
import { Container, RoomContainer } from "./styles.js";
import {FetchRooms} from "../../hooks/fetchRooms.ts";
import {userContext} from "../../contexts/UserContext.tsx";
import {Info, LogIn} from "lucide-react";
import Meta from "antd/es/card/Meta";
import {genres} from "../EditRoom/styles.tsx";
import {useRoomStore} from "../../contexts/PlayerContext/useRoomStore";


interface Rooms {
	id: string;
	cover: string;
	name: string;
	description: string;
	genres: string[];
	badges:string[];
	moderators: string[];
	owner: string;
	online: boolean;
}



export function MyRooms() {
	// const { Meta } = Card;
	// const [isModalVisible, setIsModalVisible] = useState(false);
	const [myRooms, setMyRooms] = useState<Rooms[]>([]);
	const [loading, setLoading] = useState(false);
	// const [genres, setGenres] = useState([]);
	// const [alertMessage, setAlertMessage] = useState({});
	// const [showRoomProfile, setShowRoomProfile] = useState(false);
	// const [roomid, setRoomid] = useState("");
	// const [loadingInfo, setLoadingInfo] = useState(true);


	const { user } = userContext();
	const { changeRoomOnOffline, getInfoRoom} =  useRoomStore()

	const navigate = useNavigate();


	useEffect(() => {
		const fetchRooms = FetchRooms(user.accessToken)
		fetchRooms.then(rooms => {
			setMyRooms(rooms.filter((room : boolean) => room.owner === user.id));

		})
	}, [user.accessToken]);

	 function goToRoom(id: string) {
		 setLoading(true);
		 changeRoomOnOffline(true, id).then(() =>{
			 getInfoRoom(id, user).then(()=>{
				 setLoading(false);
			    navigate(`/room/${id}`);
			 })
		 })
	}

	// useEffect(() => {
	// 	try {
	// 		const res = talkToApi("get", "/genre", " ", {}, user.accessToken);
	// 		res.then((res) => {
	// 			setGenres(res?.data);
	// 		});
	// 	} catch (e) {
	// 		console.log(e);
	// 	}
	// }, [user.accessToken]);
	//
	// if (loadingInfo) {
	// 	return <Loading />;
	// }



	return (
		<Container>
			<Button type="primary" onClick={() => navigate("/app/createroom")}>
				Criar Sala
			</Button>
			<h3>Suas Salas</h3>
			<RoomContainer>
				{myRooms.length > 0 ? (
					myRooms.map((room) => (
						<Card
							key={room.id}
							style={{
								width: 240,
								cursor: "pointer",
							}}
							cover={<img alt="example" src={room.cover} />}
							onClick={() => goToRoom(room.id)}
							loading={loading}
						>
							<Meta title={room.name} description={room.description} />
							<Meta
								description={room.genres === genres.id ? genres.name : null}
							/>
							<Flex
								style={{
									width: "100%",
									padding: "0.1rem",
									marginTop: "1rem",
								}}
								justify="space-between"
							>
								{/*TODO: ADicionar um put para passando online true para o back*/}

								<LogIn
									strokeWidth={1.5}
									size={15}
									onClick={() => goToRoom(room.id)}
								/>

								<Info
									strokeWidth={1.5}
									size={15}
									onClick={() => navigate(`/app/editroom/${room.id}`)}
								/>
							</Flex>
						</Card>
					))
				) : (
					<h3>
						Carregando Salas... <Spin />
					</h3>
				)}
			</RoomContainer>
			{/*{showRoomProfile && (*/}
			{/*	<RoomProfile*/}
			{/*		roomID={roomid}*/}
			{/*		openModal={showRoomProfile}*/}
			{/*		closeModal={setShowRoomProfile}*/}
			{/*		token={user.accessToken}*/}
			{/*	/>*/}
			{/*)}*/}
		</Container>
	);
}
