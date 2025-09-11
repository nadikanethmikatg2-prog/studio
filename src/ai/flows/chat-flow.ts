"use server";

/**
 * @fileOverview A conversational AI flow for interacting with the study buddy.
 *
 * - chatWithBot - A function that handles the chat interaction.
 */

import { ai } from "@/ai/genkit";
import { addTodoTool } from "@/ai/tools/todo-tools";
import { MessageData, Part } from "genkit";
import { z } from "zod";

const systemInstruction = `You are a helpful assistant for the A/L Study Buddy app.
Your goal is to assist the user with managing their study tasks.
You can add tasks to their to-do list.
Be friendly and confirm when you have completed an action.
If the user asks for something you cannot do, politely decline.
The subjects are Chemistry, Physics, Pure Maths, and Applied Maths. Their keys are 'chemistry', 'physics', 'pureMaths', 'appliedMaths'.
`;

export async function chatWithBot(
  history: MessageData[],
  prompt: string
): Promise<{ response: string | null; toolRan: boolean; updatedTodos?: { subjectKey: string, task: string } }> {

  const llmResponse = await ai.generate({
    model: "googleai/gemini-2.5-flash",
    prompt: [...history, { role: "user", content: [{ text: prompt }] }],
    system: systemInstruction,
    tools: [addTodoTool],
  });

  const toolRequest = llmResponse.toolRequest();
  let toolResponse = "";
  let updatedTodos;

  if (toolRequest) {
    const toolOutput = await toolRequest.run();
    
    const inputArgs = toolRequest.input();
    if (inputArgs.toolName === 'addTodo' && inputArgs.input) {
      updatedTodos = {
        subjectKey: inputArgs.input.subjectKey,
        task: inputArgs.input.task,
      };
    }
    
    const finalResponse = await ai.generate({
        prompt: [...history, { role: "user", content: [{ text: prompt }] }, toolRequest, { role: "tool", content: toolOutput}],
        system: systemInstruction,
        tools: [addTodoTool],
    });
    toolResponse = finalResponse.text ?? "";
  }
  
  const textResponse = llmResponse.text;
  const toolRan = !!toolRequest;
  const finalBotResponse = toolResponse || textResponse;

  return {
    response: finalBotResponse,
    toolRan: toolRan,
    updatedTodos,
  };
}
