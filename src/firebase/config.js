import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration using Vite environment variables with fallback values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoConfigKeyForCivicFixApp2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "civicfix-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "civicfix-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "civicfix-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:demo123456789"
};

// Check if Firebase keys are real live keys or demo configuration
export const isLiveFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  !import.meta.env.VITE_FIREBASE_API_KEY.includes('Demo')
);

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
