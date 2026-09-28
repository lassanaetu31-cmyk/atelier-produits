import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCghrOx4338d9OLIHPQxQWWf6vicfEZdxg",
  authDomain: "lassiapp.firebaseapp.com",
  projectId: "lassiapp",
  storageBucket: "lassiapp.firebasestorage.app",
  messagingSenderId: "525436972525",
  appId: "1:525436972525:web:db981a0edde76b98170be4",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db_fire = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
