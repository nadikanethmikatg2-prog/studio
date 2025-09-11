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
  prompt: string
): Promise<{ success: boolean; response: string | null; toolRan: boolean; message: string; updatedTodos?: { subjectKey: string, task: string } }> {
  try {
    const result = await chatWithBot(prompt);
    return { success: true, response: result.response, toolRan: result.toolRan, message: "Success", updatedTodos: result.updatedTodos };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      response: null,
      toolRan: false,
      message: "Failed to get response from AI. Please try again.",
    };
  }
}
