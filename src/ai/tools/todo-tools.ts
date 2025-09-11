"use server";
import { ai } from "@/ai/genkit";
import { z } from "genkit";

/**
 * THIS IS A MOCK TOOL.
 * In a real application, this would interact with a database or external service.
 * For this prototype, we are just logging the action to the console.
 */
export const addTodoTool = ai.defineTool(
  {
    name: "addTodo",
    description: "Adds a to-do item to a subject's to-do list.",
    inputSchema: z.object({
      subjectKey: z.enum(["chemistry", "physics", "pureMaths", "appliedMaths"]).describe("The key for the subject."),
      task: z.string().describe("The description of the task to add."),
    }),
    outputSchema: z.string(),
  },
  async ({ subjectKey, task }) => {
    // In a real app, you would have a database call here.
    // For now, we just log it to the console to simulate the action.
    console.log(`[Tool] Adding task "${task}" to subject "${subjectKey}"`);

    // We need to find a way to update the frontend state.
    // Since tools can't directly modify the client, the client needs to refetch data.
    // The current implementation on the client-side shows a toast but doesn't
    // actually add the item to the list visually. This would be a next step.
    
    return `Successfully added the task "${task}" to the ${subjectKey} to-do list.`;
  }
);
