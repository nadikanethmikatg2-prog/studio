import {z} from 'genkit';

export const MotivationalMessageInputSchema = z.object({
  studyHoursChemistry: z
    .number()
    .describe('Number of study hours for Chemistry.'),
  studyHoursPhysics: z.number().describe('Number of study hours for Physics.'),
  studyHoursPureMaths: z
    .number()
    .describe('Number of study hours for Pure Maths.'),
  studyHoursAppliedMaths: z
    .number()
    .describe('Number of study hours for Applied Maths.'),
  todoListChemistry: z
    .string()
    .describe('To-do list for Chemistry, comma separated.'),
  todoListPhysics: z.string().describe('To-do list for Physics, comma separated.'),
  todoListPureMaths: z
    .string()
    .describe('To-do list for Pure Maths, comma separated.'),
  todoListAppliedMaths: z
    .string()
    .describe('To-do list for Applied Maths, comma separated.'),
});
export type MotivationalMessageInput = z.infer<typeof MotivationalMessageInputSchema>;

export const MotivationalMessageOutputSchema = z.object({
  message: z.string().describe('A personalized motivational message and a brief analysis of study distribution. Mention if any subject is being neglected.'),
  subjectSpotlight: z.string().describe('Based on the data, suggest one specific subject to focus on next and why. Be encouraging.'),
});
export type MotivationalMessageOutput = z.infer<typeof MotivationalMessageOutputSchema>;
