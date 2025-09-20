
"use client";

import { Cloud, CloudDrizzle, CloudFog, CloudHail, CloudLightning, CloudRain, CloudSnow, CloudSun, Sun, Wind } from 'lucide-react';

interface WeatherIconProps {
  weather: string;
  className?: string;
}

export default function WeatherIcon({ weather, className }: WeatherIconProps) {
  const iconProps = {
    className: className || "w-full h-full text-primary",
  };

  switch (weather) {
    case 'Clear':
      return <Sun {...iconProps} />;
    case 'Clouds':
      return <Cloud {...iconProps} />;
    case 'Drizzle':
      return <CloudDrizzle {...iconProps} />;
    case 'Rain':
      return <CloudRain {...iconProps} />;
    case 'Thunderstorm':
      return <CloudLightning {...iconProps} />;
    case 'Snow':
      return <CloudSnow {...iconProps} />;
    case 'Mist':
    case 'Fog':
      return <CloudFog {...iconProps} />;
    default:
      return <CloudSun {...iconProps} />;
  }
}
