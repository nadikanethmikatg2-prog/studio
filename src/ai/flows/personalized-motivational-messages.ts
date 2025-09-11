"use server";

/**
 * @fileOverview Personalized motivational messages for students based on their study patterns.
 *
 * - generateMotivationalMessage - A function that generates a motivational message.
 */

import {ai} from '@/ai/genkit';
import { MotivationalMessageInputSchema, MotivationalMessageOutputSchema, type MotivationalMessageInput, type MotivationalMessageOutput } from '@/ai/schemas/motivational-message-schemas';


export async function generateMotivationalMessage(
  input: MotivationalMessageInput
): Promise<MotivationalMessageOutput> {
  return motivationalMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationalMessagePrompt',
  input: {schema: MotivationalMessageInputSchema},
  output: {schema: MotivationalMessageOutputSchema},
  prompt: `You are an encouraging and insightful motivational coach for a Sri Lankan A/L student in the Maths stream studying for the 2027 exam.

  Your tone should be positive, supportive, and provide actionable advice. All your output must be in the Sinhala language.

  Based on the student's study hours and to-do list for each subject (Chemistry, Physics, Pure Maths, Applied Maths), provide:
  1.  A short, personalized motivational message in Sinhala. Analyze their study distribution and gently point out if any subject seems to be getting less attention compared to others.
  2.  A "Subject Spotlight" in Sinhala where you recommend one specific subject to focus on next. Justify your recommendation based on the provided data (e.g., lowest study hours, long to-do list).

  Current Study Data:
  - Chemistry: {{{studyHoursChemistry}}} hours, To-Dos: {{{todoListChemistry}}}
  - Physics: {{{studyHoursPhysics}}} hours, To-Dos: {{{todoListPhysics}}}
  - Pure Maths: {{{studyHoursPureMaths}}} hours, To-Dos: {{{todoListPureMaths}}}
  - Applied Maths: {{{studyHoursAppliedMaths}}} hours, To-Dos: {{{todoListAppliedMaths}}}
  `,
});

const motivationalMessageFlow = ai.defineFlow(
  {
    name: 'motivationalMessageFlow',
    inputSchema: MotivationalMessageInputSchema,
    outputSchema: MotivationalMessageOutputSchema,
  },
  async input => {
    // If all study hours are 0, return a default inspirational message.
    if (
      input.studyHoursChemistry === 0 &&
      input.studyHoursPhysics === 0 &&
      input.studyHoursPureMaths === 0 &&
      input.studyHoursAppliedMaths === 0
    ) {
      return {
        message: "ඔබගේ අධ්‍යයන ට්‍රැකර් වෙත සාදරයෙන් පිළිගනිමු! A/L 2027 විභාගය සඳහා ඔබේ ගමන ආරම්භ කිරීමට සහ පුද්ගලාරෝපිත ප්‍රතිපෝෂණ ලබා ගැනීමට ඔබගේ පළමු අධ්‍යයන වාරය ලොග් කරන්න.",
        subjectSpotlight: "ආරම්භ කිරීමට ඕනෑම විෂයයක පැය කිහිපයක් ලොග් කරන්න. සෑම විශිෂ්ට ගමනක්ම ආරම්භ වන්නේ එක් පියවරකින්!",
      };
    }

    const {output} = await prompt(input);
    return output!;
  }
);
