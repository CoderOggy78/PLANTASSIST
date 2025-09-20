'use server';
/**
 * @fileOverview A conversational AI flow for answering plant-related questions.
 *
 * - askPlantDoctor - A function that handles user queries to the plant doctor AI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export async function askPlantDoctor(question: string): Promise<string> {
  return askPlantDoctorFlow(question);
}

const prompt = ai.definePrompt({
  name: 'askPlantDoctorPrompt',
  input: {schema: z.string()},
  output: {schema: z.string()},
  prompt: `You are PlantBot, an expert botanist and agricultural assistant. Your role is to answer user questions about plant health, farming techniques, and disease remedies.

  Be friendly, encouraging, and provide clear, actionable advice. If you don't know the answer, say so. Do not make up information.

  User Question: {{{input}}}`,
});

const askPlantDoctorFlow = ai.defineFlow(
  {
    name: 'askPlantDoctorFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async question => {
    const {output} = await prompt(question);
    return output!;
  }
);
