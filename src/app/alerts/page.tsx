
import RegionalAlerts from '@/components/plant-assist/regional-alerts';
import WeatherForecast from '@/components/plant-assist/weather-forecast';
import { Feather, CloudSun } from 'lucide-react';

export default function AlertsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-4 space-y-8">
      <div>
        <header className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center justify-center gap-3">
                <CloudSun className="w-8 h-8"/>
                Local Weather Forecast
            </h1>
            <p className="text-muted-foreground">5-day forecast for your current location.</p>
        </header>
        <WeatherForecast />
      </div>

       <div>
        <header className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center justify-center gap-3">
                <Feather className="w-8 h-8"/>
                Regional Outbreak Alerts
            </h1>
            <p className="text-muted-foreground">See recent disease outbreaks reported in your area.</p>
        </header>
        <RegionalAlerts />
       </div>
    </div>
  );
}
