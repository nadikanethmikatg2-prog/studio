
import {z} from 'genkit';

export const MotivationalMessageInputSchema = z.object({
  stream: z.string().describe("The student's study stream (e.g., Maths, Bio)."),
  subjectData: z.string().describe("A JSON string of the student's subjects, including hours and to-do lists."),
});
export type MotivationalMessageInput = z.infer<typeof MotivationalMessageInputSchema>;

export const MotivationalMessageOutputSchema = z.object({
  message: z.string().describe('A personalized motivational message and a brief analysis of study distribution. Mention if any subject is being neglected.'),
  subjectSpotlight: z.string().describe('Based on the data, suggest one specific subject to focus on next and why. Be encouraging.'),
});
export type MotivationalMessageOutput = z.infer<typeof MotivationalMessageOutputSchema>;
