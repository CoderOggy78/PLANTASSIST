'use server';

import { identifyPlantDiseaseFromImage, IdentifyPlantDiseaseFromImageOutput } from '@/ai/flows/identify-plant-disease-from-image';
import { z } from 'zod';

export type FormState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  data: IdentifyPlantDiseaseFromImageOutput | null;
  timestamp?: number;
};

const imageSchema = z.object({
  image: z.instanceof(File).refine(file => file.size > 0, 'Image is required.'),
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
  const validation = imageSchema.safeParse({ image: formData.get('image') });
  if (!validation.success) {
    return {
      status: 'error',
      message: validation.error.errors.map(e => e.message).join(', '),
      data: null,
    };
  }

  const file = validation.data.image;

  try {
    const photoDataUri = await fileToDataURI(file);
    
    const result = await identifyPlantDiseaseFromImage({ photoDataUri });

    if (!result) {
        return {
            status: 'error',
            message: 'Failed to get a result from the AI.',
            data: null,
        }
    }

    if (!result.diseaseName) {
        return {
            status: 'success',
            message: 'No disease identified in the image.',
            data: result,
            timestamp: Date.now(),
        }
    }

    return {
        status: 'success',
        message: 'Disease identified successfully.',
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
