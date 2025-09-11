"use server";

import {
  generateMotivationalMessage,
  type MotivationalMessageInput,
  type MotivationalMessageOutput
} from "@/ai/flows/personalized-motivational-messages";

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
