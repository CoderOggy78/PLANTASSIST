
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, AlertTriangle, CloudSun } from 'lucide-react';
import { Button } from '../ui/button';
import WeatherIcon from './weather-icon';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type Status = 'idle' | 'loading' | 'success' | 'error' | 'denied';

interface ForecastDay {
    date: string;
    dayOfWeek: string;
    avgTemp: number;
    weather: string;
    weatherDescription: string;
}

export default function WeatherForecast() {
  const [status, setStatus] = useState<Status>('idle');
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestLocationAndFetchWeather = () => {
    setStatus('loading');
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        if (error.code === error.PERMISSION_DENIED) {
            setStatus('denied');
            setError('Location permission denied. Please enable it to see the weather forecast.');
        } else {
            setStatus('error');
            setError('Could not retrieve your location.');
        }
      }
    );
  };
  
  const fetchWeather = async ({ latitude, longitude }: { latitude: number, longitude: number }) => {
    // This action will securely fetch the weather on the server.
    // For demonstration, we are calling a client-side fetch, but in a real app
    // you'd create a server action that calls the Genkit flow to hide the API key.
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY || "6d055e39ee237af35ca066f35474e9df";
    
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API request failed with status ${response.status}`);
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

      setForecast(processedForecast);
      setStatus('success');

    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      setStatus('error');
      setError("Could not retrieve weather forecast.");
    }
  }


  if (status === 'idle') {
    return (
        <Card className="text-center">
            <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">Allow location access to view your local weather forecast.</p>
                <Button onClick={requestLocationAndFetchWeather}>
                    <MapPin className="mr-2"/>
                    Get Forecast
                </Button>
            </CardContent>
        </Card>
    )
  }

  if (status === 'loading') {
    return (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
    )
  }

  if (status === 'error' || status === 'denied') {
    return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Weather Unavailable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
  }

  if (status === 'success' && forecast) {
     return (
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
            {forecast.map(day => (
                <Card key={day.date} className="flex flex-col items-center justify-center p-4">
                    <p className="font-bold text-lg">{day.dayOfWeek}</p>
                    <div className="w-16 h-16 my-2">
                        <WeatherIcon weather={day.weather} />
                    </div>
                    <p className="font-semibold text-2xl">{day.avgTemp}°C</p>
                    <p className="text-xs text-muted-foreground capitalize">{day.weatherDescription}</p>
                </Card>
            ))}
         </div>
     )
  }

  return null;
}
