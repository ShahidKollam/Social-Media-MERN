import { initializeApp } from "firebase/app"


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-app-740ea.firebaseapp.com",
  projectId: "mern-app-740ea",
  storageBucket: "mern-app-740ea.appspot.com",
  messagingSenderId: "667785334999",
  appId: "1:667785334999:web:8387b5c5adbff4c54be092"
};

export const app = initializeApp(firebaseConfig);