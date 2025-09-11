"use server";

/**
 * @fileOverview Generates weekly study goals for a student.
 *
 * - generateStudyGoals - A function that generates study goals.
 */

import {ai} from '@/ai/genkit';
import { StudyGoalInputSchema, StudyGoalOutputSchema, type StudyGoalInput, type StudyGoalOutput } from '@/ai/schemas/study-goals-schemas';


export async function generateStudyGoals(
  input: StudyGoalInput
): Promise<StudyGoalOutput> {
  return studyGoalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studyGoalPrompt',
  input: {schema: StudyGoalInputSchema},
  output: {schema: StudyGoalOutputSchema},
  prompt: `You are an expert study planner for a Sri Lankan A/L student in the Maths stream studying for the 2027 exam.

  Your task is to generate a realistic and balanced set of weekly study hour goals for the four subjects: Chemistry, Physics, Pure Maths, and Applied Maths.

  The total weekly study goal should be around 22 hours.

  Distribute these 22 hours among the subjects. Consider the student's current total study hours to identify which subjects might need more attention. For instance, if a subject has significantly fewer hours, you might allocate a bit more time to it to help the student catch up. However, don't neglect subjects they are already studying well. Aim for a balanced plan.

  The goals should be round numbers or to the nearest 0.5 hour (e.g., 5, 5.5, 6).

  Current Total Study Hours:
  - Chemistry: {{{studyHoursChemistry}}} hours
  - Physics: {{{studyHoursPhysics}}} hours
  - Pure Maths: {{{studyHoursPureMaths}}} hours
  - Applied Maths: {{{studyHoursAppliedMaths}}} hours
  `,
});

const studyGoalFlow = ai.defineFlow(
  {
    name: 'studyGoalFlow',
    inputSchema: StudyGoalInputSchema,
    outputSchema: StudyGoalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
