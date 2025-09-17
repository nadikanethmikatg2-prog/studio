
import {z} from 'genkit';

export const StudyGoalInputSchema = z.object({
  stream: z.string().describe("The student's study stream (e.g., Maths, Bio)."),
  subjectData: z.string().describe("A list of the student's subjects and their current total study hours."),
  subjectNames: z.string().describe("A comma-separated string of the subject names (e.g., 'Chemistry, Physics, Biology').")
});
export type StudyGoalInput = z.infer<typeof StudyGoalInputSchema>;

// This output schema is an array of objects, which is more reliable for the model.
export const StudyGoalOutputSchema = z.object({
  goals: z.array(z.object({
    subjectKey: z.string().describe("The unique key for the subject (e.g., 'chemistry', 'physics')."),
    goalHours: z.number().describe('Suggested weekly goal hours for the subject.'),
  }))
});
export type StudyGoalOutput = z.infer<typeof StudyGoalOutputSchema>;
