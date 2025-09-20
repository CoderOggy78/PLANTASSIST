
"use client";

import { useActionState } from 'react';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Camera, Leaf, Loader2, X, UploadCloud, MapPin } from 'lucide-react';

import { handleImageUpload, FormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import DiseaseResult from './disease-result';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '@/hooks/use-toast';

const initialState: FormState = {
  status: 'idle',
  message: '',
  data: null,
};

function SubmitButton() {
  const { pending } = useActionState();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full text-lg py-7 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          Identifying...
        </>
      ) : (
        <>
          <Leaf className="mr-3 h-6 w-6" />
          Identify Disease
        </>
      )}
    </Button>
  );
}

export default function ImageUploader() {
  const [formState, formAction] = useActionState(handleImageUpload, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'denied'>('idle');
  const { toast } = useToast();


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    formRef.current?.reset();
  };

  useEffect(() => {
    if (formState.status === 'success' && !formState.data?.diseaseName) {
      const timer = setTimeout(() => {
        handleRemoveImage();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formState]);
  
  const requestLocation = () => {
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus('success');
        toast({ title: 'Location Acquired', description: 'Weather-aware recommendations will be provided.' });
      },
      (error) => {
        console.error("Geolocation error:", error);
        if (error.code === error.PERMISSION_DENIED) {
            setLocationStatus('denied');
            toast({ variant: 'destructive', title: 'Location Denied', description: 'Weather-aware features disabled.'});
        } else {
            setLocationStatus('error');
            toast({ variant: 'destructive', title: 'Location Error', description: 'Could not get your location.'});
        }
      }
    );
  };


  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <form 
            action={(formData) => {
                if (location) {
                    formData.append('latitude', String(location.latitude));
                    formData.append('longitude', String(location.longitude));
                }
                formAction(formData);
            }} 
            ref={formRef} 
            className="space-y-4"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="crop-type">Crop Type (e.g., Tomato, Rice)</Label>
                <Input
                  id="crop-type"
                  name="cropType"
                  type="text"
                  placeholder="Enter the name of your crop"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plant-image" className="sr-only">Upload a Plant Image</Label>
                <div className="relative border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors bg-card/50 hover:bg-card">
                  <Input
                    id="plant-image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    required
                  />
                  {!preview ? (
                    <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground pointer-events-none py-8">
                      <UploadCloud className="w-12 h-12 text-primary" />
                      <p className="font-semibold text-lg">Click to upload or drag & drop</p>
                      <p className="text-sm">PNG, JPG or WEBP recommended</p>
                    </div>
                  ) : (
                    <div className="relative w-full h-56">
                      <Image
                        src={preview}
                        alt="Plant preview"
                        fill
                        className="object-contain rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 bg-destructive/80 hover:bg-destructive text-destructive-foreground rounded-full h-8 w-8 z-10"
                        onClick={handleRemoveImage}
                      >
                        <X className="w-4 h-4" />
                        <span className="sr-only">Remove image</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
                 <Button
                    type="button"
                    variant={locationStatus === 'success' ? 'secondary' : 'outline'}
                    onClick={requestLocation}
                    disabled={locationStatus === 'loading'}
                    className="w-full sm:w-auto"
                >
                    {locationStatus === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    {locationStatus === 'success' ? <MapPin className="mr-2 h-4 w-4 text-primary"/> : <MapPin className="mr-2 h-4 w-4"/>}
                    Get Weather
                </Button>
                {preview && <SubmitButton />}
            </div>

          </form>
        </CardContent>
      </Card>

       {formState.status === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>{formState.message}</AlertDescription>
        </Alert>
      )}
      
      {formState.status === 'success' && formState.data && (
        <DiseaseResult result={formState.data} imagePreview={preview} key={formState.timestamp}/>
      )}
    </div>
  );
}
