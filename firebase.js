
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingo-873cb.firebaseapp.com",
  projectId: "vingo-873cb",
  storageBucket: "vingo-873cb.firebasestorage.app",
  messagingSenderId: "353042179589",
  appId: "1:353042179589:web:0b367d2587c2d6f77c9e6c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth(app);

export{app,auth}