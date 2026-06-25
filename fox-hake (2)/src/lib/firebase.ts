import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyClo-3Ex8mdLq7F8Mvv_PNzH1smvVVCrAg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "doctor-b76aa.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://doctor-b76aa-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "doctor-b76aa",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "doctor-b76aa.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "961436283394",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:961436283394:web:22c6c3512c19416c91ad1b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DEW0CTEGYH"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const rtdb = getDatabase(app);
