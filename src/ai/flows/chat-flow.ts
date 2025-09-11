"use server";

/**
 * @fileOverview A conversational AI flow for interacting with the study buddy.
 *
 * - chatWithBot - A function that handles the chat interaction.
 */

import { ai } from "@/ai/genkit";
import { MessageData } from "genkit";

const systemInstruction = `You are a helpful assistant for the A/L Study Buddy app.
Your goal is to assist the user with managing their study tasks.
Be friendly and answer questions.
If the user asks for something you cannot do, like adding a task for now, politely decline and say the feature is being worked on.
The subjects are Chemistry, Physics, Pure Maths, and Applied Maths.
`;

export async function chatWithBot(
  history: MessageData[]
): Promise<string> {
  const llmResponse = await ai.generate({
    model: "googleai/gemini-2.5-flash",
    prompt: history,
    system: systemInstruction,
  });

  return llmResponse.text;
}
