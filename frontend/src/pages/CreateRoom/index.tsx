import  { useState } from "react";
import {Input, Select, Switch,  Button, Divider,  message} from "antd";
import {Container, Label, QRCodeSection} from "./styles.ts";
import {useNavigate} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {storage} from "../../services/firebase";
import {api} from "../../lib/axios.ts";
import {userContext} from "../../contexts/UserContext.tsx";
import {toast} from "react-toastify";
import {UploadCoverRoom} from "./components/UploadCoverRoom";

const { TextArea } = Input;
const { Option } = Select;

const createRoomSchema = z.object({
	roomName: z.string().min(1,"Nome da sala é obrigatório"),
	description: z.string(),
	genre: z.string().min(1, "Gênero é obrigatório"),
	cover: z.any().optional(),
	moderators: z.string().optional(),
	qrCodes: z.string().optional(),
})

type CreateRoomData = z.infer<typeof createRoomSchema>;


export function CreateRoom() {
	const {user} = userContext();

	const [generateQRCode, setGenerateQRCode] = useState(false);
	const navigate = useNavigate();

	//upload Image
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	// const [imageUrl, setImageUrl] = useState<string | null>(null);

	const [creatingRoom, setCreatingRoom] = useState(false);



	const {
		handleSubmit,
		control,
		formState:{errors}
	} = useForm<CreateRoomData>({
		resolver: zodResolver(createRoomSchema)
	})


	async function handleCreateNewRoom(data: CreateRoomData) {
		setCreatingRoom(true)


		const formattedData = {
			...data,
			moderators: data.moderators?.split(',').map((moderator)=> moderator.trim()),
			qrCodes: data.qrCodes?.split(',').map((qrCode)=> qrCode.trim())
		}
		//TODO: Verificar se o Usuário não atingiu o limite de criação de salas, se atingiu não pode fazer o upload da imagem

		let uploadedImageURL = undefined;
		if(selectedFile) {
			uploadedImageURL = await handleUpload(selectedFile as File)
		}
		try{
			await api({
				method: "POST",
				url: `/room`,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.accessToken}`,
				},data:{
					info:{
						name: formattedData.roomName,
						description: formattedData.description,
						cover: uploadedImageURL,
						genres: [formattedData.genre],
						owner: user.id,
						moderators: formattedData.moderators,
						qrCodes: formattedData.qrCodes
					}
				}
			})
			toast.success("Sala Criada com Sucesso!");

		}catch (e: unknown){
			toast.error(e.response?.data?.message || 'Erro Desconhecido')

		}finally {
			setCreatingRoom(false)
		}


	}

	const handleUpload = async (file: File)=>{
		if(!file){
			message.error('Selecione uma imagem')
			return;
		}

		const storageRef = ref(storage, `roomCovers/${file.name}`);
		try{
			await uploadBytes(storageRef, file);
			const url = await getDownloadURL(storageRef);
			// setImageUrl(url)
			message.success(`${file.name} enviado com sucesso`)
			return url
		}catch (error){
			console.log("Erro ao fazer upload:", error)
			message.error(`Erro ao enviar ${file.name}`)
		}
		return null
	}

	return (
		<Container onSubmit={handleSubmit(handleCreateNewRoom)}>
			<h2>Crie sua Sala</h2>
			<Label>Nome</Label>
			<Controller
				control={control}
				name={'roomName'}
				render={({field})=>(
					<Input {...field} placeholder="Digite o nome"/>
				)}
			/>
			{errors.roomName && <span>{errors.roomName.message}</span>}

			<Label>Descrição</Label>
			<Controller
				control={control}
				name='description'
				render={({field})=>(
					<TextArea {...field} rows={3} placeholder="Digite a descrição" />
				)}
			/>
			{errors.description && <span>{errors.description.message}</span>}

			<Label>Gênero</Label>
			<Controller
				control={control}
				name='genre'
				render={({field})=>(
					<Select {...field} style={{ width: "100%" }}>
						<Option value="Rock">Rock</Option>
						<Option value="Pop">Pop</Option>
						<Option value="Jazz">Jazz</Option>
					</Select>
				)}
			/>
			{errors.genre && <span>{errors.genre.message}</span>}
			<Label>Capa</Label>

			<UploadCoverRoom setSelectedFile={setSelectedFile}/>

			<Label>Moderadores (emails separados por vírgula)</Label>
			<Controller
				control={control}
				name='moderators'
				render={({field})=>(
					<Input {...field} placeholder="exemplo@email.com"/>)}
			/>
			<Divider />

			<Label>Criar QRCodes</Label>
			<Switch onChange={(checked) => setGenerateQRCode(checked)} />

			{generateQRCode && (
				<QRCodeSection>
					<Label>Insira o número das mesas separados por vírgula</Label>
					<Controller
						control={control}
						name='qrCodes'
						render={({field})=>(
							<Input {...field} placeholder="1,10,30..."/>)}
					/>
				</QRCodeSection>
			)}
			<br/>
			<br/>
			<Button htmlType='submit' loading={creatingRoom}>Criar Sala</Button>{" "}

			<Button onClick={() => navigate('/app/myrooms')}>Cancelar</Button>
		</Container>
	);
}


