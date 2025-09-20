'use server';

import { askPlantDoctor, AskPlantDoctorOutput } from "@/ai/flows/ask-plant-doctor";
import { speechToText } from "@/ai/flows/speech-to-text";

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
    audio?: string;
}

export interface ChatState {
    messages: ChatMessage[];
}

async function getResponse(userMessage: string): Promise<AskPlantDoctorOutput> {
    try {
        const modelResponse = await askPlantDoctor(userMessage);
        return modelResponse;

    } catch (error) {
        console.error(error);
        return {
            text: 'Sorry, I encountered an error. Please try again.',
        };
    }
}

export async function handleUserMessage(prevState: ChatState, formData: FormData): Promise<ChatState> {
    const userMessage = formData.get('userMessage') as string;
    const audioBlob = formData.get('audioBlob') as File;
    let transcribedMessage = '';

    if (audioBlob && audioBlob.size > 0) {
        const audioBuffer = await audioBlob.arrayBuffer();
        const audioDataUri = `data:${audioBlob.type};base64,${Buffer.from(audioBuffer).toString('base64')}`;
        try {
            transcribedMessage = await speechToText(audioDataUri);
        } catch(e) {
            console.error(e);
            return {
                messages: [
                    ...prevState.messages,
                    { role: 'model', content: 'Sorry, I had trouble understanding your recording. Please try again.' },
                ],
            }
        }
    }

    const finalMessage = userMessage || transcribedMessage;

    if (!finalMessage) {
        return prevState;
    }

    const newMessages: ChatMessage[] = [
        ...prevState.messages,
        { role: 'user', content: finalMessage },
    ];
    
    const { text, audio } = await getResponse(finalMessage);
        
    return {
        messages: [
            ...newMessages,
            { role: 'model', content: text, audio },
        ],
    };
}
