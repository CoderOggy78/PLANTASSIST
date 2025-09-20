"use client";

import { useState, useEffect } from 'react';
import { getRegionalAlerts, GetRegionalAlertsOutput } from '@/ai/flows/get-regional-alerts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

type Status = 'idle' | 'loading' | 'success' | 'error' | 'denied';

export default function RegionalAlerts() {
  const [status, setStatus] = useState<Status>('idle');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [alertsData, setAlertsData] = useState<GetRegionalAlertsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    setStatus('loading');
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        if (error.code === error.PERMISSION_DENIED) {
            setStatus('denied');
            setError('Location permission denied. Please enable it in your browser settings to see regional alerts.');
        } else {
            setStatus('error');
            setError('Could not retrieve your location. Please try again.');
        }
      }
    );
  };

  useEffect(() => {
    if (location) {
      const fetchAlerts = async () => {
        try {
          const data = await getRegionalAlerts(location);
          setAlertsData(data);
          setStatus('success');
        } catch (err) {
          console.error("Error fetching alerts:", err);
          setStatus('error');
          setError('Failed to fetch outbreak alerts. Please try again later.');
        }
      };
      fetchAlerts();
    }
  }, [location]);

  const getSeverityBadge = (severity: 'Low' | 'Medium' | 'High') => {
    switch (severity) {
        case 'Low':
            return <Badge variant="secondary">Low</Badge>;
        case 'Medium':
            return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">Medium</Badge>;
        case 'High':
            return <Badge variant="destructive">High</Badge>;
    }
  }

  return (
    <div className="space-y-6">
      {status === 'idle' && (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Enable Location to See Alerts</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">We need your location to show you relevant disease outbreaks in your area.</p>
                <Button onClick={requestLocation}>
                    <MapPin className="mr-2"/>
                    Allow Location Access
                </Button>
            </CardContent>
        </Card>
      )}

      {status === 'loading' && (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="ml-4 text-muted-foreground">Getting your location and fetching alerts...</p>
        </div>
      )}

      {(status === 'error' || status === 'denied') && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {status === 'success' && alertsData && (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle>AI-Powered Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90">{alertsData.summary}</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alertsData.alerts.map((alert, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                            <span>{alert.diseaseName}</span>
                            {getSeverityBadge(alert.severity)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                       <p><span className="font-semibold">Region:</span> {alert.region}</p>
                       <p><span className="font-semibold">Reported Cases:</span> {alert.reportedCases}</p>
                       <p><span className="font-semibold">First Reported:</span> {alert.firstReported}</p>
                    </CardContent>
                </Card>
            ))}
            </div>
        </div>
      )}
    </div>
  );
}
