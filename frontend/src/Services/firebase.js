import { initializeApp } from "firebase/app";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";
import {
  doc,
  updateDoc,
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAI5NE4fx7WAz0egxyZI18z_8NqoR7Dvf8",
  authDomain: "delivery-bot-fe36a.firebaseapp.com",
  projectId: "delivery-bot-fe36a",
  storageBucket: "delivery-bot-fe36a.appspot.com",
  messagingSenderId: "610900626070",
  appId: "1:610900626070:web:598b3720575028851990b7",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage();
const db = getFirestore(app);

const auth = getAuth(app);

export {
  signInWithEmailAndPassword,
  auth,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  storage,
  uploadBytes,
  ref,
  getDownloadURL,
  doc,
  updateDoc,
  db,
  collection,
  query,
  where,
  onSnapshot,
};
