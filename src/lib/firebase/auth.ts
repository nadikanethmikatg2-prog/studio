"use client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "./firebase";
import { setInitialUserData } from "./firestore";

export const handleSignUp = async (email: string, pass: string) => {
  try {
    // Set persistence to keep the user logged in across sessions
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pass
    );
    const user = userCredential.user;
    // IMPORTANT: Await the database operation to ensure it completes
    await setInitialUserData(user.uid); 
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

export const handleSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error signing out: ", error);
  }
};
