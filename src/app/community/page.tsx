import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Construction } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="container mx-auto max-w-4xl py-4">
       <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary font-headline flex items-center justify-center gap-3">
            <Users className="w-8 h-8"/>
            Community Forum
        </h1>
        <p className="text-muted-foreground">Share knowledge and connect with other farmers.</p>
      </header>
      
      <Card className="text-center">
        <CardHeader>
            <CardTitle className="flex items-center justify-center gap-3">
                <Construction className="w-8 h-8 text-yellow-500"/>
                Coming Soon!
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">We're working hard to build a space for our community to connect. Check back soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
