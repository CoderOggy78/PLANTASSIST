import { config } from 'dotenv';
config();

import '@/ai/flows/identify-plant-disease-from-image.ts';
import '@/ai/flows/ask-plant-doctor.ts';
import '@/ai/flows/speech-to-text.ts';
import '@/ai/flows/get-regional-alerts.ts';
