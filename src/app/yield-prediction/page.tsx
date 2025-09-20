
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AreaChart as AreaChartIcon, AlertTriangle, TrendingUp, Wheat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const yieldData = {
    tomato: [
      { month: 'Sep', predictedYield: 4.5, historicalAvg: 4.2 },
      { month: 'Oct', predictedYield: 5.1, historicalAvg: 4.8 },
      { month: 'Nov', predictedYield: 5.3, historicalAvg: 5.0 },
      { month: 'Dec', predictedYield: 5.2, historicalAvg: 5.1 },
    ],
    wheat: [
      { month: 'Mar', predictedYield: 3.8, historicalAvg: 3.5 },
      { month: 'Apr', predictedYield: 4.0, historicalAvg: 3.9 },
      { month: 'May', predictedYield: 4.2, historicalAvg: 4.1 },
      { month: 'Jun', predictedYield: 4.1, historicalAvg: 4.0 },
    ],
     corn: [
      { month: 'Nov', predictedYield: 7.8, historicalAvg: 7.5 },
      { month: 'Dec', predictedYield: 8.2, historicalAvg: 8.0 },
      { month: 'Jan', predictedYield: 8.5, historicalAvg: 8.3 },
      { month: 'Feb', predictedYield: 8.4, historicalAvg: 8.2 },
    ],
};

const riskFactors = {
    tomato: "Slightly higher than average rainfall forecasted for October may increase the risk of 'Late Blight', potentially impacting fruit quality if not managed proactively. Market prices are expected to be stable.",
    wheat: "Cooler temperatures in early April could slow initial growth, but overall conditions look favorable for a strong harvest. Watch for early signs of 'Leaf Rust'.",
    corn: "Excellent soil moisture levels and a warm start to the season suggest a high-potential yield. The primary risk is a potential dry spell in late January; ensure irrigation plans are ready."
}


export default function YieldPredictionPage() {
    const [selectedCrop, setSelectedCrop] = useState('tomato');
    const data = yieldData[selectedCrop as keyof typeof yieldData];
    const risks = riskFactors[selectedCrop as keyof typeof riskFactors];

  return (
    <div className="container mx-auto max-w-4xl py-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary font-headline flex items-center justify-center gap-3">
          <AreaChartIcon className="w-8 h-8" />
          AI-Powered Yield Prediction
        </h1>
        <p className="text-muted-foreground">Get data-driven yield forecasts for your crops.</p>
      </header>

      <div className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Select Your Crop</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a crop" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tomato">Tomato</SelectItem>
                            <SelectItem value="wheat">Wheat</SelectItem>
                            <SelectItem value="corn">Corn</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Wheat />
                        Current Prediction
                    </CardTitle>
                    <CardDescription>Estimated yield for the current season.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{data[data.length-1].predictedYield} <span className="text-lg font-normal text-muted-foreground">tons/acre</span></p>
                    <Badge className="mt-2">Confidence: 88%</Badge>
                </CardContent>
            </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <TrendingUp />
              Yield Forecast
            </CardTitle>
            <CardDescription>Projected yield over the next few months compared to historical averages.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis unit=" t/a" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                <Legend />
                <Area type="monotone" dataKey="predictedYield" name="Predicted Yield" stroke="hsl(var(--primary))" fill="hsla(var(--primary), 0.2)" strokeWidth={2} />
                <Area type="monotone" dataKey="historicalAvg" name="Historical Avg." stroke="hsl(var(--muted-foreground))" fill="hsla(var(--muted-foreground), 0.1)" strokeWidth={2} strokeDasharray="5 5"/>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Key Factors & Risks</AlertTitle>
            <AlertDescription>
              {risks}
            </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
