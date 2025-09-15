
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
      subjectKey: z
        .string()
        .describe("The key for the subject (e.g., 'chemistry', 'physics', 'biology')."),
      task: z.string().describe("The description of the task to add."),
    }),
    outputSchema: z.object({
      subjectKey: z.string(),
      task: z.string(),
    }),
  },
  async ({ subjectKey, task }) => {
    // In a real app, you would have a database call here.
    // For now, we just log it to the console to simulate the action.
    console.log(`[Tool] Adding task "${task}" to subject "${subjectKey}"`);

    // We need to find a way to update the frontend state.
    // Since tools can't directly modify the client, the client needs to refetch data.
    // The current implementation on the client-side shows a toast but doesn't
    // actually add the item to the list visually. This would be a next step.

    return { subjectKey, task };
  }
);

export const deleteAllTodosTool = ai.defineTool(
  {
    name: "deleteAllTodos",
    description: "Deletes all to-do items for all subjects.",
    inputSchema: z.object({}),
    outputSchema: z.string(),
  },
  async () => {
    console.log(`[Tool] Deleting all to-do items.`);
    return `Successfully deleted all to-do items.`;
  }
);

export const deleteSubjectTodosTool = ai.defineTool(
  {
    name: "deleteSubjectTodos",
    description: "Deletes all to-do items for a specific subject.",
    inputSchema: z.object({
      subjectKey: z
        .string()
        .describe("The key for the subject (e.g., 'chemistry', 'physics', 'biology')."),
    }),
    outputSchema: z.string(),
  },
  async ({ subjectKey }) => {
    console.log(`[Tool] Deleting all to-do items for subject "${subjectKey}".`);
    return `Successfully deleted all to-do items for ${subjectKey}.`;
  }
);
