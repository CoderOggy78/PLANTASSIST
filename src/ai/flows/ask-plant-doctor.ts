
'use server';
/**
 * @fileOverview A conversational AI flow for answering plant-related questions.
 *
 * - askPlantDoctor - A function that handles user queries to the plant doctor AI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import {googleAI} from '@genkit-ai/googleai';
import { AskPlantDoctorOutput, AskPlantDoctorOutputSchema } from '@/lib/types';
import { findDiseaseInfo } from '@/ai/tools/disease-knowledge-base-tool';


export async function askPlantDoctor(question: string): Promise<AskPlantDoctorOutput> {
  return askPlantDoctorFlow(question);
}

const prompt = ai.definePrompt({
  name: 'askPlantDoctorPrompt',
  input: {schema: z.string()},
  output: {schema: z.string()},
  tools: [findDiseaseInfo],
  prompt: `You are PlantBot, an expert agricultural assistant. Your role is to answer user questions about plant diseases.

  If the user asks for information about a specific disease, you MUST use the findDiseaseInfo tool to get the details from the knowledge base.
  
  When presenting the information, format it clearly for the user. If the tool returns no information, politely inform the user that the disease is not in the knowledge base.

  For general questions not related to a specific disease, answer them based on your expertise in botany and agriculture. Be friendly, encouraging, and provide clear, actionable advice. If you don't know the answer, say so. Do not make up information.

  User Question: {{{input}}}`,
});

async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      let bufs = [] as any[];
      writer.on('error', reject);
      writer.on('data', function (d) {
        bufs.push(d);
      });
      writer.on('end', function () {
        resolve(Buffer.concat(bufs).toString('base64'));
      });
  
      writer.write(pcmData);
      writer.end();
    });
  }

const askPlantDoctorFlow = ai.defineFlow(
  {
    name: 'askPlantDoctorFlow',
    inputSchema: z.string(),
    outputSchema: AskPlantDoctorOutputSchema,
  },
  async question => {
    const {output: text} = await prompt(question);

    if (!text) {
        throw new Error('No text response from AI');
    }
    
    const {media} = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: text, // Use the generated text for TTS
    });

    if (!media) {
        return { text };
    }

    const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
    );
      
    const audioDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return { text, audio: audioDataUri };
  }
);
