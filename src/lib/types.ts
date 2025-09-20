
import type { IdentifyPlantDiseaseFromImageOutput } from '@/ai/flows/identify-plant-disease-from-image';
import { z } from 'zod';

export type Disease = {
  name: string;
  effects: string;
  remedies: string;
};

export type HistoryItem = {
  id: string;
  date: string;
  image: string; // data URI of the user-uploaded image
  result: IdentifyPlantDiseaseFromImageOutput;
};

export const AskPlantDoctorOutputSchema = z.object({
  text: z.string().describe('The text response from the AI.'),
  audio: z.string().optional().describe('The audio response from the AI as a data URI.'),
});

export type AskPlantDoctorOutput = z.infer<typeof AskPlantDoctorOutputSchema>;
