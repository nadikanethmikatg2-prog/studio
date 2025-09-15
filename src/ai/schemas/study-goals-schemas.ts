
import {z} from 'genkit';

export const StudyGoalInputSchema = z.object({
  stream: z.string().describe("The student's study stream (e.g., Maths, Bio)."),
  subjectData: z.string().describe("A list of the student's subjects and their current total study hours."),
  subjectKeys: z.array(z.string()).describe("An array of the subject keys (e.g., ['chemistry', 'physics', 'biology']).")
});
export type StudyGoalInput = z.infer<typeof StudyGoalInputSchema>;

// This output schema is dynamic. The keys will be the subject keys from the input.
export const StudyGoalOutputSchema = z.record(z.number().describe('Suggested weekly goal hours for the subject.'));
export type StudyGoalOutput = z.infer<typeof StudyGoalOutputSchema>;
