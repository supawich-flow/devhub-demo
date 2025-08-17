import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "AIzaSyBfYsbey2KHr8ICaiUCUZKfo8M76e68EFM",
  authDomain: "devhub-77217.firebaseapp.com",
  projectId: "devhub-77217",
  storageBucket: "devhub-77217.firebasestorage.app",
  messagingSenderId: "165200555743",
  appId: "1:165200555743:web:6b29757868cb0ad80e836a",
  measurementId: "G-4Y29P2DS1T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);