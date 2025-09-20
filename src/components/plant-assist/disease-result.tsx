
"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, AlertCircle, HeartPulse, ShieldHalf, Store, Sparkles } from 'lucide-react';
import { useHistory } from '@/hooks/use-history';
import type { IdentifyPlantDiseaseFromImageOutput } from '@/ai/flows/identify-plant-disease-from-image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
              Our analysis identified the plant as a <strong>{result.plantName || 'Unknown Plant'}</strong> and did not detect any diseases. Keep up the great work!
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
        <CardDescription className="pt-2 flex flex-wrap gap-x-4 gap-y-2">
          <span>Identified Plant: <Badge variant="outline">{result.plantName || 'Unknown'}</Badge></span>
          {result.confidence && <span>Confidence Score: <Badge variant="secondary" className="font-semibold">{Math.round(result.confidence * 100)}%</Badge></span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />
        
        {result.generatedImageUri && (
             <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Sparkles className="text-primary"/>Healthy Plant Goal</h3>
                 <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <Image
                        src={result.generatedImageUri}
                        alt={`AI generated image of a healthy ${result.plantName}`}
                        fill
                        className="object-cover"
                    />
                </div>
                <p className="text-xs text-muted-foreground text-center">AI-generated image of a healthy {result.plantName}.</p>
            </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2"><HeartPulse className="text-primary"/>Effects on Plant</h3>
          <p className="text-muted-foreground">{result.effects || 'No details available.'}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2"><ShieldHalf className="text-primary"/>Suggested Remedies</h3>
          <p className="text-muted-foreground">{result.remedies || 'No specific remedies provided.'}</p>
        </div>

        <Separator />
        
        <motion.div whileTap={{ scale: 0.95 }} className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Store className="text-primary"/>Find Remedies Nearby</h3>
            <p className="text-muted-foreground text-sm">Find local agri-shops that sell the recommended products to treat this disease.</p>
            <Button asChild className="w-full sm:w-auto">
            <Link href={`/shops/${encodeURIComponent(result.diseaseName)}`}>
                Find Agri-Shops Nearby
            </Link>
            </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
