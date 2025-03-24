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
	// const [genres, setGenres] = useState([]);
	// const [alertMessage, setAlertMessage] = useState({});
	// const navigate = useNavigate();
	// const [showRoomProfile, setShowRoomProfile] = useState(false);
	// const [roomid, setRoomid] = useState("");
	// const [loadingInfo, setLoadingInfo] = useState(true);


	const { user } = userContext();

	const navigate = useNavigate();


	useEffect(() => {
		const fetchRooms = FetchRooms(user.accessToken)
		fetchRooms.then(rooms => {
			setMyRooms(rooms.filter((room : boolean) => room.owner === user.id));

		})
	}, [user.accessToken]);

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

	// function changeRoomToOnline(roomID) {
	// 	// Muda o status da sala para online e redireciona o usuário para ela
	// 	const info = { online: true };
	// 	const res = talkToApi(
	// 		"put",
	// 		"/room",
	// 		`/${roomID}`,
	// 		{ info },
	// 		user.accessToken,
	// 	);
	// 	res
	// 		.then(() => {
	// 			navigate(`/room/${roomID}`);
	// 		})
	// 		.catch((e) => console.log(e));
	// }
	// function openProfileRoom(id) {
	// 	setRoomid(id);
	// 	setShowRoomProfile(!showRoomProfile);
	// }

	// function ModalCreateRoom() {
	// 	const [form] = Form.useForm();
	// 	const { TextArea } = Input;
	// 	const [file, setFile] = useState(null);
	//
	// 	async function HandleCreateRoom(values) {
	// 		let genres = [];
	// 		genres.push(values.genero);
	//
	// 		await axios({
	// 			method: "POST",
	// 			url: `${import.meta.env.VITE_API}/room`,
	// 			headers: {
	// 				Accept: "application/json",
	// 				"Content-Type": "application/json",
	// 				Authorization: `Bearer ${user.accessToken}`,
	// 			},
	// 			data: {
	// 				info: {
	// 					name: values.nomedasala,
	// 					description: values.descricao,
	// 					cover: file,
	// 					genres: genres,
	// 					owner: user.uid,
	// 				},
	// 			},
	// 		})
	// 			.then((res) => {
	// 				console.log(res);
	// 				if (res.status === 2001) {
	// 					setAlertMessage({
	// 						message: "Sala Criada com Sucesso!",
	// 						type: "success",
	// 					});
	// 				}
	// 			})
	// 			.catch((e) => {
	// 				setAlertMessage({ message: e.response.data.message, type: "error" });
	// 			});
	// 	}
	// 	async function handleFile(file) {
	// 		const storageRef = ref(storage, file.name);
	// 		await uploadBytes(storageRef, file)
	// 			.then(() => {
	// 				getDownloadURL(storageRef).then((url) => {
	// 					setFile(url);
	// 				});
	// 			})
	// 			.catch((e) => {
	// 				console.log(e);
	// 			});
	// 	}
	// 	function cancelModal() {
	// 		setAlertMessage({});
	// 		setIsModalVisible(false);
	// 	}
	// 	return (
	// 		<Modal
	// 			title="Crie sua Sala"
	// 			open={isModalVisible}
	// 			onCancel={() => cancelModal()}
	// 			footer={null}
	// 		>
	// 			<Form
	// 				labelCol={{
	// 					span: 4,
	// 				}}
	// 				wrapperCol={{
	// 					span: 14,
	// 				}}
	// 				layout="horizontal"
	// 				style={{
	// 					maxWidth: 600,
	// 					width: "50rem",
	// 				}}
	// 				form={form}
	// 				onFinish={HandleCreateRoom}
	// 			>
	// 				<Form.Item label="Nome da Sala" name="nomedasala">
	// 					<Input />
	// 				</Form.Item>
	// 				<Form.Item label="Gênero" name="genero">
	// 					<Select>
	// 						{genres.map((genre) => (
	// 							<Select.Option key={genre.id} value={genre.id}>
	// 								{genre.name}
	// 							</Select.Option>
	// 						))}
	// 					</Select>
	// 				</Form.Item>
	// 				<Form.Item label="Descrição" name="descricao">
	// 					<TextArea rows={4} />
	// 				</Form.Item>
	// 				<Form.Item label="Capa" valuePropName="fileList">
	// 					<Upload
	// 						action={handleFile}
	// 						listType="picture-card"
	// 						accept="image/png, image/jpeg"
	// 						maxCount={1}
	// 						multiple
	// 					>
	// 						<button
	// 							style={{
	// 								border: 0,
	// 								background: "none",
	// 							}}
	// 							type="button"
	// 						>
	// 							<PlusOutlined />
	// 							<div
	// 								style={{
	// 									marginTop: 8,
	// 								}}
	// 							>
	// 								Upload
	// 							</div>
	// 						</button>
	// 					</Upload>
	// 				</Form.Item>
	// 				<Form.Item>
	// 					<Button htmlType="submit" type="primary">
	// 						Criar Sala
	// 					</Button>
	// 				</Form.Item>
	// 			</Form>
	// 		</Modal>
	// 	);
	// }
	return (
		<Container>

			{/*{isModalVisible && <ModalCreateRoom />}*/}
			{/*onClick={() => setIsModalVisible(true)}*/}
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
							}}
							cover={<img alt="example" src={room.cover} />}
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
									onClick={() => navigate(`/room/${room.id}`)}
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
