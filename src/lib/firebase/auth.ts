
"use client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import { auth } from "./firebase";
import { setInitialUserData, getUserStream } from "./firestore";
import { doc, getDoc } from "firebase/firestore";
import { getFirestoreInstance } from "./firebase";

export const handleSignUp = async (email: string, pass: string, stream: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pass
    );
    const user = userCredential.user;
    
    // Set an initial display name
    await updateProfile(user, { displayName: email.split('@')[0] });

    // Set persistence to keep the user logged in across sessions after sign-up
    await setPersistence(auth, browserLocalPersistence);
    
    // IMPORTANT: Await the database operation to ensure it completes
    await setInitialUserData(user.uid, stream);
    
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const handleSignIn = async (email: string, pass: string, keepLoggedIn: boolean) => {
  try {
    await setPersistence(auth, keepLoggedIn ? browserLocalPersistence : browserSessionPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const handleGoogleSignIn = async (stream: string) => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if the user is new or existing
    const db = await getFirestoreInstance();
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      // New user, set their initial data with the chosen stream
      await setInitialUserData(user.uid, stream);
      // Display name is usually set automatically from Google account
    }
    
    // Existing user, just sign them in
    return { user, error: null, isNewUser: !docSnap.exists() };
  } catch (error: any) {
    return { user: null, error: error.message, isNewUser: false };
  }
};


export const handleSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error signing out: ", error);
  }
};

export const handleGuestSignIn = async (stream: string) => {
  try {
    // Guest sessions are persisted locally by default.
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;

    // Check if the user data already exists in Firestore.
    const db = await getFirestoreInstance();
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      // If no data exists, it's a new guest. Create their initial data with the selected stream.
      await setInitialUserData(user.uid, stream);
    }

    return { user, error: null };
  } catch (error: any) {
    console.error("Error signing in as guest: ", error);
    return { user: null, error: error.message };
  }
};


export const updateUserDisplayName = async (name: string) => {
    const user = auth.currentUser;
    if (user) {
        try {
            await updateProfile(user, { displayName: name });
            return { success: true, error: null };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
    return { success: false, error: "No user logged in." };
};

export const updateUserPassword = async (newPass: string) => {
    const user = auth.currentUser;
    if (user) {
        try {
            await updatePassword(user, newPass);
            return { success: true, error: null };
        } catch (error: any) {
             // Handle re-authentication if required
            if (error.code === 'auth/requires-recent-login') {
                return { success: false, error: 'auth/requires-recent-login' };
            }
            return { success: false, error: error.message };
        }
    }
    return { success: false, error: "No user logged in." };
};

export const getCurrentUserDisplayName = () => {
    const user = auth.currentUser;
    return user?.displayName;
};
