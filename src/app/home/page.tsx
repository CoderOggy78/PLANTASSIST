
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ScanLine, BookOpen, User } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-3xl py-4 space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary font-headline">Welcome to PlantAssist</h1>
        <p className="text-muted-foreground">Your digital plant doctor, ready to help.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanLine className="w-6 h-6 text-primary" />
              Diagnose a Plant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Upload a photo to get an instant diagnosis.</p>
            <Button asChild>
              <Link href="/">Upload Image <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Browse common diseases and their remedies.</p>
            <Button asChild>
              <Link href="/knowledge-base">Explore <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
