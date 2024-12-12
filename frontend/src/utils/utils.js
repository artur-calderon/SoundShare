import axios from "axios";
import { useStore } from "../contexts/zustand-context/PlayerContext.js";

async function talkToApi(method, route, param, data, token) {
	if (token)
		try {
			return await axios({
				method: method,
				url: `/${route}${param}`,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				data: data,
			});
		} catch (error) {
			console.log(error);
			if (error.status === 401) {
				useStore.getState().persistUserLogged();
			}
		}
}
export { talkToApi };
