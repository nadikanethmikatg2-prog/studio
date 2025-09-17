import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

function getApiKey(): string {
  const anyscaleKeys = (process.env.GEMINI_API_KEYS || '').split(',');
  return anyscaleKeys[Math.floor(Math.random() * anyscaleKeys.length)];
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: getApiKey(),
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
