
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, AlertTriangle, CloudSun } from 'lucide-react';
import { Button } from '../ui/button';
import WeatherIcon from './weather-icon';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { fetchWeather, ForecastDay } from '@/lib/weather-actions';

type Status = 'idle' | 'loading' | 'success' | 'error' | 'denied';

export default function WeatherForecast() {
  const [status, setStatus] = useState<Status>('idle');
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestLocationAndFetchWeather = () => {
    setStatus('loading');
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await fetchWeather({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          if (data.error) {
            setStatus('error');
            setError(data.error);
          } else {
            setForecast(data.forecast);
            setStatus('success');
          }
        } catch (err) {
          console.error("Failed to fetch weather data:", err);
          setStatus('error');
          setError("Could not retrieve weather forecast.");
        }
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
