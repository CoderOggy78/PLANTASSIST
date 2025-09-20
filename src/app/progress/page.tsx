
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Construction } from 'lucide-react';

export default function ProgressPage() {
  return (
    <div className="container mx-auto max-w-4xl py-4">
       <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary font-headline flex items-center justify-center gap-3">
            <LineChart className="w-8 h-8"/>
            Progress Tracking
        </h1>
        <p className="text-muted-foreground">Monitor your plant's recovery over time.</p>
      </header>
      
      <Card className="text-center">
        <CardHeader>
            <CardTitle className="flex items-center justify-center gap-3">
                <Construction className="w-8 h-8 text-yellow-500"/>
                Coming Soon!
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">We're developing a tool to help you track your plant's health progress after treatment. Check back soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
