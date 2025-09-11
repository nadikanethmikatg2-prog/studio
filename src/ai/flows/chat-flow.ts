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
): Promise<{ response: string | null; toolRan: boolean; updatedTodos?: { subjectKey: string, task: string } }> {
  const llmResponse = await ai.generate({
    model: "googleai/gemini-2.5-flash",
    prompt: [{ role: "user", content: [{ text: prompt }] }],
    tools: [chatPrompt],
  });

  const toolRequest = llmResponse.toolRequest();
  let toolResponse = "";
  let updatedTodos;

  if (toolRequest) {
    const toolOutput = await toolRequest.run();
    
    // This is a temporary way to pass back what was added.
    // In a real app, this might be handled via a database and re-fetching.
    const inputArgs = toolRequest.input();
    if (inputArgs.toolName === 'addTodo' && inputArgs.input) {
      updatedTodos = {
        subjectKey: inputArgs.input.subjectKey,
        task: inputArgs.input.task,
      };
    }
    
    const finalResponse = await ai.generate({
        prompt: [{ role: "user", content: [{ text: prompt }] }, toolRequest, { role: "tool", content: toolOutput}],
        tools: [chatPrompt],
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
