import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "studio-1555928293-292bb",
  "appId": "1:680938869975:web:fe28e2865bf8ac09394c92",
  "storageBucket": "studio-1555928293-292bb.firebasestorage.app",
  "apiKey": "AIzaSyC4WoGu4Tw6XA-sewcLy7VQoWr7gco3n2c",
  "authDomain": "studio-1555928293-292bb.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "680938869975"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
