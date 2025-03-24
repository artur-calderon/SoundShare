import {api} from "../lib/axios.ts";



export async function GetUserInfo(userInfo: string) {
  // Função para obter informações do usuário
	try {
		const response = await api.post(`user/login/${userInfo}`)

		if(response.status === 200){
			return response.data
		}
	}catch (error){
		return error
	}

}
