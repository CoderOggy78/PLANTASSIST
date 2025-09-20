import ImageUploader from "@/components/plant-assist/image-uploader";

export default function IdentifyPage() {
  return (
    <div className="container mx-auto max-w-2xl py-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary font-headline">Plant Disease Identifier</h1>
        <p className="text-muted-foreground">Upload an image to get an instant diagnosis for your plant.</p>
      </header>
      <ImageUploader />
    </div>
  );
}
