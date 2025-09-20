
'use server';

import { identifyPlantDiseaseFromImage, IdentifyPlantDiseaseFromImageInput, IdentifyPlantDiseaseFromImageOutput } from '@/ai/flows/identify-plant-disease-from-image';
import { z } from 'zod';

export type FormState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  data: IdentifyPlantDiseaseFromImageOutput | null;
  timestamp?: number;
};

const imageSchema = z.object({
  image: z.instanceof(File).refine(file => file.size > 0, 'Image is required.'),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

function fileToDataURI(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const arrayBuffer = file.arrayBuffer();
    arrayBuffer.then(buffer => {
      const base64 = Buffer.from(buffer).toString('base64');
      resolve(`data:${file.type};base64,${base64}`);
    }).catch(reject);
  });
}

export async function handleImageUpload(prevState: FormState, formData: FormData): Promise<FormState> {
  const validation = imageSchema.safeParse({ 
    image: formData.get('image'),
    latitude: formData.get('latitude'),
    longitude: formData.get('longitude'),
  });

  if (!validation.success) {
    return {
      status: 'error',
      message: validation.error.errors.map(e => e.message).join(', '),
      data: null,
    };
  }

  const { image: file, latitude, longitude } = validation.data;

  try {
    const photoDataUri = await fileToDataURI(file);
    
    const input: IdentifyPlantDiseaseFromImageInput = { photoDataUri };
    if (latitude && longitude) {
        input.latitude = parseFloat(latitude);
        input.longitude = parseFloat(longitude);
    }

    const result = await identifyPlantDiseaseFromImage(input);

    if (!result) {
        return {
            status: 'error',
            message: 'Failed to get a result from the AI.',
            data: null,
        }
    }

    return {
        status: 'success',
        message: 'Analysis complete.',
        data: result,
        timestamp: Date.now(),
    };
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      message: 'An unexpected error occurred. Please try again.',
      data: null,
    };
  }
}
