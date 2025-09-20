import { config } from 'dotenv';
config();

import '@/ai/flows/identify-plant-disease-from-image.ts';
import '@/ai/flows/ask-plant-doctor.ts';
import '@/ai/flows/speech-to-text.ts';
import '@/ai/flows/get-regional-alerts.ts';
import '@/ai/tools/weather-tool.ts';
import '@/ai/tools/disease-knowledge-base-tool.ts';
import '@/ai/flows/get-fertilizer-recommendation.ts';
import '@/ai/flows/predict-yield.ts';
import '@/ai/flows/get-schemes.ts';
import '@/ai/flows/get-weather-forecast-flow.ts';
