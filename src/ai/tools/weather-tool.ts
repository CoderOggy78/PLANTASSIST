'use server';
/**
 * @fileOverview A Genkit tool for fetching weather forecasts.
 *
 * - getWeatherForecast - A tool that returns a 7-day weather forecast for a given location.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

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
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      console.error("OpenWeatherMap API key not found.");
      return "Weather information is currently unavailable.";
    }

    // Using the 5-day/3-hour forecast endpoint, which is available on the free tier.
    // We will aggregate this to a simplified daily forecast.
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API request failed with status ${response.status}`);
      }
      const data = await response.json();
      
      // Aggregate the 3-hour data into a daily forecast summary.
      const dailyForecasts: { [key: string]: { temps: number[], weather: string[] } } = {};

      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = { temps: [], weather: [] };
        }
        dailyForecasts[date].temps.push(item.main.temp);
        dailyForecasts[date].weather.push(item.weather[0].description);
      });

      let forecastString = "Weekly forecast:\n";
      for (const date in dailyForecasts) {
        const dayData = dailyForecasts[date];
        const avgTemp = dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length;
        
        // Find the most common weather description for the day
        const weatherCounts = dayData.weather.reduce((acc, w) => {
            acc[w] = (acc[w] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const mostCommonWeather = Object.keys(weatherCounts).reduce((a, b) => weatherCounts[a] > weatherCounts[b] ? a : b);

        forecastString += `- ${new Date(date).toLocaleDateString(undefined, { weekday: 'long' })}: ${mostCommonWeather}, average temp ${avgTemp.toFixed(1)}°C.\n`;
      }

      return forecastString;

    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      return "Could not retrieve weather forecast at this time.";
    }
  }
);
