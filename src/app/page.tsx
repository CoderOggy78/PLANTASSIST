import Image from "next/image";
import ImageUploader from "@/components/plant-assist/image-uploader";

export default function IdentifyPage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
       <Image
          src="https://picsum.photos/seed/plant-close-up/1800/1200"
          alt="Close-up of a vibrant green plant"
          fill
          className="object-cover -z-10"
          data-ai-hint="plant close-up"
        />
        <div className="absolute inset-0 bg-background/60 dark:bg-background/80 -z-10" />

      <div className="container mx-auto max-w-2xl py-4">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary font-headline">Plant Disease Identifier</h1>
          <p className="text-muted-foreground">Upload an image to get an instant diagnosis for your plant.</p>
        </header>
        <ImageUploader />
      </div>
    </div>
  );
}
