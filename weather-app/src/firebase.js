import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDNLvHupuUtn41pKirPjCLqe8SzoP5dJkQ",
    authDomain: "weatherly-78fad.firebaseapp.com",
    projectId: "weatherly-78fad",
    storageBucket: "weatherly-78fad.firebasestorage.app",
    messagingSenderId: "887887966361",
    appId: "1:887887966361:web:00abf9467258d3dbfd4808",
    measurementId: "G-82FLDG9LNW"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);    