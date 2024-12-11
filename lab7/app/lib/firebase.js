// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1-k71EPXZVUa5UL4Id3uZe82FAuiqGsE",
  authDomain: "nextjs-797f8.firebaseapp.com",
  projectId: "nextjs-797f8",
  storageBucket: "nextjs-797f8.firebasestorage.app",
  messagingSenderId: "97933652351",
  appId: "1:97933652351:web:a30bb76500ff3750eeaa4a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app};