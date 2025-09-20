
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ScanLine, BookOpen, MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Image
          src="https://picsum.photos/seed/farmer-field/1800/1200"
          alt="Farmer inspecting crops in a field"
          fill
          className="object-cover -z-10"
          data-ai-hint="farmer field"
        />
        <div className="absolute inset-0 bg-background/60 dark:bg-background/80 -z-10" />

        <div className="container mx-auto max-w-5xl py-8 px-4 space-y-10 text-center">
            <header className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold text-primary font-headline tracking-tight">Welcome to PlantAssist</h1>
                <p className="text-foreground/80 text-lg">Your digital plant doctor, ready to help.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                <Card className="hover:shadow-xl transition-shadow duration-300 bg-background/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                        <ScanLine className="w-7 h-7 text-primary" />
                        <span className="font-headline text-2xl">Diagnose Plant</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">Upload a photo for an instant health diagnosis.</p>
                        <Button asChild className="font-semibold">
                        <Link href="/">Upload Image <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card className="hover:shadow-xl transition-shadow duration-300 bg-background/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                        <MessageSquare className="w-7 h-7 text-primary" />
                        <span className="font-headline text-2xl">AI Assistant</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">Ask our AI Plant Doctor any question.</p>
                        <Button asChild className="font-semibold">
                        <Link href="/chat">Start Chat <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-xl transition-shadow duration-300 bg-background/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                        <BookOpen className="w-7 h-7 text-primary" />
                        <span className="font-headline text-2xl">Knowledge Base</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">Browse common diseases and their remedies.</p>
                        <Button asChild className="font-semibold">
                        <Link href="/knowledge-base">Explore <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-xl transition-shadow duration-300 bg-background/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                        <Users className="w-7 h-7 text-primary" />
                        <span className="font-headline text-2xl">Community</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">Connect with other farmers and share tips.</p>
                        <Button asChild className="font-semibold">
                        <Link href="/community">Join Forum <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
