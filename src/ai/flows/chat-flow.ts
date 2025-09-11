"use server";

/**
 * @fileOverview A conversational AI flow for interacting with the study buddy.
 *
 * - chatWithBot - A function that handles the chat interaction.
 */

import { ai } from "@/ai/genkit";
import { addTodoTool } from "@/ai/tools/todo-tools";
import { z } from "genkit";

const systemInstruction = `You are a helpful assistant for the A/L Study Buddy app.
Your goal is to assist the user with managing their study tasks.
Be friendly and answer questions.
If the user asks you to add a task, use the addTodoTool.
If the user asks what their to-do items are, answer based on the provided JSON data. Do not use a tool to view tasks.

The subjects are Chemistry, Physics, Pure Maths, and Applied Maths.
Do not ask for confirmation before adding a task. Just add it and confirm it has been done.

Here is the user's current to-do list:
{{{todos}}}
`;

export async function chatWithBot(
  prompt: string,
  todos: string
): Promise<string> {
  const llmResponse = await ai.generate({
    model: "googleai/gemini-2.5-flash",
    prompt: prompt,
    system: systemInstruction,
    tools: [addTodoTool],
    input: {
      todos,
    }
  });

  return llmResponse.text;
}
