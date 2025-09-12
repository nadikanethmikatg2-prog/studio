import { doc, setDoc, getDoc, collection, getDocs, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
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
  const userDocRef = doc(db, "users", userId);
  await setDoc(userDocRef, { subjects: initialSubjectsData });
};

// Get initial subjects for a user
export const getInitialSubjects = async (userId: string): Promise<Subjects> => {
  const userDocRef = doc(db, "users", userId);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    // Ensure todos is an array, handle potential old data structure
    const subjects = data.subjects as Subjects;
    for (const key in subjects) {
      if (subjects[key] && !Array.isArray(subjects[key].todos)) {
        subjects[key].todos = [];
      }
    }
    return subjects;
  } else {
    // If no document, create one
    await setInitialUserData(userId);
    const subjectsWithEmptyTodos = { ...initialSubjectsData };
    for (const key in subjectsWithEmptyTodos) {
      // @ts-ignore
      subjectsWithEmptyTodos[key].todos = [];
    }
    return subjectsWithEmptyTodos as Subjects;
  }
};

// Save subjects to Firestore
export const saveSubjects = async (userId: string, subjects: any) => {
  const userDocRef = doc(db, "users", userId);
  await setDoc(userDocRef, { subjects }, { merge: true });
};

// Get daily logs for a user
export const getDailyLogs = async (userId: string): Promise<DailyLog> => {
  const logsCollectionRef = collection(db, `users/${userId}/dailyLogs`);
  const querySnapshot = await getDocs(logsCollectionRef);
  const logs: DailyLog = {};
  querySnapshot.forEach((doc) => {
    logs[doc.id] = doc.data() as { [subjectKey: string]: number; };
  });
  return logs;
};

// Save daily logs to Firestore
export const saveDailyLogs = async (userId: string, dailyLogs: DailyLog) => {
  if (Object.keys(dailyLogs).length === 0) return;
  const batch = writeBatch(db);
  for (const date in dailyLogs) {
    const logDocRef = doc(db, `users/${userId}/dailyLogs`, date);
    batch.set(logDocRef, dailyLogs[date]);
  }
  await batch.commit();
};
