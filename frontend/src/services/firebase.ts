import {initializeApp} from 'firebase/app';

import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, signInWithPopup } from 'firebase/auth';
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
	apiKey: "AIzaSyAI5NE4fx7WAz0egxyZI18z_8NqoR7Dvf8",
	authDomain: "delivery-bot-fe36a.firebaseapp.com",
	projectId: "delivery-bot-fe36a",
	storageBucket: "delivery-bot-fe36a.appspot.com",
	messagingSenderId: "610900626070",
	appId: "1:610900626070:web:598b3720575028851990b7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { db, auth, signInWithEmailAndPassword, onAuthStateChanged, signOut, signInWithPopup , storage}