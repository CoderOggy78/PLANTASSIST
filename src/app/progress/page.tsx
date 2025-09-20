
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart as LineChartIcon, Leaf, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const progressData = [
  { name: 'Week 1', health: 30, diagnosis: 'Leaf Rust' },
  { name: 'Week 2', health: 55, diagnosis: 'Treatment Applied' },
  { name: 'Week 3', health: 75, diagnosis: 'Signs of Recovery' },
  { name: 'Week 4', health: 90, diagnosis: 'Healthy' },
];

export default function ProgressPage() {
  return (
    <div className="container mx-auto max-w-4xl py-4">
       <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary font-headline flex items-center justify-center gap-3">
            <LineChartIcon className="w-8 h-8"/>
            Progress Tracking
        </h1>
        <p className="text-muted-foreground">Monitor your plant's recovery over time.</p>
      </header>
      
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <TrendingUp />
                    Tomato Plant Health
                </CardTitle>
                <CardDescription>Recovery from Leaf Rust after treatment.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis unit="%" />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                        <Legend />
                        <Line type="monotone" dataKey="health" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Leaf/>
                    Visual Progress
                </CardTitle>
                 <CardDescription>Side-by-side comparison of your plant's condition.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <h3 className="font-semibold text-center">Before Treatment (Week 1)</h3>
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                         <Image
                            src="https://picsum.photos/seed/progress-before/600/400"
                            alt="Diseased plant before treatment"
                            fill
                            className="object-cover"
                            data-ai-hint="diseased plant"
                        />
                    </div>
                </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold text-center">After Treatment (Week 4)</h3>
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                         <Image
                            src="https://picsum.photos/seed/progress-after/600/400"
                            alt="Healthy plant after treatment"
                            fill
                            className="object-cover"
                            data-ai-hint="healthy plant"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
