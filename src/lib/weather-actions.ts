
'use server';

export interface ForecastDay {
    date: string;
    dayOfWeek: string;
    avgTemp: number;
    weather: string;
    weatherDescription: string;
}

interface FetchWeatherResult {
    forecast?: ForecastDay[];
    error?: string;
}

export async function fetchWeather({ latitude, longitude }: { latitude: number, longitude: number }): Promise<FetchWeatherResult> {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;

    if (!apiKey) {
        console.error("OpenWeatherMap API key not found.");
        return { error: "Weather service is not configured." };
    }
    
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        const errorBody = await response.json();
        console.error("Weather API Error:", errorBody);
        throw new Error(`Weather API request failed with status ${response.status}: ${errorBody.message}`);
      }
      const data = await response.json();
      
      const dailyForecasts: { [key: string]: { temps: number[], weather: string[], descriptions: string[] } } = {};

      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = { temps: [], weather: [], descriptions: [] };
        }
        dailyForecasts[date].temps.push(item.main.temp);
        dailyForecasts[date].weather.push(item.weather[0].main);
        dailyForecasts[date].descriptions.push(item.weather[0].description);
      });

      const processedForecast = Object.entries(dailyForecasts).slice(0, 5).map(([date, dayData]) => {
        const avgTemp = dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length;
        
        const weatherCounts = dayData.weather.reduce((acc, w) => {
            acc[w] = (acc[w] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const mostCommonWeather = Object.keys(weatherCounts).reduce((a, b) => weatherCounts[a] > weatherCounts[b] ? a : b);
        const mostCommonDescription = dayData.descriptions[dayData.weather.indexOf(mostCommonWeather)] || mostCommonWeather;


        return {
          date,
          dayOfWeek: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
          avgTemp: Math.round(avgTemp),
          weather: mostCommonWeather,
          weatherDescription: mostCommonDescription,
        };
      });

      return { forecast: processedForecast };

    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      return { error: "Could not retrieve weather forecast at this time." };
    }
}
