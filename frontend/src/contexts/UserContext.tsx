import { create } from 'zustand'
import {api} from '../lib/axios.ts'


import {auth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut} from "../services/firebase.ts";
import {GoogleAuthProvider} from "firebase/auth";

import {GetUserInfo} from "../hooks/getUserInfo.ts"

import {toast} from "react-toastify";

interface User {
	id: string,
	accessToken: string,
	name: string,
	email: string,
	image:string,
	role:string
}

interface UserContextProps {
	user: User,
	loginLoad: boolean,
	isLoggedIn: boolean,
	loginWithEmailAndPassword: (email:string, password:string) => void,
	createUser: (user: UserDataToCreate) => Promise<void>,
	loginWithGoogle: () => void,
	signInWithEmailAndPassword: () => void,
	persistUserLogged: () => void,
	signOut: () => void,


}

interface UserDataToCreate {
	name: string,
	email: string,
	password: string,
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error

export const userContext = create<UserContextProps>((set)=> {
	return {
		user: {
			id: '',
			accessToken: '',
			name: '',
			email: '',
			image: '',
			role: ''
		},
		loginLoad: false,
		isLoggedIn: false,

		loginWithEmailAndPassword: async (email: string, password: string)=>{
			set({loginLoad: true})
			try {
				const response = await signInWithEmailAndPassword(auth, email, password);
				const userInfo = await GetUserInfo(response.user.uid);
				console.log(userInfo)
				set({
					user: {
						id: userInfo.id,
						accessToken: response.user.accessToken,
						name: userInfo.name,
						email: userInfo.email,
						image: userInfo.image,
						role:userInfo.role
					},
					isLoggedIn: true,
				});


			}catch (e: any){
				toast.error(e.message || 'Erro Desconhecido')
			}finally {
				set({loginLoad: false})
			}
		},

		createUser: async (info: UserDataToCreate)=>{
			set({loginLoad: true})
			try{
				const response = await api.post( `/user/sign-up`, {info})
				if(response.status === 201){
					toast.success('Usuário criado com sucesso')
					window.location.href = '/login'
				}
			}catch (e : unknown){
				toast.error(e.message || 'Erro Desconhecido')
			}finally {
				set({loginLoad: false})
			}
		},

		loginWithGoogle: async () => {
		  set({ loginLoad: true });
		  const provider = new GoogleAuthProvider();
		  try {
		    const response = await signInWithPopup(auth, provider);
		    const userInfo = await GetUserInfo(response.user.uid);
		    set({
		      user: {
		        id: userInfo.id,
		        accessToken: response.user.accessToken,
		        name: userInfo.name,
		        email: userInfo.email,
		        image: userInfo.image,
		        role:userInfo.role
		      },
              isLoggedIn: true,
		    });

		  } catch (error) {
			// @ts-ignore
			  toast.error(error)
		  } finally {
		    set({ loginLoad: false });
		  }
		},

		persistUserLogged:  () =>{
			set({loginLoad: true})
			try{
				onAuthStateChanged(auth, async (user) => {
					if (user) {
						const userInfo = await GetUserInfo(user.uid);
						set({
							user: {
								id: userInfo.id,
								accessToken: user.accessToken,
								name: userInfo.name,
								email: userInfo.email,
								image: userInfo.image,
								role: userInfo.role
							},
							isLoggedIn: true,
						});
					}
				})
			}catch (e){
				toast.error(e.message || 'Erro Desconhecido')
			}finally {
				set({loginLoad: false})
			}
		},

		signOut: async ()=>{
			set({loginLoad: true})
			try
			{
				await signOut(auth).then(()=>{
					set({isLoggedIn: false})
					}
				)
			}catch (e){
				toast.error(e.message || 'Erro Desconhecido')
			}finally {
				set({loginLoad: false})
			}
		}
}})