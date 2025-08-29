import { create } from 'zustand'
import {api} from '../lib/axios.ts'


import {auth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut} from "../services/firebase.ts";
import {GoogleAuthProvider, getIdToken} from "firebase/auth";

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
				
				// Verifica se GetUserInfo retornou um erro
				if (userInfo instanceof Error || !userInfo || !userInfo.id) {
					throw new Error('Falha ao obter informações do usuário do backend');
				}
				
				// Obtém o token de acesso
				const accessToken = await getIdToken(response.user, true);
				
				set({
					user: {
						id: userInfo.id,
						accessToken: accessToken,
						name: userInfo.name,
						email: userInfo.email,
						image: userInfo.image,
						role: userInfo.role
					},
					isLoggedIn: true,
				});

			}catch (e: unknown){
				// Em caso de erro, faz logout do Firebase para limpar o estado
				try {
					await signOut(auth);
				} catch (signOutError) {
					console.error('Erro ao fazer logout após falha no login:', signOutError);
				}
				
				// Reseta o estado para não logado
				set({
					user: {
						id: '',
						accessToken: '',
						name: '',
						email: '',
						image: '',
						role: ''
					},
					isLoggedIn: false,
				});
				
				if (e instanceof Error) {
					toast.error(e.message || 'Erro Desconhecido')
				} else {
					toast.error('Erro Desconhecido')
				}
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
				if (e instanceof Error) {
					toast.error(e.message || 'Erro Desconhecido')
				} else {
					toast.error('Erro Desconhecido')
				}
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
		    
		    // Verifica se GetUserInfo retornou um erro
		    if (userInfo instanceof Error || !userInfo || !userInfo.id) {
		      throw new Error('Falha ao obter informações do usuário do backend');
		    }
		    
		    // Obtém o token de acesso
		    const accessToken = await getIdToken(response.user, true);
		    
		    set({
		      user: {
		        id: userInfo.id,
		        accessToken: accessToken,
		        name: userInfo.name,
		        email: userInfo.email,
		        image: userInfo.image,
		        role: userInfo.role
		      },
              isLoggedIn: true,
		    });

		  } catch (error) {
		    // Em caso de erro, faz logout do Firebase para limpar o estado
		    try {
		      await signOut(auth);
		    } catch (signOutError) {
		      console.error('Erro ao fazer logout após falha no login:', signOutError);
		    }
		    
		    // Reseta o estado para não logado
		    set({
		      user: {
		        id: '',
		        accessToken: '',
		        name: '',
		        email: '',
		        image: '',
		        role: ''
		      },
		      isLoggedIn: false,
		    });
		    
		    // Mostra mensagem de erro apropriada
		    if (error instanceof Error) {
		      toast.error(error.message || 'Erro ao fazer login com Google');
		    } else {
		      toast.error('Erro desconhecido ao fazer login com Google');
		    }
		  } finally {
		    set({ loginLoad: false });
		  }
		},

		persistUserLogged:  () =>{
			set({loginLoad: true})
			try{
				onAuthStateChanged(auth, async (user) => {
					if (user) {
						try {
							const newToken = await getIdToken(user, true);
							const userInfo = await GetUserInfo(user.uid);
							
							// Verifica se GetUserInfo retornou um erro
							if (userInfo instanceof Error || !userInfo || !userInfo.id) {
								// Se falhar, faz logout e reseta o estado
								await signOut(auth);
								set({
									user: {
										id: '',
										accessToken: '',
										name: '',
										email: '',
										image: '',
										role: ''
									},
									isLoggedIn: false,
								});
								return;
							}
							
							set({
								user: {
									id: userInfo.id,
									accessToken: newToken,
									name: userInfo.name,
									email: userInfo.email,
									image: userInfo.image,
									role: userInfo.role
								},
								isLoggedIn: true,
							});
						} catch (error) {
							// Se falhar ao obter informações, faz logout e reseta o estado
							await signOut(auth);
							set({
								user: {
									id: '',
									accessToken: '',
									name: '',
									email: '',
									image: '',
									role: ''
								},
								isLoggedIn: false,
							});
						}
					}
				})
			}catch (e){
				if (e instanceof Error) {
					toast.error(e.message || 'Erro Desconhecido')
				} else {
					toast.error('Erro Desconhecido')
				}
			}finally {
				set({loginLoad: false})
			}
		},

		signOut: async ()=>{
			set({loginLoad: true})
			try
			{
				await signOut(auth).then(()=>{
					set({isLoggedIn: false,user:{ id: '', accessToken: '', name: '', email: '', image: '', role: '' }})
					}
				)
			}catch (e){
				if (e instanceof Error) {
					toast.error(e.message || 'Erro Desconhecido')
				} else {
					toast.error('Erro Desconhecido')
				}
			}finally {
				set({loginLoad: false})
			}
		}
}})