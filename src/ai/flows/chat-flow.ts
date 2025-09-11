"use server";

/**
 * @fileOverview A conversational AI flow for interacting with the study buddy.
 *
 * - chatWithBot - A function that handles the chat interaction.
 */

import { ai } from "@/ai/genkit";
import { addTodoTool } from "@/ai/tools/todo-tools";

const chatPrompt = ai.definePrompt({
  name: "chatPrompt",
  system: `You are a helpful assistant for the A/L Study Buddy app.
Your goal is to assist the user with managing their study tasks.
You can add tasks to their to-do list.
Be friendly and confirm when you have completed an action.
If the user asks for something you cannot do, politely decline.
The subjects are Chemistry, Physics, Pure Maths, and Applied Maths. Their keys are 'chemistry', 'physics', 'pureMaths', 'appliedMaths'.
`,
  tools: [addTodoTool],
});

export async function chatWithBot(
  prompt: string
): Promise<{ response: string | null; toolRan: boolean }> {
  const llmResponse = await ai.generate({
    model: "googleai/gemini-2.5-flash",
    history: [
      // You can add chat history here if needed
    ],
    prompt: [chatPrompt, {text: prompt}],
  });

  const toolRan = llmResponse.output?.tools?.length > 0;
  
  return {
    response: llmResponse.text,
    toolRan
  };
}
