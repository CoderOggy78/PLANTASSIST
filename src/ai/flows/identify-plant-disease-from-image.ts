
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
  latitude: z.number().optional().describe('The user\'s latitude for weather-aware recommendations.'),
  longitude: z.number().optional().describe('The user\'s longitude for weather-aware recommendations.'),
});
export type IdentifyPlantDiseaseFromImageInput = z.infer<typeof IdentifyPlantDiseaseFromImageInputSchema>;

const IdentifyPlantDiseaseFromImageOutputSchema = z.object({
  plantName: z.string().nullable().describe('The identified name of the plant, or null if not a plant.'),
  diseaseName: z.string().nullable().describe('The name of the identified disease, or null if no disease is identified or the image is not a plant.'),
  confidence: z.number().nullable().describe('The confidence level of the disease identification (0-1), or null if no disease is identified.'),
  effects: z.string().nullable().describe('How the disease affects plants, or null if no disease is identified.'),
  remedies: z.string().nullable().describe('Suggested remedies for the disease, or null if no disease is identified.'),
  generatedImageUri: z.string().nullable().describe('A data URI of a generated image showing a healthy version of the identified plant. Null if no disease was found or the plant could not be identified.'),
});

export type IdentifyPlantDiseaseFromImageOutput = z.infer<typeof IdentifyPlantDiseaseFromImageOutputSchema>;

export async function identifyPlantDiseaseFromImage(input: IdentifyPlantDiseaseFromImageInput): Promise<IdentifyPlantDiseaseFromImageOutput> {
  return identifyPlantDiseaseFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyPlantDiseaseFromImagePrompt',
  input: {schema: z.object({
    photoDataUri: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  })},
  output: {schema: z.object({
    plantName: z.string().nullable().describe('The identified name of the plant, or null if not a plant.'),
    diseaseName: z.string().nullable().describe('The name of the identified disease, or null if no disease is identified or the image is not a plant.'),
    confidence: z.number().nullable().describe('The confidence level of the disease identification (0-1), or null if no disease is identified.'),
    effects: z.string().nullable().describe('How the disease affects plants, or null if no disease is identified.'),
    remedies: z.string().nullable().describe('Suggested remedies for the disease, or null if no disease is identified.'),
  })},
  tools: [getWeatherForecast],
  prompt: `You are an expert plant pathologist. Your task is to identify the plant and any diseases from an image.

  First, determine if the image provided is of a plant. If it is not a plant, you MUST set plantName, diseaseName, confidence, effects, and remedies to null.

  If the image is a plant, first identify the plant itself (e.g., "Tomato Plant", "Rose Bush"). Set the plantName field.

  Then, analyze the plant for any visible signs of known plant diseases. Focus solely on visual diagnostic elements in the picture itself. Do not speculate or make assumptions based on regional prevalence or other external factors.

  If a disease is identified, provide the disease name, a confidence level (0-1), how it affects plants, and suggested remedies.
  
  If the user provides their location (latitude and longitude), you MUST use the getWeatherForecast tool to get the upcoming week's weather forecast. Based on the forecast, you MUST tailor your remedy suggestions. For example, if rain is forecasted in the coming days, advise the user to avoid spraying and suggest alternative application methods or to wait for a dry period. If it is very windy, suggest spraying early in the morning when winds are calmer.
  
  If the image is a plant but no disease is identified, set diseaseName, effects, and remedies to null, and confidence to null. But you should still return the identified plantName.

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
    const {output: diagnosis} = await prompt(input);
    if (!diagnosis) {
        throw new Error("Failed to get a diagnosis from the AI.");
    }
    
    // If a plant was identified and it has a disease, generate an image of a healthy plant
    if (diagnosis.plantName && diagnosis.diseaseName) {
        try {
            const { media } = await ai.generate({
                model: 'googleai/imagen-4.0-fast-generate-001',
                prompt: `Generate a photorealistic image of a single, healthy ${diagnosis.plantName}, with a clean, plain background.`,
            });
            return {
                ...diagnosis,
                generatedImageUri: media.url,
            };
        } catch (error) {
            console.error("Image generation failed:", error);
            // If image generation fails, return the diagnosis without the image.
            return {
                ...diagnosis,
                generatedImageUri: null,
            };
        }
    }

    // If no disease, just return the diagnosis without a generated image.
    return {
        ...diagnosis,
        generatedImageUri: null,
    };
  }
);
