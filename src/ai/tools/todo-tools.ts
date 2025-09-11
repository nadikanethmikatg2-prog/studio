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
    // e.g., await db.todos.create({ data: { subjectKey, task } });
    console.log(`[Tool] Adding task "${task}" to subject "${subjectKey}"`);
    return `Successfully added the task "${task}" to the ${subjectKey} to-do list.`;
  }
);
