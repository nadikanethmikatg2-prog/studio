import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Paste your Firebase config object here.
const firebaseConfig = {
  apiKey: "AIzaSyC4WoGu4Tw6XA-sewcLy7VQoWr7gco3n2c",
  authDomain: "studio-1555928293-292bb.firebaseapp.com",
  projectId: "studio-1555928293-292bb",
  storageBucket: "studio-1555928293-292bb.firebasestorage.app",
  messagingSenderId: "680938869975",
  appId: "1:680938869975:web:fe28e2865bf8ac09394c92"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

if (process.env.NODE_ENV === "development" && typeof window !== "undefined" && window.location.hostname === "localhost") {
  console.log("Connecting to Firebase Emulators");
  // Point to the emulators
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}


export { app, auth, db };
