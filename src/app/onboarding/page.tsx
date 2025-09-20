
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const onboardingSteps = [
  {
    title: 'Scan Your Plants',
    description: 'Take a picture of your plant to instantly identify potential diseases and issues.',
    image: 'https://picsum.photos/seed/onboard1/600/400',
    imageHint: 'phone scanning plant'
  },
  {
    title: 'Get Instant Remedies',
    description: 'Receive expert-backed advice and treatment plans to nurse your plants back to health.',
    image: 'https://picsum.photos/seed/onboard2/600/400',
    imageHint: 'gardening tools'
  },
  {
    title: 'Farmer-Friendly Tips',
    description: 'Access a knowledge base of tips and best practices to keep your garden thriving.',
    image: 'https://picsum.photos/seed/onboard3/600/400',
    imageHint: 'happy farmer'
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/home');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <div className="relative w-full aspect-video">
          <Image
            src={step.image}
            alt={step.title}
            fill
            className="object-cover"
            data-ai-hint={step.imageHint}
          />
        </div>
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold font-headline mb-2">{step.title}</h2>
          <p className="text-muted-foreground mb-8">{step.description}</p>
          
          <Progress value={progress} className="mb-8 h-2" />

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2" />
              Back
            </Button>
            <Button onClick={handleNext}>
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
