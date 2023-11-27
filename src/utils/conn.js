// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfQmb9ZMuPcSm559yUM2-oUbPBWgm0Zog",
  authDomain: "tm-login2023.firebaseapp.com",
  projectId: "tm-login2023",
  storageBucket: "tm-login2023.appspot.com",
  messagingSenderId: "956526269670",
  appId: "1:956526269670:web:bfb77c6595b1ee26751727"
};

// Initialize Firebase
const  app = initializeApp(firebaseConfig);

export default app;