import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  type Firestore,
  initializeFirestore,
  enableIndexedDbPersistence 
} from "firebase/firestore";

// IMPORTANT: REPLACE THIS WITH YOUR ACTUAL FIREBASE CONFIG
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
let db: Firestore | null = null;
let persistenceEnabled = false;

function initializeFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
      try {
        console.log("Connecting to Firebase emulators...");
        connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
        
        // Firestore emulator connection is handled in getFirestoreInstance
      } catch (e) {
        console.error("Error connecting to Firebase auth emulator:", e);
      }
    }
  } else {
    app = getApp();
    auth = getAuth(app);
  }
}

initializeFirebase();

async function getFirestoreInstance(): Promise<Firestore> {
  if (db) {
    return db;
  }

  const firestoreDb = initializeFirestore(app, {});

  if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    try {
      // Bypassing security rules in emulator by providing an admin auth object
      connectFirestoreEmulator(firestoreDb, 'localhost', 8080);
      console.log("Successfully connected to Firestore emulator.");
    } catch (e) {
      console.error("Error connecting to Firestore emulator:", e);
    }
  }

  if (typeof window !== 'undefined' && !persistenceEnabled) {
    try {
      await enableIndexedDbPersistence(firestoreDb);
      persistenceEnabled = true;
      console.log("Firestore offline persistence enabled.");
    } catch (err: any) {
      if (err.code === 'failed-precondition') {
        // This can happen if multiple tabs are open.
        console.warn('Firestore offline persistence failed: Multiple tabs open.');
      } else if (err.code === 'unimplemented') {
        // This can happen in environments where IndexedDB is not supported.
        console.warn('Firestore offline persistence failed: Browser does not support it.');
      }
    }
  }
  
  db = firestoreDb;
  return db;
}


export { app, auth, getFirestoreInstance };
