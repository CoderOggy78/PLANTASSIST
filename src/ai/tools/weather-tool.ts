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
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      console.error("OpenWeatherMap API key not found.");
      return "Weather information is currently unavailable.";
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API request failed with status ${response.status}`);
      }
      const data = await response.json();
      
      const weather = data.weather[0];
      const main = data.main;
      const wind = data.wind;

      const description = weather.description;
      const temp = main.temp;
      const feels_like = main.feels_like;
      const humidity = main.humidity;
      const wind_speed = wind.speed;

      return `Forecast: ${description} with a temperature of ${temp}°C (feels like ${feels_like}°C). Humidity is at ${humidity}%, and wind speed is ${wind_speed} m/s.`;

    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      return "Could not retrieve weather forecast at this time.";
    }
  }
);
