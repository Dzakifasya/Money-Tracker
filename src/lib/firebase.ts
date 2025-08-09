// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from "firebase/app";

const firebaseConfig = {
  "projectId": "trackit-jo6ad",
  "appId": "1:214775759270:web:a54323246d088febf4cf67",
  "storageBucket": "trackit-jo6ad.firebasestorage.app",
  "apiKey": "AIzaSyBqvvhVPnFWQ-Xj_q9yAH4zoalwVhHuvx0",
  "authDomain": "trackit-jo6ad.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "214775759270"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
