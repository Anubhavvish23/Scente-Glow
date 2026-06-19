import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCDIBGY5spdJefA1z4qbotxC8WHHrk1mj8",
  authDomain: "scenteglow-adc2d.firebaseapp.com",
  projectId: "scenteglow-adc2d",
  storageBucket: "scenteglow-adc2d.firebasestorage.app",
  messagingSenderId: "1057103767981",
  appId: "1:1057103767981:web:e6ee8c5339c21824b35924"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);