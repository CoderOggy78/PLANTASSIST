import type { IdentifyPlantDiseaseFromImageOutput } from '@/ai/flows/identify-plant-disease-from-image';

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
