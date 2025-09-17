
import { initializeApp, getApps, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// IMPORTANT: Go to your Firebase project settings, then to Service Accounts.
// Click "Generate new private key" and save the downloaded JSON file.
// Then, go to your environment variables (.env.local or your hosting provider)
// and create a variable named FIREBASE_SERVICE_ACCOUNT_KEY.
// Paste the ENTIRE contents of the JSON file as the value for this variable.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

if (!serviceAccount) {
    console.error("Firebase service account key not found. Make sure FIREBASE_SERVICE_ACCOUNT_KEY environment variable is set.");
}

const app =
  getApps().length === 0 && serviceAccount
    ? initializeApp({ credential: cert(serviceAccount) })
    : getApps()[0] || null;

// Ensure app is not null before getting firestore
export const adminDb = app ? getFirestore(app) : null;
