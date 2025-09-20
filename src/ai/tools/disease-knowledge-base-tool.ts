
'use server';
/**
 * @fileOverview A Genkit tool for searching the disease knowledge base.
 *
 * - findDiseaseInfo - A tool that finds information about a specific plant disease.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { diseases } from '@/lib/data';

const DiseaseInfoSchema = z.object({
  name: z.string(),
  effects: z.string(),
  remedies: z.string(),
});

export const findDiseaseInfo = ai.defineTool(
  {
    name: 'findDiseaseInfo',
    description: 'Returns information about a specific plant disease from the knowledge base.',
    inputSchema: z.object({
      diseaseName: z.string().describe('The name of the disease to search for.'),
    }),
    outputSchema: DiseaseInfoSchema.nullable(),
  },
  async ({ diseaseName }) => {
    console.log(`Searching for disease: ${diseaseName}`);
    const foundDisease = diseases.find(
      (disease) => disease.name.toLowerCase() === diseaseName.toLowerCase()
    );

    if (foundDisease) {
      return {
        name: foundDisease.name,
        effects: foundDisease.effects,
        remedies: foundDisease.remedies,
      };
    }

    // Try a partial match if no exact match is found
    const partialMatch = diseases.find(
        (disease) => disease.name.toLowerCase().includes(diseaseName.toLowerCase())
    );

    if (partialMatch) {
        return {
            name: partialMatch.name,
            effects: partialMatch.effects,
            remedies: partialMatch.remedies,
        };
    }

    return null;
  }
);
