import {api} from "../lib/axios.ts";


export async function FetchRooms(access_token: string) {
	// Função para obter informações do usuário
	try {
		const response = await api.get('/room',{
			headers:{
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			}
		})
		if(response.status === 200){
			return response.data
		}
	}catch (error){
		console.log(error)
	}

}