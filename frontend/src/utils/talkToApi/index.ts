import {api} from "../../lib/axios.ts";


async function talkToApi(method: string, route:string, param:string | undefined, token:string, data?:object ) {
	if (token)
		try {
			return await api({
				method: method,
				url: `${route}/${param}`,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				data: data,
			});
		} catch (error: unknown) {
			console.log(error);
			if (error.status === 401) {
				console.log("Token inválido");}
		}
}
export { talkToApi };
