import { Space, Input, Flex, Card } from "antd";
// import { LogIn, Info } from "lucide-react";
// import { useEffect, useState } from "react";
// import { talkToApi } from "../../utils/utils.js";
// import { userContext } from "../../contexts/zustand-context/UserContext.js";
import {
	db,
} from "../../services/firebase.ts";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Info, LogIn} from "lucide-react";
// import { Link } from "react-router-dom";
// import { RoomProfile } from "../roomCardProfile/RoomProfile.jsx";

export function SearchRooms() {
	const { Search } = Input;
	const { Meta } = Card;
	const [roomsOnline, setRoomsOnline] = useState([]);
	// const [genres, setGenres] = useState([]);
	// const [showRoomProfile, setShowRoomProfile] = useState(false);
	// const [roomid, setRoomid] = useState("");

	// const { user } = userContext((store) => {
	// 	return {
	// 		user: store.user,
	// 	};
	// });

	// function openProfileRoom(id) {
	// 	setRoomid(id);
	// 	setShowRoomProfile(!showRoomProfile);
	// }
	// useEffect(() => {
	// 	try {
	// 		const res = talkToApi("get", "/genre", " ", user.accessToken);
	// 		res.then((res) => {
	// 			setGenres(res?.data);
	// 		});
	// 	} catch (e) {
	// 		console.log("Genero não encontrado");
	// 	}
	// }, [user.accessToken]);

	useEffect(() => {
		const q = query(collection(db, "rooms"), where("online", "==", true));
		onSnapshot(q, (querySnapshot) => {
			const rooms = []; // Cria um array temporário para armazenar os dados
			querySnapshot.forEach((doc) => {
				rooms.push(doc.data()); // Adiciona os dados de cada doc no array

			});
			setRoomsOnline(rooms);
		});
	}, []);
	return (
		<>
			<Space
				style={{
					marginBottom: "15px",
					display: "flex",
					flexDirection: "column",
					gap: "1rem",
					width: "100%",
					alignItems: "flex-start",
				}}
			>
				<Search
					placeholder="Procure uma sala"
					enterButton="Pesquisar"
					loading={false}
					size="middle"
				/>
				<h3>Salas online agora</h3>
				<Flex direction="column" justify="center" gap="1rem">
					{roomsOnline.length > 0 ? (
						roomsOnline.map((room) => (
							<Card
								hoverable
								style={{
									width: 240,
								}}
								key={room.id}
								cover={<img alt="example" src={room.cover} />}
							>
								<Meta title={room.name} description={room.description} />{" "}
								<Meta
									// description={room.genres === genres?.id ? genres.name : null}
								/>
								<Flex
									style={{
										width: "100%",
										padding: "0.1rem",
										marginTop: "1rem",
									}}
									justify="space-between"
								>
									<Link to={`/room/${room.id}`}>
										<LogIn strokeWidth={1.5} size={15} />
									</Link>
									<Info
										strokeWidth={1.5}
										size={15}
										// onClick={() => openProfileRoom(room.id)}
									/>
								</Flex>
							</Card>
						))
					) : (
						<h3>Nenhuma Sala Online</h3>
					)}
				</Flex>
				{/*{showRoomProfile && (*/}
				{/*	<RoomProfile*/}
				{/*		roomID={roomid}*/}
				{/*		openModal={showRoomProfile}*/}
				{/*		closeModal={setShowRoomProfile}*/}
				{/*		token={user.accessToken}*/}
				{/*	/>*/}
				{/*)}*/}
			</Space>
		</>
	);
}
