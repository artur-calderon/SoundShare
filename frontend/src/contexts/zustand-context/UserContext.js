import { create } from "zustand";
import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "../../Services/firebase.js";
import axios from "axios";

import { useStore } from "./PlayerContext.js";

export const userContext = create((set, get) => {
  async function getUserInfo(userInfo) {
    const user = userInfo?.uid || userInfo?.user.uid;
    if (user) {
      await axios
        .post(`${import.meta.env.VITE_API}/user/login/${user}`)
        .then((res) => {
          if (res.status === 200) {
            const user = res.data;

            set({
              user: {
                accessToken: userInfo.accessToken,
                uid: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                photoURL: user.image,
              },
              loginLoad: false,
              isLogged: true,
              statusMessage: {},
            });
            useStore.getState().setUser(get().user);
          }
        })
        .catch((error) => {
          set({
            loginLoad: false,
            statusMessage: {
              message: error.response?.data?.message || "Erro ao autenticar",
              type: "error",
            },
          });
          if (error.status === 401) {
            get().persistUserLogged();
          }
        });
    } else {
      set({
        isLogged: false,
      });
    }
  }

  return {
    user: {},
    loginLoad: false,
    isLogged: false,
    statusMessage: {},
    successMessage: null,

    loginWithEmailAndPassword: async (email, password) => {
      set({
        loginLoad: true,
      });
      try {
        await signInWithEmailAndPassword(auth, email, password)
          .then(getUserInfo)
          .catch((e) => {
            set({
              loginLoad: false,
              isLogged: true,
              statusMessage: {
                message: e.response?.data?.message || "Erro de email ou senha",
                type: "error",
              },
            });
          });
      } catch (e) {
        console.log(e);
      } finally {
        set({
          loginLoad: false,
        });
      }
    },
    persistUserLogged: async () => {
      set({
        loginLoad: true,
      });
      try {
        await onAuthStateChanged(auth, getUserInfo);
      } catch (e) {
        console.error(e);
      } finally {
        set({
          loginLoad: false,
        });
      }
    },

    createUser: async (info) => {
      await axios
        .post(`${import.meta.env.VITE_API}/user/sign-up`, { info })
        .then(() => {
          set({
            statusMessage: {
              message:
                "Cadastro Realizado com sucesso! Redirecionando para o login...",
              type: "success",
            },
          });
          window.location.href = "/login";
        })
        .catch((e) => {
          set({
            statusMessage: {
              message:
                e.response?.data?.message || "Erro ao cadastrar o usuário",
              type: "error",
            },
          });
        });
    },

    loginWithGoogle: async () => {
      set({
        loginLoad: true,
      });
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider).then(getUserInfo);
      } catch (e) {
        set({
          statusMessage: {
            message:
              e.response?.data?.message || "Erro ao autenticar com o google",
            type: "error",
          },
        });
      } finally {
        set({
          loginLoad: false,
        });
      }
    },
    signOut: () => {
      set({
        loginLoad: true,
      });
      signOut(auth)
        .then(() => {
          set({
            loginLoad: false,
            isLogged: false,
          });
          window.location.href = "/login";
        })
        .catch((error) => {
          // An error happened.
          return false;
        });
    },
    createRoom: () => {},
  };
});
