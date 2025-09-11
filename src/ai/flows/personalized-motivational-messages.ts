// src/ai/flows/personalized-motivational-messages.ts
'use server';

/**
 * @fileOverview Personalized motivational messages for students based on their study patterns.
 *
 * - generateMotivationalMessage - A function that generates a motivational message.
 * - MotivationalMessageInput - The input type for the generateMotivationalMessage function.
 * - MotivationalMessageOutput - The return type for the generateMotivationalMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationalMessageInputSchema = z.object({
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

const MotivationalMessageOutputSchema = z.object({
  message: z.string().describe('Personalized motivational message.'),
});
export type MotivationalMessageOutput = z.infer<typeof MotivationalMessageOutputSchema>;

export async function generateMotivationalMessage(
  input: MotivationalMessageInput
): Promise<MotivationalMessageOutput> {
  return motivationalMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationalMessagePrompt',
  input: {schema: MotivationalMessageInputSchema},
  output: {schema: MotivationalMessageOutputSchema},
  prompt: `You are a motivational coach for Sri Lankan A/L students in the Maths stream.

  Based on the student's study hours and to-do list for each subject (Chemistry, Physics, Pure Maths, Applied Maths), provide a personalized motivational message to encourage them in their studies for the 2027 A/L exam.

  Study Hours:
  - Chemistry: {{{studyHoursChemistry}}} hours
  - Physics: {{{studyHoursPhysics}}} hours
  - Pure Maths: {{{studyHoursPureMaths}}} hours
  - Applied Maths: {{{studyHoursAppliedMaths}}} hours

  To-Do List:
  - Chemistry: {{{todoListChemistry}}}
  - Physics: {{{todoListPhysics}}}
  - Pure Maths: {{{todoListPureMaths}}}
  - Applied Maths: {{{todoListAppliedMaths}}}

  Message:`,
});

const motivationalMessageFlow = ai.defineFlow(
  {
    name: 'motivationalMessageFlow',
    inputSchema: MotivationalMessageInputSchema,
    outputSchema: MotivationalMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
