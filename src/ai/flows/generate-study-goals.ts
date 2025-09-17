
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
  prompt: `You are an expert study planner for a Sri Lankan A/L student studying for the 2027 exam in the {{stream}} stream.

  Your task is to generate a realistic and balanced set of weekly study hour goals for their subjects.

  The total weekly study goal should be dynamic. Start with a baseline of 20 hours. If the student has studied more than 40 hours in total across all subjects, increase the weekly goal to 24 hours to maintain momentum. If they have studied less than 10 hours in total, set the goal to 18 hours to help them build a routine.

  Distribute this total goal among the subjects. Consider the student's current total study hours to identify which subjects might need more attention. For instance, if a subject has significantly fewer hours, you might allocate a bit more time to it to help the student catch up. However, don't neglect subjects they are already studying well. Aim for a balanced plan.

  The goals for each subject should be round numbers or to the nearest 0.5 hour (e.g., 5, 5.5, 6).

  The student's subjects are: {{subjectNames}}.

  Current Total Study Hours:
  {{subjectData}}

  VERY IMPORTANT: For the output, you must provide the subject's unique key ('chemistry', 'physics', 'pureMaths', 'appliedMaths', 'biology') in the 'subjectKey' field, not the full name.
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
