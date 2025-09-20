
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ScanLine, BookOpen } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 space-y-10">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary font-headline tracking-tight">Welcome to PlantAssist</h1>
        <p className="text-muted-foreground text-lg">Your digital plant doctor, ready to help.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <ScanLine className="w-7 h-7 text-primary" />
              <span className="font-headline text-2xl">Diagnose a Plant</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Upload a photo to get an instant diagnosis of its health.</p>
            <Button asChild variant="secondary" className="font-semibold">
              <Link href="/">Upload Image <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-primary" />
              <span className="font-headline text-2xl">Knowledge Base</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Browse common diseases and their remedies.</p>
            <Button asChild variant="secondary" className="font-semibold">
              <Link href="/knowledge-base">Explore Articles <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
