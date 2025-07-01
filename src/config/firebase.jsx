// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-travel-56c6c.firebaseapp.com",
  projectId: "ai-travel-56c6c",
  storageBucket: "ai-travel-56c6c.firebasestorage.app",
  messagingSenderId: "345273467308",
  appId: "1:345273467308:web:4b7a30083ad6a92967ba09",
  measurementId: "G-0S1NWJK72D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);