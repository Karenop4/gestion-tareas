// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaYhevJJ36G9364NJUxuR0YaV1uhnhJF0",
  authDomain: "silent-card-420502.firebaseapp.com",
  projectId: "silent-card-420502",
  storageBucket: "silent-card-420502.firebasestorage.app",
  messagingSenderId: "713121547974",
  appId: "1:713121547974:web:73316fa9d07c169c96f9c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db};