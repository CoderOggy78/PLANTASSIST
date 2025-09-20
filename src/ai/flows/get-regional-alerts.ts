'use server';
/**
 * @fileOverview Retrieves regional disease outbreak alerts based on GPS coordinates.
 *
 * - getRegionalAlerts - A function that fetches alerts for a given location.
 * - GetRegionalAlertsInput - The input type for the getRegionalAlerts function.
 * - GetRegionalAlertsOutput - The return type for the getRegionalAlerts function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetRegionalAlertsInputSchema = z.object({
  latitude: z.number().describe('The latitude of the user\'s location.'),
  longitude: z.number().describe('The longitude of the user\'s location.'),
});
export type GetRegionalAlertsInput = z.infer<typeof GetRegionalAlertsInputSchema>;

const AlertSchema = z.object({
    diseaseName: z.string().describe('The name of the disease.'),
    region: z.string().describe('The region or district where the outbreak is occurring.'),
    severity: z.enum(['Low', 'Medium', 'High']).describe('The severity of the outbreak.'),
    reportedCases: z.number().describe('The number of reported cases in the region.'),
    firstReported: z.string().describe('The date the outbreak was first reported.'),
});

const GetRegionalAlertsOutputSchema = z.object({
    alerts: z.array(AlertSchema).describe('A list of regional disease alerts.'),
    summary: z.string().describe('A brief summary of the situation.')
});
export type GetRegionalAlertsOutput = z.infer<typeof GetRegionalAlertsOutputSchema>;


export async function getRegionalAlerts(input: GetRegionalAlertsInput): Promise<GetRegionalAlertsOutput> {
  return getRegionalAlertsFlow(input);
}

// Mock data for demonstration purposes
const MOCK_ALERTS = [
  { diseaseName: 'Leaf Rust', region: 'Central Valley', severity: 'High', reportedCases: 152, firstReported: '2 weeks ago' },
  { diseaseName: 'Powdery Mildew', region: 'Coastal Region', severity: 'Medium', reportedCases: 89, firstReported: '1 month ago' },
  { diseaseName: 'Bacterial Blight', region: 'Northern Plains', severity: 'Low', reportedCases: 34, firstReported: '3 days ago' },
];

const getRegionalAlertsFlow = ai.defineFlow(
  {
    name: 'getRegionalAlertsFlow',
    inputSchema: GetRegionalAlertsInputSchema,
    outputSchema: GetRegionalAlertsOutputSchema,
  },
  async (input) => {
    // In a real application, you would query a database using the input coordinates.
    // For this example, we'll return mock data and use the AI to generate a summary.
    
    const prompt = `Based on the user's location (Lat: ${input.latitude}, Lon: ${input.longitude}) and the following outbreak data, provide a short, helpful summary for a farmer. Mention the most severe threat first.

    Data:
    ${JSON.stringify(MOCK_ALERTS, null, 2)}
    `;

    const { text } = await ai.generate({ prompt });

    if (!text) {
        throw new Error('Failed to generate summary from AI.');
    }

    return {
      alerts: MOCK_ALERTS,
      summary: text,
    };
  }
);
