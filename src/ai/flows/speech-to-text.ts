'use server';
/**
 * @fileOverview A flow for transcribing audio to text.
 *
 * - speechToText - A function that transcribes audio data to text.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

const SpeechToTextInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A recording, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export async function speechToText(audioDataUri: string): Promise<string> {
    return speechToTextFlow({ audioDataUri });
}

const speechToTextFlow = ai.defineFlow(
  {
    name: 'speechToTextFlow',
    inputSchema: SpeechToTextInputSchema,
    outputSchema: z.string(),
  },
  async ({ audioDataUri }) => {
    const { text } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt: [
        { text: 'Please transcribe the following audio recording.' },
        { media: { url: audioDataUri } },
      ],
    });
    return text;
  }
);
