
"use server";
import { ai } from "@/ai/genkit";
import { z } from "genkit";
import * as fs from "fs";
import * as path from "path";

/**
 * A simple in-memory vector store for demonstration purposes.
 * In a real-world application, you would use a persistent vector database
 * like Firestore, Chroma, or Pinecone.
 */
interface Vector {
  id: string;
  embedding: number[];
  metadata: {
    text: string;
    source: string;
  };
}

const vectorStore: Vector[] = [];
let isIndexed = false;

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  if (magA === 0 || magB === 0) {
    return 0;
  }
  return dotProduct / (magA * magB);
}

async function searchSimilar(queryEmbedding: number[], topK = 3): Promise<string> {
  if (vectorStore.length === 0) {
    return "Vector store is empty. Please index documents first.";
  }

  const similarities = vectorStore.map(vector => ({
    ...vector.metadata,
    similarity: cosineSimilarity(queryEmbedding, vector.embedding),
  }));

  similarities.sort((a, b) => b.similarity - a.similarity);

  const topResults = similarities.slice(0, topK);

  return JSON.stringify(topResults.map(r => `Source: ${r.source}\nContent: ${r.text}`));
}


/**
 * Indexes the content of the Chemistry and Physics resource books.
 * This is a one-time operation (per server start).
 */
async function indexDocuments() {
  if (isIndexed) return;
  console.log("[RAG Tool] Starting document indexing...");

  // Dynamically import pdf-parse
  const pdf = (await import('pdf-parse')).default;

  const dataDir = path.join(process.cwd(), "src", "ai", "rag-data");
  const files = ["chemistry.pdf", "physics.pdf"];

  for (const file of files) {
    try {
      const filePath = path.join(dataDir, file);
      if (!fs.existsSync(filePath)) {
          console.warn(`[RAG Tool] Document not found, skipping: ${file}`);
          continue;
      }

      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);
      const content = pdfData.text;

      // Simple chunking by paragraphs. You could use more advanced strategies.
      const chunks = content.split(/\n\s*\n/).filter(chunk => chunk.trim().length > 10);
      
      console.log(`[RAG Tool] Indexing ${chunks.length} chunks from ${file}...`);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const {embedding} = await ai.embed({
            model: 'googleai/text-embedding-004',
            content: chunk,
        });

        vectorStore.push({
          id: `${file}-${i}`,
          embedding: embedding,
          metadata: {
            text: chunk,
            source: file,
          },
        });
      }
    } catch (error) {
      console.error(`[RAG Tool] Error indexing ${file}:`, error);
    }
  }

  isIndexed = true;
  console.log(`[RAG Tool] Finished indexing. Total vectors in store: ${vectorStore.length}`);
}

// Immediately start indexing when the server loads this file.
indexDocuments();


export const ragTool = ai.defineTool(
  {
    name: "ragTool",
    description: "Searches and retrieves information from the A/L Physics and Chemistry syllabus documents. Use this to answer any questions related to these two subjects.",
    inputSchema: z.object({
      query: z.string().describe("The user's question or the topic to search for."),
    }),
    outputSchema: z.string().describe("A JSON string containing the most relevant chunks of text from the documents."),
  },
  async ({ query }) => {
    console.log(`[RAG Tool] Received query: "${query}"`);
    
    // Ensure indexing is complete before searching.
    if (!isIndexed) {
        await indexDocuments();
    }

    const { embedding } = await ai.embed({
        model: 'googleai/text-embedding-004',
        content: query,
    });
    
    const results = await searchSimilar(embedding);
    console.log(`[RAG Tool] Found results:`, results);

    return results;
  }
);
