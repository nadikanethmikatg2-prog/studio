
"use server";

import {
  generateMotivationalMessage,
  type MotivationalMessageOutput,
} from "@/ai/flows/personalized-motivational-messages";
import type { MotivationalMessageInput } from "@/ai/schemas/motivational-message-schemas";

import { 
  generateStudyGoals, 
} from "@/ai/flows/generate-study-goals";
import type { StudyGoalInput, StudyGoalOutput } from "@/ai/schemas/study-goals-schemas";
import { chatWithBot } from "@/ai/flows/chat-flow";
import { getFirestoreInstance } from "@/lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";


// Define a type for the serializable subjects data
type SerializableSubjects = {
  [key: string]: {
    name: string;
    todos: string[]; // Updated to string array
    totalHours: number;
    goalHours: number;
  }
}

export async function getMotivationalMessageAction(
  stream: string,
  subjects: SerializableSubjects
): Promise<{ success: boolean; analysis?: MotivationalMessageOutput; message: string }> {
  try {
    const subjectData = Object.entries(subjects).map(([key, value]) => 
      `- ${value.name}: ${value.totalHours} hours, To-Dos: ${value.todos.join(', ') || 'none'}`
    ).join('\n');
    
    const input: MotivationalMessageInput = {
        stream,
        subjectData
    };

    const result = await generateMotivationalMessage(input);
    return { success: true, analysis: result, message: "Success" };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: `Failed to generate AI analysis. Details: ${error.message}`,
    };
  }
}

export async function generateStudyGoalsAction(
    userId: string,
    subjects: SerializableSubjects
): Promise<{ success: boolean; goals?: StudyGoalOutput; message: string }> {
  try {
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const db = await getFirestoreInstance();
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
        throw new Error("User data not found.");
    }
    const stream = userDocSnap.data().stream || 'maths';

    const subjectData = Object.entries(subjects).map(([key, value]) => 
        `- ${value.name}: ${value.totalHours} hours`
    ).join('\n');

    const input: StudyGoalInput = {
        stream,
        subjectData,
        subjectKeys: Object.keys(subjects)
    };

    const result = await generateStudyGoals(input);
    return { success: true, goals: result, message: "Success" };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: `Failed to generate AI goals. Details: ${error.message}`,
    };
  }
}

export async function chatWithBotAction(
  prompt: string,
  subjects: SerializableSubjects
): Promise<{ success: boolean; response: string | null; message: string }> {
  try {
    // Re-structure the data for the chat bot to be cleaner
    const structuredSubjects = Object.entries(subjects).map(([key, value]) => ({
      subject: value.name,
      subjectKey: key,
      totalHours: value.totalHours,
      goalHours: value.goalHours,
      todos: value.todos,
    }));

    const todosString = JSON.stringify(structuredSubjects, null, 2);

    const result = await chatWithBot(prompt, todosString);
    return { success: true, response: result, message: "Success" };
  } catch (error: any) {
    console.error("Error in chatWithBotAction:", error);
    return {
      success: false,
      response: null,
      message: `Failed to get response from AI. Details: ${error.message}`,
    };
  }
}
