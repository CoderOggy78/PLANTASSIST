'use server';
/**
 * @fileOverview A Genkit tool for fetching weather forecasts.
 *
 * - getWeatherForecast - A tool that returns a 7-day weather forecast for a given location.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getWeatherForecastFlow } from '@/ai/flows/get-weather-forecast-flow';

export const getWeatherForecast = ai.defineTool(
  {
    name: 'getWeatherForecast',
    description: 'Returns a 7-day weather forecast for a given location.',
    inputSchema: z.object({
      latitude: z.number().describe('The latitude for the location.'),
      longitude: z.number().describe('The longitude for the location.'),
    }),
    outputSchema: z.string(),
  },
  async ({ latitude, longitude }) => {
    return await getWeatherForecastFlow({ latitude, longitude });
  }
);
