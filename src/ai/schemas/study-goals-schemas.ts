import {z} from 'genkit';

export const StudyGoalInputSchema = z.object({
  studyHoursChemistry: z
    .number()
    .describe('Current total study hours for Chemistry.'),
  studyHoursPhysics: z
    .number()
    .describe('Current total study hours for Physics.'),
  studyHoursPureMaths: z
    .number()
    .describe('Current total study hours for Pure Maths.'),
  studyHoursAppliedMaths: z
    .number()
    .describe('Current total study hours for Applied Maths.'),
});
export type StudyGoalInput = z.infer<typeof StudyGoalInputSchema>;

export const StudyGoalOutputSchema = z.object({
  chemistry: z.number().describe('Suggested weekly goal hours for Chemistry.'),
  physics: z.number().describe('Suggested weekly goal hours for Physics.'),
  pureMaths: z.number().describe('Suggested weekly goal hours for Pure Maths.'),
  appliedMaths: z.number().describe('Suggested weekly goal hours for Applied Maths.'),
});
export type StudyGoalOutput = z.infer<typeof StudyGoalOutputSchema>;
