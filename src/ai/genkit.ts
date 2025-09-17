
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

function getApiKey(): string {
  const geminiApiKeys = (process.env.GEMINI_API_KEY || '').split(',');
  return geminiApiKeys[Math.floor(Math.random() * geminiApiKeys.length)];
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: getApiKey(),
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
