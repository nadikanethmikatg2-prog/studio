import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-motivational-messages.ts';
import '@/ai/flows/generate-study-goals.ts';
import '@/ai/flows/chat-flow.ts';
import '@/ai/schemas/motivational-message-schemas';
import '@/ai/schemas/study-goals-schemas';
import '@/ai/tools/todo-tools.ts';
import '@/ai/tools/rag-tool.ts';
