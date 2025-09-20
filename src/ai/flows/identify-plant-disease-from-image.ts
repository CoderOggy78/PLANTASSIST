'use server';
/**
 * @fileOverview Identifies potential plant diseases from an uploaded image, considering weather conditions.
 *
 * - identifyPlantDiseaseFromImage - A function that handles the plant disease identification process.
 * - IdentifyPlantDiseaseFromImageInput - The input type for the identifyPlantDiseaseFromImage function.
 * - IdentifyPlantDiseaseFromImageOutput - The return type for the identifyPlantDiseaseFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getWeatherForecast } from '@/ai/tools/weather-tool';

const IdentifyPlantDiseaseFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  cropType: z.string().describe('The type of crop or plant being analyzed (e.g., "Tomato", "Wheat").'),
  latitude: z.number().optional().describe('The user\'s latitude for weather-aware recommendations.'),
  longitude: z.number().optional().describe('The user\'s longitude for weather-aware recommendations.'),
});
export type IdentifyPlantDiseaseFromImageInput = z.infer<typeof IdentifyPlantDiseaseFromImageInputSchema>;

const IdentifyPlantDiseaseFromImageOutputSchema = z.object({
  diseaseName: z.string().describe('The name of the identified disease, or null if no disease is identified.'),
  confidence: z.number().describe('The confidence level of the disease identification (0-1), or null if no disease is identified.'),
  effects: z.string().describe('How the disease affects plants, or null if no disease is identified.'),
  remedies: z.string().describe('Suggested remedies for the disease, or null if no disease is identified.'),
});

export type IdentifyPlantDiseaseFromImageOutput = z.infer<typeof IdentifyPlantDiseaseFromImageOutputSchema>;

export async function identifyPlantDiseaseFromImage(input: IdentifyPlantDiseaseFromImageInput): Promise<IdentifyPlantDiseaseFromImageOutput> {
  return identifyPlantDiseaseFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyPlantDiseaseFromImagePrompt',
  input: {schema: IdentifyPlantDiseaseFromImageInputSchema},
  output: {schema: IdentifyPlantDiseaseFromImageOutputSchema},
  tools: [getWeatherForecast],
  prompt: `You are an expert plant pathologist. Given an image of a plant and its crop type, you will identify potential diseases affecting the plant.

  Analyze the following image and determine if there are any visible signs of known plant diseases. Focus solely on visual diagnostic elements in the picture itself.  Do not speculate or make assumptions based on regional prevalence or other external factors.

  If a disease is identified, provide the disease name, a confidence level (0-1), how it affects plants, and suggested remedies.
  
  If the user provides their location (latitude and longitude), you MUST use the getWeatherForecast tool to get the current weather. Based on the forecast, you MUST tailor your remedy suggestions. For example, if it is currently raining or rain is forecasted, advise the user to avoid spraying and suggest alternative application methods or to wait for a dry period. If it is very windy, suggest spraying early in the morning.
  
  If no disease is identified, set diseaseName, effects, and remedies to null, and confidence to null.

  Crop Type: {{{cropType}}}
  Image: {{media url=photoDataUri}}
  {{#if latitude}}User Latitude: {{{latitude}}}{{/if}}
  {{#if longitude}}User Longitude: {{{longitude}}}{{/if}}
  `,
});

const identifyPlantDiseaseFromImageFlow = ai.defineFlow(
  {
    name: 'identifyPlantDiseaseFromImageFlow',
    inputSchema: IdentifyPlantDiseaseFromImageInputSchema,
    outputSchema: IdentifyPlantDiseaseFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
