"use server";

import {
  generateMotivationalMessage,
} from "@/ai/flows/personalized-motivational-messages";
import type { MotivationalMessageInput, MotivationalMessageOutput } from "@/ai/schemas/motivational-message-schemas";

import { 
  generateStudyGoals, 
} from "@/ai/flows/generate-study-goals";
import type { StudyGoalInput, StudyGoalOutput } from "@/ai/schemas/study-goals-schemas";
import { chatWithBot } from "@/ai/flows/chat-flow";

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
  input: MotivationalMessageInput
): Promise<{ success: boolean; analysis?: MotivationalMessageOutput; message: string }> {
  try {
    const result = await generateMotivationalMessage(input);
    return { success: true, analysis: result, message: "Success" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to generate AI analysis. Please try again.",
    };
  }
}

export async function generateStudyGoalsAction(
  input: StudyGoalInput
): Promise<{ success: boolean; goals?: StudyGoalOutput; message: string }> {
  try {
    const result = await generateStudyGoals(input);
    return { success: true, goals: result, message: "Success" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to generate AI goals. Please try again.",
    };
  }
}

export async function chatWithBotAction(
  prompt: string,
  subjects: SerializableSubjects
): Promise<{ success: boolean; response: string | null; message: string }> {
  try {
    const todosString = JSON.stringify(subjects, null, 2);

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
