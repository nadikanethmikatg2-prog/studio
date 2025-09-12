"use client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebase";
import { setInitialUserData } from "./firestore";

export const handleSignUp = async (email: string, pass: string) => {
  const auth = getFirebaseAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pass
    );
    const user = userCredential.user;
    await setInitialUserData(user.uid);
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const handleSignIn = async (email: string, pass: string) => {
  const auth = getFirebaseAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const handleSignOut = async () => {
  const auth = getFirebaseAuth();
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error signing out: ", error);
  }
};
