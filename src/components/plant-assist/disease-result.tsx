"use client";

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, AlertCircle, HeartPulse, ShieldHalf } from 'lucide-react';
import { useHistory } from '@/hooks/use-history';
import type { IdentifyPlantDiseaseFromImageOutput } from '@/ai/flows/identify-plant-disease-from-image';

interface DiseaseResultProps {
  result: IdentifyPlantDiseaseFromImageOutput;
  imagePreview: string | null;
}

export default function DiseaseResult({ result, imagePreview }: DiseaseResultProps) {
  const { addHistoryItem } = useHistory();

  useEffect(() => {
    if (result && imagePreview) {
      addHistoryItem(imagePreview, result);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, imagePreview]);


  if (!result.diseaseName) {
    return (
      <Card className="animate-in fade-in duration-500 border-primary/50 bg-primary/5">
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <CheckCircle2 className="w-10 h-10 text-primary flex-shrink-0" />
          <div>
            <CardTitle className="text-primary">All Clear!</CardTitle>
            <CardDescription className="text-primary/80">
              Our analysis did not detect any diseases on your plant. Keep up the great work!
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <AlertCircle className="w-8 h-8 text-primary" />
          {result.diseaseName}
        </CardTitle>
        <CardDescription className="pt-2">
          Confidence Score: <Badge variant="secondary" className="font-semibold">{Math.round((result.confidence || 0) * 100)}%</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2"><HeartPulse className="text-primary"/>Effects on Plant</h3>
          <p className="text-muted-foreground">{result.effects}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2"><ShieldHalf className="text-primary"/>Suggested Remedies</h3>
          <p className="text-muted-foreground">{result.remedies}</p>
        </div>
      </CardContent>
    </Card>
  );
}
