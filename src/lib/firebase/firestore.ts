import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import type { Subjects, DailyLog } from "@/app/page";

const initialSubjectsData = {
  chemistry: {
    name: "Chemistry",
    totalHours: 0,
    goalHours: 5,
    todos: [],
    color: "hsl(var(--chart-1))",
  },
  physics: {
    name: "Physics",
    totalHours: 0,
    goalHours: 5,
    todos: [],
    color: "hsl(var(--chart-2))",
  },
  pureMaths: {
    name: "Pure Maths",
    totalHours: 0,
    goalHours: 6,
    todos: [],
    color: "hsl(var(--chart-3))",
  },
  appliedMaths: {
    name: "Applied Maths",
    totalHours: 0,
    goalHours: 6,
    todos: [],
    color: "hsl(var(--chart-4))",
  },
};

// Set initial user data on sign up
export const setInitialUserData = async (userId: string) => {
  const db = getFirebaseDb();
  const userDocRef = doc(db, "users", userId);
  await setDoc(userDocRef, { subjects: initialSubjectsData });
};

// Get initial subjects for a user
export const getInitialSubjects = async (userId: string): Promise<Subjects> => {
  const db = getFirebaseDb();
  const userDocRef = doc(db, "users", userId);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.subjects as Subjects;
  } else {
    // If no document, create one
    await setInitialUserData(userId);
    return initialSubjectsData as Subjects;
  }
};

// Save subjects to Firestore
export const saveSubjects = async (userId: string, subjects: any) => {
  const db = getFirebaseDb();
  const userDocRef = doc(db, "users", userId);
  await setDoc(userDocRef, { subjects }, { merge: true });
};

// Get daily logs for a user
export const getDailyLogs = async (userId: string): Promise<DailyLog> => {
  const db = getFirebase.Db();
  const logsCollectionRef = collection(db, `users/${userId}/dailyLogs`);
  const querySnapshot = await getDocs(logsCollectionRef);
  const logs: DailyLog = {};
  querySnapshot.forEach((doc) => {
    logs[doc.id] = doc.data();
  });
  return logs;
};

// Save daily logs to Firestore
export const saveDailyLogs = async (userId: string, dailyLogs: DailyLog) => {
  const db = getFirebaseDb();
  const batch = [];
  for (const date in dailyLogs) {
    const logDocRef = doc(db, `users/${userId}/dailyLogs`, date);
    batch.push(setDoc(logDocRef, dailyLogs[date]));
  }
  await Promise.all(batch);
};
