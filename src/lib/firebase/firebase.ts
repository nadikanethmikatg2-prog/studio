import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4WoGu4Tw6XA-sewcLy7VQoWr7gco3n2c",
  authDomain: "studio-1555928293-292bb.firebaseapp.com",
  projectId: "studio-1555928293-292bb",
  storageBucket: "studio-1555928293-292bb.firebasestorage.app",
  messagingSenderId: "680938869975",
  appId: "1:680938869975:web:fe28e2865bf8ac09394c92"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

const initializeFirebase = () => {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    if (process.env.NODE_ENV === "development" && typeof window !== "undefined" && window.location.hostname === "localhost") {
      console.log("Connecting to Firebase Emulators");
      connectAuthEmulator(auth, "http://localhost:9099");
      connectFirestoreEmulator(db, "localhost", 8080);
    }
  } else {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  }
};

// Initialize Firebase immediately
initializeFirebase();


export const getFirebaseAuth = () => auth;
export const getFirebaseDb = () => db;
export const getFirebaseApp = () => app;
