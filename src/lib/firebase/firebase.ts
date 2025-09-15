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

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Connect to emulators in development
if (process.env.NODE_ENV === "development") {
  // Point to the emulators running on localhost.
  // NOTE: Make sure you have the emulators running!
  try {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (e) {
    console.error(e);
  }
}

export { app, auth, db };
