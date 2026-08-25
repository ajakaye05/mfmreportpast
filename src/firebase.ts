// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDQ9DIWC0UosQQJm1fNM7ziVXPrWFfyIPM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mfmreportpast.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://mfmreportpast-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mfmreportpast",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mfmreportpast.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "391480285376",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:391480285376:web:beb4365615593cabf43525",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-4DMM502H31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
try {
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
} catch (e) {
  // Analytics optional fallback
}

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getDatabase(app, firebaseConfig.databaseURL);


