"use server";

import {
  generateMotivationalMessage,
  type MotivationalMessageInput,
} from "@/ai/flows/personalized-motivational-messages";

export async function getMotivationalMessageAction(
  input: MotivationalMessageInput
) {
  try {
    const result = await generateMotivationalMessage(input);
    return { success: true, message: result.message };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to generate a motivational message. Please try again.",
    };
  }
}
