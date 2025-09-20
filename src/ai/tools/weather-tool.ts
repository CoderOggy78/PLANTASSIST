'use server';
/**
 * @fileOverview A Genkit tool for fetching weather forecasts.
 *
 * - getWeatherForecast - A tool that returns a weather forecast for a given location.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const getWeatherForecast = ai.defineTool(
  {
    name: 'getWeatherForecast',
    description: 'Returns the current weather forecast for a given location.',
    inputSchema: z.object({
      latitude: z.number().describe('The latitude for the location.'),
      longitude: z.number().describe('The longitude for the location.'),
    }),
    outputSchema: z.string(),
  },
  async ({ latitude, longitude }) => {
    // In a real application, this would call a weather API.
    // For this example, we'll return mock data based on the location.
    console.log(`Fetching weather for Lat: ${latitude}, Lon: ${longitude}`);

    // Simple logic to return different mock weather data
    if (latitude > 0) {
      return 'Forecast: Sunny with a high of 25°C. Low chance of rain.';
    } else if (longitude > 0) {
      return 'Forecast: Cloudy with a 70% chance of heavy rain this afternoon.';
    } else {
      return 'Forecast: Partly cloudy with moderate winds. Good conditions for outdoor work.';
    }
  }
);
