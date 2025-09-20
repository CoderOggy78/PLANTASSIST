
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { FlaskConical, Lightbulb } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

type SoilData = {
  ph: number;
  moisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
};

export default function SoilHealthPage() {
  const [soilData, setSoilData] = useState<SoilData>({
    ph: 6.5,
    moisture: 50,
    nitrogen: 15,
    phosphorus: 20,
    potassium: 25,
  });

  const [recommendation, setRecommendation] = useState<string | null>(null);

  const handleSliderChange = (field: keyof SoilData) => (value: number[]) => {
    setSoilData(prev => ({ ...prev, [field]: value[0] }));
  };
  
  const getAIRecommendation = () => {
    // In a real app, this would call a Genkit flow with the soilData and weather info
    const mockRecommendation = `Based on your soil data and the upcoming sunny weather:
- **Fertilizer:** Apply a balanced NPK fertilizer (10-10-10) at a rate of 3 lbs per 100 sq ft.
- **pH Adjustment:** Your soil pH is slightly acidic but in a good range. No immediate action needed.
- **Timing:** Apply fertilizer in the early morning tomorrow to take advantage of the dry conditions. Water it in lightly.
- **Next Steps:** Monitor for nutrient deficiency signs in 2-3 weeks.`;
    setRecommendation(mockRecommendation);
  }

  return (
    <div className="container mx-auto max-w-3xl py-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary font-headline flex items-center justify-center gap-3">
          <FlaskConical className="w-8 h-8" />
          Fertilizer & Soil Advisor
        </h1>
        <p className="text-muted-foreground">Log your soil data to get AI-powered fertilizer recommendations.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Enter Soil Data</CardTitle>
            <CardDescription>Adjust the sliders to match your soil test results.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="ph">Soil pH</Label>
                <Badge variant="secondary" className="w-16 justify-center">{soilData.ph.toFixed(1)}</Badge>
              </div>
              <Slider id="ph" value={[soilData.ph]} onValueChange={handleSliderChange('ph')} min={4} max={9} step={0.1} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="moisture">Moisture</Label>
                <Badge variant="secondary" className="w-16 justify-center">{soilData.moisture}%</Badge>
              </div>
              <Slider id="moisture" value={[soilData.moisture]} onValueChange={handleSliderChange('moisture')} min={0} max={100} step={1} />
            </div>
             <Separator/>
            <div className="space-y-3">
               <div className="flex justify-between">
                <Label htmlFor="nitrogen">Nitrogen (N)</Label>
                 <Badge variant="secondary" className="w-16 justify-center">{soilData.nitrogen} ppm</Badge>
              </div>
              <Slider id="nitrogen" value={[soilData.nitrogen]} onValueChange={handleSliderChange('nitrogen')} min={0} max={50} step={1} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="phosphorus">Phosphorus (P)</Label>
                <Badge variant="secondary" className="w-16 justify-center">{soilData.phosphorus} ppm</Badge>
              </div>
              <Slider id="phosphorus" value={[soilData.phosphorus]} onValueChange={handleSliderChange('phosphorus')} min={0} max={50} step={1} />
            </div>
            <div className="space-y-3">
               <div className="flex justify-between">
                <Label htmlFor="potassium">Potassium (K)</Label>
                <Badge variant="secondary" className="w-16 justify-center">{soilData.potassium} ppm</Badge>
              </div>
              <Slider id="potassium" value={[soilData.potassium]} onValueChange={handleSliderChange('potassium')} min={0} max={50} step={1} />
            </div>
          </CardContent>
           <CardFooter>
                <Button className="w-full" onClick={getAIRecommendation}>Get AI Recommendations</Button>
            </CardFooter>
        </Card>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-primary"/>
                AI Recommendation
            </CardTitle>
            <CardDescription>Optimal advice based on your data and local weather.</CardDescription>
          </CardHeader>
          <CardContent>
            {recommendation ? (
                <div className="space-y-2 text-sm whitespace-pre-wrap">
                    {recommendation.split('\n').map((line, index) => {
                        if (line.startsWith('- **')) {
                            const [key, value] = line.substring(2).split(':');
                            return <p key={index}><strong className="font-semibold">{key.replace(/\*/g, '')}:</strong>{value}</p>
                        }
                        return <p key={index}>{line}</p>
                    })}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-10">
                    <p>Your personalized recommendation will appear here.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
