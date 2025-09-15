import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";

// IMPORTANT: REPLACE THIS WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC4WoGu4Tw6XA-sewcLy7VQoWr7gco3n2c",
  authDomain: "studio-1555928293-292bb.firebaseapp.com",
  projectId: "studio-1555928293-292bb",
  storageBucket: "studio-1555928293-292bb.firebasestorage.app",
  messagingSenderId: "680938869975",
  appId: "1:680938869975:web:fe28e2865bf8ac09394c92"
};

function initializeFirebaseApp() {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

const app: FirebaseApp = initializeFirebaseApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  try {
    console.log("Connecting to Firebase emulators...");
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log("Successfully connected to Firebase emulators.");
  } catch (e) {
    console.error("Error connecting to Firebase emulators:", e);
  }
}

export { app, auth, db };
