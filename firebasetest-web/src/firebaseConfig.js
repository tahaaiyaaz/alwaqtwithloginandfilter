import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAs7t5NXYNF3yn8T8cbZZLrQID_Ed5aIQ",
  authDomain: "authusersforalwaqt.firebaseapp.com",
  projectId: "authusersforalwaqt",
  storageBucket: "authusersforalwaqt.firebasestorage.app",
  messagingSenderId: "475951667280",
  appId: "1:475951667280:web:7a6ffe0b38e3f89fdc1955",
  measurementId: "G-975CXEVP6Q",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const firebaseSignOut = () => signOut(auth);
export const db = getFirestore(app);
