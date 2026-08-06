import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration using Vite environment variables with user-provided production credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBmrrEEb0aIr4QBYk4yQeo0om3vUjPrMjU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "studio-287204068-4e6f6.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "studio-287204068-4e6f6",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "studio-287204068-4e6f6.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "161660787641",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:161660787641:web:bcbf9dcf7cfe382ac53468"
};

// Check if Firebase keys are real live keys
export const isLiveFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('Demo')
);

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
