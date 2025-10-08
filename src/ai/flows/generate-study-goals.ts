
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

  Distribute this total goal among the subjects. Your primary focus should be to help the student balance their efforts. Identify which subjects have the lowest total study hours and allocate a higher portion of the weekly goal to those subjects to help the student catch up. However, do not completely neglect subjects they are already studying well. Ensure every subject gets some time. Aim for a balanced but strategic plan.

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
