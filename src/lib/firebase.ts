import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-94303.firebaseapp.com",
  projectId: "reactchat-94303",
  storageBucket: "reactchat-94303.appspot.com",
  messagingSenderId: "719579600023",
  appId: "1:719579600023:web:343697410b659693d1c5d2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
